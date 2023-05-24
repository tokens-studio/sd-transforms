import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import fs from 'fs';

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
    preserveModules: true,
    // Ensures that CJS default exports are imported properly (based on __esModule)
    // If needed, can switch to 'compat' which checks for .default prop on the default export instead
    // see https://rollupjs.org/configuration-options/#output-interop
    interop: 'auto',
  },
  plugins: [nodeResolve(), typescript({ tsconfig: 'tsconfig.build.json' })],
};

// Dual CJS / ESM publish
export default [
  {
    ...baseCfg,
    // commonjs dependencies, which we should bundle so that it's converted to esm
    external: regexOfExternals(
      externalPackages.filter(
        pkg => !['style-dictionary', 'deepmerge', 'postcss-calc-ast-parser'].includes(pkg),
      ),
    ),
    output: {
      ...baseCfg.output,
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].js',
    },
    plugins: [...baseCfg.plugins, commonjs()],
  },
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
  },
];
