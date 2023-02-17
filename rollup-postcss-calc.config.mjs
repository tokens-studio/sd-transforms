import cjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'node_modules/postcss-calc-ast-parser/dist/index.js',
  output: {
    file: 'src/postcss-calc-ast-parser.js',
    format: 'esm',
  },
  plugins: [
    cjs(),
    nodeResolve(),
    // Unfortunately, tsconfig exclude won't work if the module is imported
    // by some module that is checked by typescript. Therefore, we add @ts-nocheck for this file.
    {
      name: 'add ts-nocheck',
      renderChunk(code) {
        return `// @ts-nocheck\n${code}`;
      },
    },
  ],
};
