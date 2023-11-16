import { DeepKeyTokenMap } from '@tokens-studio/types';
import { TransformOptions } from '../TransformOptions.js';
import { excludeParentKeys } from './exclude-parent-keys.js';
import { addFontStyles } from './add-font-styles.js';
import { expandComposites } from './expand-composites.js';

export function parseTokens(
  tokens: DeepKeyTokenMap<false>,
  transformOpts?: TransformOptions,
  filePath?: string,
) {
  const excluded = excludeParentKeys(tokens, transformOpts);
  const withFontStyles = addFontStyles(excluded, transformOpts);
  const expanded = expandComposites(withFontStyles, transformOpts, filePath);
  return expanded;
}
