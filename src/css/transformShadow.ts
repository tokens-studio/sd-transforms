import { SingleBoxShadowToken, TokenBoxshadowValue } from '@tokens-studio/types';

export function transformShadow(value: SingleBoxShadowToken['value']) {
  if (Array.isArray(value)) {
    return value.map(v => ({
      ...v,
      type: v.type === 'innerShadow' ? 'inset' : v.type,
      offsetX: v.x,
      offsetY: v.y,
    }));
  }

  if (typeof value === 'object' && value.type === 'innerShadow') {
    const val = value as TokenBoxshadowValue & {
      offsetY?: string | number;
      offsetX?: string | number;
    };
    // @ts-expect-error we're converting to a value that isn't recognized by BoxShadowTypes enum, can't union enums either :(
    val.type = 'inset';
    val.offsetX = val.x;
    val.offsetY = val.y;
  }
  return value;
}
