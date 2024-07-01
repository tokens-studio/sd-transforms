import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

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
    exclude: ['test/**/*', 'node_modules/**/*'],
  },
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
};
