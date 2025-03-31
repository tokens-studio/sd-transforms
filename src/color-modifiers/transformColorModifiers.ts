import type { DesignToken } from 'style-dictionary/types';
import { usesReferences } from 'style-dictionary/utils';
import { modifyColor } from './modifyColor.js';
import { ColorModifier } from '@tokens-studio/types';
import { ColorModifierOptions } from '../TransformOptions.js';
import { defaultFractionDigits } from '../register.js';

// 3 for backwards compatibility, but should better be 5, referring to the default precision (5) of the colorJS.io library
// see: https://colorjs.io/docs/output.html#getting-a-string-representation-of-a-color
export const defaultColorPrecision = 3;

/**
 * Helper: Transforms color tokens with tokens studio color modifiers
 */
export function transformColorModifiers(
  token: DesignToken,
  options?: ColorModifierOptions,
): string | undefined {
  const modifier = token.$extensions['studio.tokens']?.modify as ColorModifier;

  // If some of the modifier props contain references or the modifier itself is a reference
  // we should return undefined to manually defer this transformation until the references are resolved
  // see: https://github.com/amzn/style-dictionary/blob/v4/docs/transforms.md#defer-transitive-transformation-manually
  if (usesReferences(modifier) || Object.values(modifier).some(prop => usesReferences(prop))) {
    return undefined;
  }

  if (options?.format) {
    modifier.format = options.format;
  }
  if (!modifier.mathFractionDigits) {
    modifier.mathFractionDigits = options?.mathFractionDigits ?? defaultFractionDigits;
  }
  if (!modifier.precision) {
    modifier.precision = options?.precision ?? defaultColorPrecision;
  }
  return modifyColor(token.$value ?? token.value, modifier);
}
