import cjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import path from 'path';

const __dirname = new URL(import.meta.url).pathname;
const input = path.join(__dirname, '..', '..', 'src', 'index.ts');
const file = path.join(__dirname, '..', '..', 'dist', 'index.cjs');

export default {
  input,
  output: {
    file,
    format: 'cjs',
  },
  plugins: [
    cjs(),
    nodeResolve(),
    typescript({ noEmit: true }), // noEmit doesn't seem to do anything...?
    // For some reason I can't get this typescript rollup plugin to stop emitting .D.TS files
    // so here's a quick plugin to delete those from the bundle pre- bundle.write().
    // .D.TS files are already emitted by TSC when compiling the lib, this config is only for
    // outputting a CJS bundle for users that require CJS...
    {
      name: 'prevent-type-decl',
      generateBundle(_, bundle) {
        Object.keys(bundle).forEach(filename => {
          if (filename.endsWith('.d.ts')) {
            delete bundle[filename];
          }
        });
      },
    },
  ],
};
