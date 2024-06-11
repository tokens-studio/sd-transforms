import { DesignToken } from 'style-dictionary/types';
import { percentageToDecimal } from '../utils/percentageToDecimal.js';

/**
 * Helper: Transforms letter spacing % to em
 */
export function transformLetterSpacingForCSS(token: DesignToken): DesignToken['value'] {
  const val = token.$value ?? token.value;
  const type = token.$type ?? token.type;
  if (val === undefined) return undefined;

  const transformLetterSpacing = (letterspacing: string | number) => {
    const decimal = percentageToDecimal(letterspacing);
    return typeof decimal === 'string' || isNaN(decimal) ? `${letterspacing}` : `${decimal}em`;
  };

  if (type === 'typography') {
    if (val.letterSpacing !== undefined) {
      return {
        ...val,
        letterSpacing: transformLetterSpacing(val.letterSpacing),
      };
    }
    return val;
  }
  return transformLetterSpacing(val);
}
