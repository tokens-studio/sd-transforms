import { SingleBoxShadowToken } from '@tokens-studio/types';

export function transformShadow(value: SingleBoxShadowToken['value']) {
  const alignShadowType = val => {
    return val === 'innerShadow' || val === 'inset' ? 'inset' : undefined;
  };

  if (Array.isArray(value)) {
    return value.map(v => ({
      ...v,
      type: alignShadowType(v.type),
    }));
  }

  if (typeof value === 'object') {
    // @ts-expect-error we're converting to a value that isn't recognized by BoxShadowTypes enum, can't union enums either :(
    value.type = alignShadowType(value.type);
  }
  return value;
}
