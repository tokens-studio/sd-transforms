import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import { CJSOnlyDeps } from './rollup.config.mjs';

// Because we bundle our CJS deps and we preserveModules, normally it would create
// a dist/node_modules folder for the deps. This is an issue because then the consumer's NodeJS
// resolution algorithm will pull bare import specifiers from this folder rather than their own root
// node_modules folder, even for CJS usage :(
// Therefore, we temporarily move the CJS deps to a different folder, include that
// in the nodeResolve moduleDirectories and move things back after we're done.
async function run() {
  renameSync(path.resolve('dist/node_modules'), path.resolve('dist/bundled_CJS_deps'));
  const files = await globSync('dist/**/*.js', { nodir: true });

  files.forEach(file => {
    CJSOnlyDeps.forEach(dep => {
      const reg = new RegExp(`node_modules/${dep}`, 'g');
      const filePath = path.resolve(file);
      const currentFileContents = readFileSync(filePath, 'utf-8');
      const newFileContents = currentFileContents.replace(reg, `bundled_CJS_deps/${dep}`);
      writeFileSync(filePath, newFileContents, 'utf-8');
    });
  });
}
run();
