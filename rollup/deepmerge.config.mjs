import cjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'path';

const __dirname = new URL(import.meta.url).pathname;
const input = path.join(__dirname, '..', '..', 'node_modules', 'deepmerge', 'index.js');
const file = path.join(__dirname, '..', '..', 'src', 'deepmerge.ts');

export default {
  input,
  output: {
    file,
    format: 'esm',
  },
  plugins: [
    cjs({ esmExternals: false }),
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
