import { BoxShadowTypes, SingleBoxShadowToken, TokenBoxshadowValue } from '@tokens-studio/types';

export function transformShadow(value: SingleBoxShadowToken['value']) {
  /**
   * @param {string} val
   * @returns {BoxShadowTypes}
   */
  const alignShadowType = (val: TokenBoxshadowValue & { inset?: boolean }) => {
    if ([BoxShadowTypes.INNER_SHADOW, 'inset'].includes(val.type)) {
      val.inset = true;
      // TODO: delete lines below in next major change, only have to set inset=true, nothing else
      val.type = 'inset' as BoxShadowTypes;
    } else if (val.type) {
      val.type = undefined as BoxShadowTypes & undefined;
    }

    // TODO: enable line below in next major change
    // delete (val as Partial<TokenBoxshadowValue>).type;
    return val;
  };

  if (Array.isArray(value)) {
    return value.map(alignShadowType);
  }

  if (typeof value === 'object') {
    return alignShadowType(value);
  }
  return value;
}
