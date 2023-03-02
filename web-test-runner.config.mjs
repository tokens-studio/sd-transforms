import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import cjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

const cjsPlugin = fromRollup(cjs);
const nodeResolvePlugin = fromRollup(nodeResolve);

export default {
  nodeResolve: true,
  files: ['test/**/*.test.ts'],
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
    exclude: ['src/postcss-calc-ast-parser.js', 'node_modules/**'],
  },
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [esbuildPlugin({ ts: true, target: 'auto' }), cjsPlugin()],
};
