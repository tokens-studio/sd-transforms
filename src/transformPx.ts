import { DesignToken } from 'style-dictionary/types';

function _transformPx(dim: string | number): string {
  // Check if the value is numeric with isNaN, this supports string values as well
  // Check if value is not empty string, since this is also not considered "NaN"
  // Check if the value, when parsed (since it can also be number), does not equal 0
  if (!isNaN(dim as number) && dim !== '' && parseFloat(dim as string) !== 0) {
    return `${dim}px`;
  }
  return `${dim}`;
}

/**
 * Helper: Transforms dimensions to px
 */
export function transformPx(token: DesignToken): DesignToken['value'] {
  const val = token.$value ?? token.value;
  const type = token.$type ?? token.type;

  if (val === undefined) return undefined;

  const transformProp = (val, prop) => {
    if (val[prop] !== undefined) {
      val[prop] = _transformPx(val[prop]);
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
      transformed = _transformPx(val);
  }

  return transformed;
}
