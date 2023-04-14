import { DesignToken } from 'style-dictionary';
import { modifyColor } from './modifyColor.js';
import { ColorModifier } from '@tokens-studio/types';
/**
 * Helper: Transforms color tokens with tokens studio color modifiers
 */
export function transformColorModifiers(token: DesignToken): string | undefined {
  const modifier = token.$extensions['studio.tokens']?.modify as ColorModifier;
  return modifyColor(token.value, modifier);
}
