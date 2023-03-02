module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['test/**/*', 'web-test-runner.config.mjs', 'rollup/**/*'],
      },
    ],
  },
};
