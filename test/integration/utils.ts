import type { Config } from 'style-dictionary/types';
import StyleDictionary from 'style-dictionary';
import { registerTransforms } from '../../src/registerTransforms.js';

export async function init(cfg: Config, transformOpts = {}) {
  registerTransforms(StyleDictionary, transformOpts);
  const dict = new StyleDictionary({
    ...cfg,
    preprocessors: ['tokens-studio', ...(cfg.preprocessors ?? [])],
  });
  await dict.buildAllPlatforms();
  return dict;
}

export async function cleanup(dict?: StyleDictionary & { cleaned?: boolean }) {
  if (dict && !dict.cleaned) {
    await dict.cleanAllPlatforms();
    dict.cleaned = true;
  }
  StyleDictionary.hooks.preprocessors = {};
  delete StyleDictionary.hooks.transformGroups['tokens-studio'];
  Object.keys(StyleDictionary.hooks.transforms).forEach(transform => {
    if (transform.startsWith('ts/')) {
      delete StyleDictionary.hooks.transforms[transform];
    }
  });
}
