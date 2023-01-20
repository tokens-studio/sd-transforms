export default {
  '*.js': ['eslint --fix', 'prettier --write'],
  '*.md': ['prettier --write'],
  'package.json': ['node ./scripts/sort-package-json.js'],
};
