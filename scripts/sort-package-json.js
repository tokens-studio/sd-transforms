import { exec } from 'child_process';
import mod from 'module';

const require = mod.createRequire(import.meta.url);
const defaults = require('prettier-package-json/build/defaultOptions');

const currOrder = /** @type {[]} */ (defaults.defaultOptions.keyOrder);

// move version from position 11 to position 3
currOrder.splice(3, 0, currOrder.splice(11, 1)[0]);

exec(`npx prettier-package-json --key-order ${currOrder.join(',')} --write ../package.json`);
