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
  const val = (token.$value ?? token.value) as
    | Record<string, number | string>
    | Record<string, number | string>[]
    | number
    | string;

  const type = token.$type ?? token.type;

  if (val === undefined) return undefined;

  const transformProp = (val: Record<string, number | string>, prop: string) => {
    if (val[prop] !== undefined) {
      val[prop] = _transformDimension(val[prop]);
    }
    return val;
  };

  let transformed = val;

  switch (type) {
    case 'typography': {
      transformed = transformed as Record<string, number | string>;
      transformed = transformProp(transformed, 'fontSize');
      break;
    }
    case 'shadow': {
      transformed = transformed as
        | Record<string, number | string>
        | Record<string, number | string>[];
      const transformShadow = (shadowVal: Record<string, number | string>) => {
        ['offsetX', 'offsetY', 'blur', 'spread'].forEach(prop => {
          shadowVal = transformProp(shadowVal, prop);
        });
        return shadowVal;
      };
      if (Array.isArray(transformed)) {
        transformed = transformed.map(transformShadow);
      } else {
        transformed = transformShadow(transformed);
      }
      break;
    }
    case 'border': {
      transformed = transformed as Record<string, number | string>;
      transformed = transformProp(transformed, 'width');
      break;
    }
    default:
      transformed = transformed as number | string;
      transformed = _transformDimension(transformed);
  }

  return transformed;
}
