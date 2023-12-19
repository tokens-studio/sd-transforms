import type { Config } from 'style-dictionary/types';
import StyleDictionary from 'style-dictionary';
import { registerTransforms } from '../../src/registerTransforms.js';

export async function init(cfg: Config, transformOpts = {}) {
  registerTransforms(StyleDictionary, transformOpts);
  const dict = new StyleDictionary(cfg);
  await dict.buildAllPlatforms();
  return dict;
}

export async function cleanup(dict?: StyleDictionary) {
  // @ts-expect-error polluting dictionary it on purpose
  if (dict && !dict.cleaned) {
    await dict.cleanAllPlatforms();
    // @ts-expect-error polluting dictionary it on purpose
    dict.cleaned = true;
  }
  StyleDictionary.parsers = [];
  delete StyleDictionary.transformGroup['tokens-studio'];
  Object.keys(StyleDictionary.transform).forEach(transform => {
    if (transform.startsWith('ts/')) {
      delete StyleDictionary.transform[transform];
    }
  });
}
