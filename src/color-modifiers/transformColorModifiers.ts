import { DesignToken } from 'style-dictionary';
import { modifyColor } from './modifyColor';
/**
 * Helper: Transforms color tokens with tokens studio color modifiers
 */
export function transformColorModifiers(token: DesignToken): string {
  /** @type {ColorModifier} */
  const modifier = token.$extensions['studio.tokens']?.modify;
  return modifyColor(token.value, modifier);
}
