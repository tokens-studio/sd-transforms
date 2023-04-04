/**
 * Helper: Transforms dimensions to px
 */

type TransformPxOptions = {
  basePxFontSize: number; 
}

function getBasePxFontSize(options?: TransformPxOptions) {
  return options?.basePxFontSize || 16;
}

export function transformRem(tokenValue: string | undefined | number, options?: TransformPxOptions): string | undefined {
  if (tokenValue === undefined) {
    return tokenValue;
  }

  if (`${tokenValue}`.endsWith('rem')) {
    return `${tokenValue}`;
  }

  const value = parseFloat(`${tokenValue}`);
  
  if (value === 0) {
    return '0';
  }

  const baseFont = getBasePxFontSize(options);

  return `${value / baseFont}rem`;
}
