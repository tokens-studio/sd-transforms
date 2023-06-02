import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import fs from 'fs';

const CJSOnlyDeps = [
  'style-dictionary',
  'deepmerge',
  'postcss-calc-ast-parser',
  'postcss-value-parser', // used dep of postcss-calc-ast-parser
];

const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));

const externalPackages = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
function regexOfExternals(externalPackages) {
  return externalPackages.map(packageName => new RegExp(`^${packageName}(/.*)?`));
}

const baseCfg = {
  input: 'src/index.ts',
  output: {
    // do not chunk/treeshake
    preserveModules: true,
    // Ensures that CJS default exports are imported properly (based on __esModule)
    // If needed, can switch to 'compat' which checks for .default prop on the default export instead
    // see https://rollupjs.org/configuration-options/#output-interop
    interop: 'auto',
  },
};

// Dual CJS / ESM publish
export default [
  // ESM
  {
    ...baseCfg,
    // commonjs dependencies, which we should bundle so that it's converted to ESM
    // sad reality of NodeJS ecosystem, many packages still don't publish ESM files
    external: regexOfExternals(externalPackages.filter(pkg => !CJSOnlyDeps.includes(pkg))),
    output: {
      ...baseCfg.output,
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].js',
    },
    plugins: [
      nodeResolve({ moduleDirectories: ['node_modules', '__bundled_CJS_dependencies'] }),
      typescript({ tsconfig: 'tsconfig.build.json' }),
      commonjs(),
      // Because we bundle our CJS deps and we preserveModules, normally it would create
      // a dist/node_modules folder for the deps. This is an issue because then the consumer's NodeJS
      // resolution algorithm will pull bare import specifiers from this folder rather than their own root
      // node_modules folder, even for CJS usage :(
      // Therefore, we temporarily move the CJS deps to a different folder, include that
      // in the nodeResolve moduleDirectories and move things back after we're done.
      {
        name: 'move-deps-to-bundle',
        buildStart() {
          CJSOnlyDeps.forEach(dep => {
            fs.cpSync(`node_modules/${dep}`, `__bundled_CJS_dependencies/${dep}`, {
              recursive: true,
            });
            fs.rmSync(`node_modules/${dep}`, { recursive: true });
          });
        },
      },
      {
        name: 'move-deps-back',
        closeBundle() {
          CJSOnlyDeps.forEach(dep => {
            fs.cpSync(`__bundled_CJS_dependencies/${dep}`, `node_modules/${dep}`, {
              recursive: true,
            });
          });
        },
      },
    ],
  },
  // CJS
  {
    ...baseCfg,
    external: regexOfExternals(externalPackages),
    output: {
      ...baseCfg.output,
      // due to our esm output bundling style-dictionary external (cjs -> esm conversion needed by commonjs plugin)
      // a subfolder is created for our ESM output source -> src folder
      dir: 'dist/src',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
    plugins: [
      nodeResolve({ moduleDirectories: ['node_modules'] }),
      typescript({
        tsconfig: 'tsconfig.build.json',
        noForceEmit: true,
        compilerOptions: { outDir: 'dist/src' },
      }),
    ],
  },
];
