import { modifyColor } from './modifyColor.js';

/**
 * @typedef {import('./types/Modifier').ColorModifier} ColorModifier
 * @typedef {import('style-dictionary/types/DesignToken').DesignToken} DesignToken
 */

/**
 * Helper: Transforms color tokens with tokens studio color modifiers
 *
 * @param {DesignToken} token
 * @returns {string}
 */
export function transformColorModifiers(token) {
  /** @type {ColorModifier} */
  const modifier = token.$extensions['studio.tokens']?.modify;
  return modifyColor(token.value, modifier);
}
