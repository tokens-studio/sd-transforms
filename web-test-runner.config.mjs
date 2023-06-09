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
  },
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [
    commonjs({ requireReturnsDefault: 'preferred' }),
    esbuildPlugin({ ts: true, target: 'auto' }),
  ],
};
