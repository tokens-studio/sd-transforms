import type { Config } from 'style-dictionary/types';
import StyleDictionary from 'style-dictionary';
import { register } from '../../src/register.js';
import { TransformOptions } from '../../src/TransformOptions.js';

export async function init(cfg: Config, transformOpts: TransformOptions = {}) {
  register(StyleDictionary, transformOpts);
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
