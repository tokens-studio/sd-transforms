import { DesignToken } from 'style-dictionary/types';

function transformDimensionValue(value: string | number): string {
  return splitMultiValues(value).map(ensurePxSuffix).join(' ');
}

function ensurePxSuffix(dim: string | number): string {
  if (!isNaN(dim as number) && dim !== '' && parseFloat(dim as string) !== 0) {
    return `${dim}px`;
  }
  return `${dim}`;
}

function splitMultiValues(dim: string | number): string[] {
  if (typeof dim === 'string' && dim.includes(' ')) {
    return dim.split(' ');
  }
  return [`${dim}`];
}

function transformDimensionProp(
  val: Record<string, number | string>,
  prop: string,
): Record<string, number | string> {
  if (val[prop] !== undefined) {
    val[prop] = transformDimensionValue(val[prop]);
  }
  return val;
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

  let transformed = val;

  switch (type) {
    case 'typography': {
      transformed = transformDimensionProp(val as Record<string, number | string>, 'fontSize');
      break;
    }
    case 'shadow': {
      const transformShadow = (shadowVal: Record<string, number | string>) => {
        ['offsetX', 'offsetY', 'blur', 'spread'].forEach(prop =>
          transformDimensionProp(shadowVal, prop),
        );
        return shadowVal;
      };
      if (Array.isArray(transformed)) {
        transformed = transformed.map(transformShadow);
      } else {
        transformed = transformShadow(transformed as Record<string, number | string>);
      }
      break;
    }
    case 'border': {
      transformed = transformDimensionProp(val as Record<string, number | string>, 'width');
      break;
    }
    default: {
      transformed = transformDimensionValue(val as string | number);
    }
  }

  return transformed;
}
