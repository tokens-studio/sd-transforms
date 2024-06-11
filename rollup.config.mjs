import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

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
  plugins: [
    nodeResolve({ moduleDirectories: ['node_modules'] }),
    typescript({ tsconfig: 'tsconfig.build.json' }),
  ],
};

export default {
  ...baseCfg,
  output: {
    ...baseCfg.output,
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].js',
  },
  plugins: [...baseCfg.plugins],
};
