import type { Config } from 'style-dictionary/types';
import StyleDictionary from 'style-dictionary';
import type { TransformOptions } from '../../src/TransformOptions.js';
import { register } from '../../src/register.js';

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

// Take an excerpt of a string and trim whitespace at the ends
// and remove indentations after newline -> before the `--` CSS prop starting characters
export function excerpt(content: string, options?: { start?: string; end?: string }) {
  const { start, end } = options ?? {};
  let trimmedContent = content;
  if (start) {
    trimmedContent = trimmedContent.split(start)[1];
  }
  if (end) {
    trimmedContent = trimmedContent.split(end)[0];
  }
  trimmedContent = trimmedContent.trim();

  const normalizeWhitespace = (str: string) => str.replace(/^\s+/gm, '');

  return normalizeWhitespace(trimmedContent);
}
