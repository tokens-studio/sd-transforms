import { SingleBoxShadowToken } from '@tokens-studio/types';

export function transformShadow(value: SingleBoxShadowToken['value']) {
  if (Array.isArray(value)) {
    return value.map(v => ({
      ...v,
      type: v.type === 'innerShadow' ? 'inset' : v.type,
    }));
  }

  if (typeof value === 'object' && value.type === 'innerShadow') {
    // @ts-expect-error we're converting to a value that isn't recognized by BoxShadowTypes enum, can't union enums either :(
    val.type = 'inset';
  }
  return value;
}
