import { DesignToken } from 'style-dictionary/types';

function _transformRem(dim: string | number, baseFontSize = 16): string {
  if (!isNaN(dim as number) && dim !== '' && parseFloat(dim as string) !== 0) {
    const parsedValue = parseFloat(`${dim}`);
    return `${parsedValue / baseFontSize}rem`;
  }

  return `${dim}`;
}

/**
 * Helper: Transforms dimensions to px
 */
export function transformRem(token: DesignToken, baseFontSize?: number): DesignToken['value'] {
  const val = token.$value ?? token.value;
  const type = token.$type ?? token.type;

  if (val === undefined) return undefined;

  const transformProp = (val, prop) => {
    if (val[prop] !== undefined) {
      val[prop] = _transformRem(val[prop], baseFontSize);
    }
    return val;
  };

  let transformed = val;
  switch (type) {
    case 'typography': {
      transformed = transformProp(transformed, 'fontSize');
      break;
    }
    case 'shadow': {
      const transformShadow = shadowVal => {
        ['offsetX', 'offsetY', 'blur', 'spread'].forEach(prop => {
          shadowVal = transformProp(shadowVal, prop);
        });
        return shadowVal;
      };
      if (Array.isArray(transformed)) {
        transformed = transformed.map(transformShadow);
      }
      transformed = transformShadow(transformed);
      break;
    }
    case 'border': {
      transformed = transformProp(transformed, 'width');
      break;
    }
    default:
      transformed = _transformRem(val, baseFontSize);
  }

  return transformed;
}
