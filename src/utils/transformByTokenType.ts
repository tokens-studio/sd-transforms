import type { DesignToken } from 'style-dictionary/types';

export function transformByTokenType(
  expr: DesignToken['value'],
  type: string | undefined,
  resolveMath: (expr: number | string) => number | string,
): DesignToken['value'] {
  const transformProp = (val: Record<string, number | string>, prop: string) => {
    if (typeof val === 'object' && val[prop] !== undefined) {
      val[prop] = resolveMath(val[prop]);
    }
    return val;
  };

  let transformed = expr;
  switch (type) {
    case 'typography':
    case 'border': {
      transformed = transformed as Record<string, number | string>;
      // double check that expr is still an object and not already shorthand transformed to a string
      if (typeof expr === 'object') {
        Object.keys(transformed).forEach(prop => {
          transformed = transformProp(transformed, prop);
        });
      }
      break;
    }
    case 'shadow': {
      transformed = transformed as
        | Record<string, number | string>
        | Record<string, number | string>[];
      const transformShadow = (shadowVal: Record<string, number | string>) => {
        // double check that expr is still an object and not already shorthand transformed to a string
        if (typeof expr === 'object') {
          Object.keys(shadowVal).forEach(prop => {
            shadowVal = transformProp(shadowVal, prop);
          });
        }
        return shadowVal;
      };
      if (Array.isArray(transformed)) {
        transformed = transformed.map(transformShadow);
      }
      transformed = transformShadow(transformed);
      break;
    }
    default:
      transformed = resolveMath(transformed);
  }
  return transformed;
}
