module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'mocha'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'mocha/no-skipped-tests': 'warn',
    'mocha/no-exclusive-tests': 'error',
  },
};
