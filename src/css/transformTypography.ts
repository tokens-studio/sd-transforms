import { transformDimension } from '../transformDimension.js';
import { transformFontWeights } from '../transformFontWeights.js';
import { checkAndEvaluateMath } from '../checkAndEvaluateMath.js';

/**
 * Helper: Transforms typography object to typography shorthand for CSS
 * This currently works fine if every value uses an alias, but if any one of these use a raw value, it will not be transformed.
 * If you'd like to output all typography values, you'd rather need to return the typography properties itself
 */
export function transformTypographyForCSS(
  value: Record<string, string> | undefined | string,
): string | undefined {
  if (typeof value !== 'object') {
    return value;
  }
  const { fontFamily } = value;
  let { fontWeight, fontSize, lineHeight } = value;
  fontWeight = transformFontWeights(fontWeight) as string;
  fontSize = transformDimension(checkAndEvaluateMath(fontSize)) as string;
  lineHeight = checkAndEvaluateMath(lineHeight) as string;

  return `${fontWeight ?? 400} ${fontSize ?? '16px'}/${lineHeight ?? 1} ${
    fontFamily ?? 'sans-serif'
  }`;
}
