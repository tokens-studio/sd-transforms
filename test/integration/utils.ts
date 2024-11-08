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
export function excerpt(content: string, options?: { before?: string; after?: string }) {
  const { before, after } = options ?? {};
  let trimmedContent = content;
  if (before) {
    trimmedContent = trimmedContent.split(before)[1];
  }
  if (after) {
    trimmedContent = trimmedContent.split(after)[0];
  }
  trimmedContent = trimmedContent.trim();

  const indentMatches = trimmedContent.matchAll(RegExp('(?<indents>( [\\t])+)--', 'g'));

  for (const match of indentMatches) {
    if (match.groups?.indents) {
      const { indents } = match.groups;
      trimmedContent = trimmedContent.replace(indents, '');
    }
  }
  return trimmedContent;
}
