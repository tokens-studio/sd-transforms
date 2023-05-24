import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import commonjsRollup from '@rollup/plugin-commonjs';

const commonjs = fromRollup(commonjsRollup);

export default {
  nodeResolve: true,
  files: ['test/**/*.spec.ts'],
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
    exclude: ['src/postcss-calc-ast-parser.ts', 'node_modules/**'],
  },
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [commonjs({ requireReturnsDefault: true }), esbuildPlugin({ ts: true, target: 'auto' })],
};
