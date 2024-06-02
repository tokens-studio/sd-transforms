import { DesignToken } from 'style-dictionary/types';

function _transformDimension(dim: string | number): string {
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
export function transformDimension(token: DesignToken): DesignToken['value'] {
  const val = token.$value ?? token.value;
  const type = token.$type ?? token.type;

  if (val === undefined) return undefined;

  const transformProp = (val, prop) => {
    if (val[prop] !== undefined) {
      val[prop] = _transformDimension(val[prop]);
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
      ['offsetX', 'offsetY', 'blur', 'spread'].forEach(prop => {
        transformed = transformProp(transformed, prop);
      });
      break;
    }
    case 'border': {
      transformed = transformProp(transformed, 'width');
      break;
    }
    default:
      transformed = _transformDimension(val);
  }

  return transformed;
}
