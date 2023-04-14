import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import fs from 'fs';

const __dirname = new URL(import.meta.url).pathname;
const input = path.join(__dirname, '..', '..', 'src', 'index.ts');
const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));

const externalPackages = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];
// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
const regexesOfPackages = externalPackages.map(packageName => new RegExp(`^${packageName}(/.*)?`));

export default {
  external: regexesOfPackages,
  input,
  output: {
    dir: 'dist',
    format: 'cjs',
    preserveModules: true,
    entryFileNames: '[name].cjs',
  },
  plugins: [nodeResolve(), typescript({ tsconfig: 'tsconfig.build.json', declaration: false })],
};
