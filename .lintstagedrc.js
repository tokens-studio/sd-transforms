export default {
  '*.ts': ['eslint --fix', 'prettier --write'],
  '*.md': ['prettier --write'],
  'package.json': ['npx prettier-package-json --write package.json'],
};
