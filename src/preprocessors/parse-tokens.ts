import { DeepKeyTokenMap } from '@tokens-studio/types';
import { TransformOptions } from '../TransformOptions.js';
import { excludeParentKeys } from './exclude-parent-keys.js';
import { addFontStyles } from './add-font-styles.js';
import { alignTypes } from './align-types.js';

export function parseTokens(tokens: DeepKeyTokenMap<false>, transformOpts?: TransformOptions) {
  const excluded = excludeParentKeys(tokens, transformOpts);
  const alignedTypes = alignTypes(excluded);
  const withFontStyles = addFontStyles(alignedTypes, transformOpts);
  return withFontStyles;
}
