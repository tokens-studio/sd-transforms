import { transformDimension } from '../transformDimension.js';
import { transformFontWeights } from '../transformFontWeights.js';
import { checkAndEvaluateMath } from '../checkAndEvaluateMath.js';
import { isNothing } from '../utils/is-nothing.js';
import { hasWhiteSpace } from '../utils/has-whitespace.js';
import { isCommaSeperated } from '../utils/is-comma-seperated.js';

/**
 * Helper: Transforms typography object to typography shorthand for CSS
 * This currently works fine if every value uses an alias, but if any one of these use a raw value, it will not be transformed.
 * If you'd like to output all typography values, you'd rather need to return the typography properties itself
 */

export function transformTypographyForCSS(
  value: Record<string, string | undefined | number> | undefined | string,
): string | undefined {
  if (typeof value !== 'object') {
    return value;
  }

  let { fontWeight, fontSize, lineHeight } = value;
  const { fontFamily } = value;
  fontWeight = transformFontWeights(fontWeight);

  let fontFamilySet;

  if (fontFamily !== undefined && !isCommaSeperated(fontFamily)) {
    fontFamilySet = hasWhiteSpace(fontFamily) ? `'${fontFamily}'` : fontFamily;
  }

  if (fontFamily !== undefined && typeof fontFamily !== 'number' && isCommaSeperated(fontFamily)) {
    let fontFamilyArray = [];
    fontFamilyArray = fontFamily.split(', ');
    fontFamilySet = fontFamilyArray
      .map((e: string) => {
        return hasWhiteSpace(e as string | undefined) ? `'${e}'` : e;
      })
      .join(', ');
  }

  fontSize = transformDimension(checkAndEvaluateMath(fontSize));
  lineHeight = checkAndEvaluateMath(lineHeight);

  return `${isNothing(fontWeight) ? 400 : fontWeight} ${isNothing(fontSize) ? '16px' : fontSize}/${
    isNothing(lineHeight) ? 1 : lineHeight
  } ${isNothing(fontFamily) ? 'sans-serif' : fontFamilySet}`;
}
