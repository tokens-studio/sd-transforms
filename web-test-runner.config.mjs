import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  nodeResolve: true,
  files: ['test/**/*.test.js'],
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
};
