import type { DesignToken } from 'style-dictionary/types';
import { modifyColor } from './modifyColor.js';
import { ColorModifier } from '@tokens-studio/types';
import { ColorModifierOptions } from '../TransformOptions.js';
/**
 * Helper: Transforms color tokens with tokens studio color modifiers
 */
export function transformColorModifiers(
  token: DesignToken,
  options?: ColorModifierOptions,
): string | undefined {
  const modifier = token.$extensions['studio.tokens']?.modify as ColorModifier;
  if (options?.format) {
    modifier.format = options.format;
  }
  return modifyColor(token.value, modifier);
}
