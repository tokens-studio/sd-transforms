import { SingleBoxShadowToken, BoxShadowTypes } from '@tokens-studio/types';

export function transformShadow(value: SingleBoxShadowToken['value']) {
  const alignShadowType = (val: string) => {
    return val === 'innerShadow' || val === 'inset' ? 'inset' : undefined;
  };

  if (Array.isArray(value)) {
    return value.map(v => ({
      ...v,
      type: alignShadowType(v.type),
    }));
  }

  if (typeof value === 'object') {
    value.type = alignShadowType(value.type) as BoxShadowTypes;
  }
  return value;
}
