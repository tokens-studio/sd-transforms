import StyleDictionary, { Config } from 'style-dictionary';
import { registerTransforms } from '../../src/registerTransforms.js';

export function init(cfg: Config, transformOpts = {}) {
  registerTransforms(StyleDictionary, transformOpts);
  const dict = StyleDictionary.extend(cfg);
  dict.buildAllPlatforms();
  return dict;
}

export function cleanup(dict: StyleDictionary.Core) {
  if (dict) {
    dict.cleanAllPlatforms();
  }
  delete StyleDictionary.transformGroup['tokens-studio'];
  Object.keys(StyleDictionary.transform).forEach(transform => {
    if (transform.startsWith('ts/')) {
      delete StyleDictionary.transform[transform];
    }
  });
}
