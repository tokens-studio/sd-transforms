module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'test/**/*',
          'scripts/**/*',
          'web-test-runner.config.mjs',
          'rollup-postcss-calc.config.mjs',
        ],
      },
    ],
  },
};
