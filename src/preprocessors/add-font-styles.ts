import {
  DeepKeyTokenMap,
  TokenTypographyValue,
  SingleToken,
  SingleFontWeightsToken,
} from '@tokens-studio/types';
import { usesReferences, resolveReferences } from 'style-dictionary/utils';
import { fontWeightReg, fontStyles } from '../transformFontWeight.js';
import { TransformOptions } from '../TransformOptions.js';

function resolveFontWeight(fontWeight: string, copy: DeepKeyTokenMap<false>, usesDtcg: boolean) {
  let resolved = fontWeight;
  if (usesReferences(fontWeight)) {
    try {
      resolved = `${resolveReferences(fontWeight, copy, { usesDtcg })}`;
    } catch (e) {
      // dont throw fatal, see: https://github.com/tokens-studio/sd-transforms/issues/217
      // we throw once we only support SD v4, for v3 we need to be more permissive
      console.error(e);
    }
  }
  return resolved;
}

function splitWeightStyle(fontWeight: string, alwaysAddFontStyle: boolean) {
  let weight = fontWeight;
  let style = alwaysAddFontStyle ? 'normal' : undefined;
  if (fontWeight) {
    const fontStyleMatch = fontWeight.match(fontWeightReg);
    if (fontStyleMatch?.groups?.weight && fontStyleMatch.groups.style) {
      style = fontStyleMatch.groups.style.toLowerCase();
      weight = fontStyleMatch?.groups?.weight;
    }

    // Roboto Regular Italic might have only: `fontWeight: 'Italic'`
    // which means that the weight is Regular and the style is Italic
    if (fontStyles.includes(fontWeight.toLowerCase())) {
      style = fontWeight.toLowerCase();
      weight = 'Regular';
    }
  }
  return { weight, style };
}

function recurse(
  slice: DeepKeyTokenMap<false> | SingleToken<false>,
  refCopy: DeepKeyTokenMap<false>,
  alwaysAddFontStyle = false,
) {
  (Object.keys(slice) as (keyof typeof slice)[]).forEach(key => {
    const potentiallyToken = slice[key];
    const isToken =
      typeof potentiallyToken === 'object' &&
      ((Object.hasOwn(potentiallyToken, '$type') && Object.hasOwn(potentiallyToken, '$value')) ||
        (Object.hasOwn(potentiallyToken, 'type') && Object.hasOwn(potentiallyToken, 'value')));

    if (isToken) {
      const token = potentiallyToken as SingleToken<false>;
      const usesDtcg = Object.hasOwn(token, '$value');
      const { value, $value, type, $type } = token;
      const tokenType = (usesDtcg ? $type : type) as string;
      const tokenValue = (usesDtcg ? $value : value) as
        | (TokenTypographyValue & { fontStyle: string })
        | SingleFontWeightsToken['value'];

      if (tokenType === 'typography') {
        const tokenTypographyValue = tokenValue as TokenTypographyValue & { fontStyle: string };
        if (tokenTypographyValue.fontWeight === undefined) return;

        const fontWeight = resolveFontWeight(
          `${tokenTypographyValue.fontWeight}`,
          refCopy,
          usesDtcg,
        );
        const { weight, style } = splitWeightStyle(fontWeight, alwaysAddFontStyle);
        if (style) {
          tokenTypographyValue.fontWeight = weight;
          tokenTypographyValue.fontStyle = style;
        }
      } else if (tokenType === 'fontWeight') {
        const tokenFontWeightsValue = tokenValue as SingleFontWeightsToken['value'];
        const fontWeight = resolveFontWeight(`${tokenFontWeightsValue}`, refCopy, usesDtcg);
        const { weight, style } = splitWeightStyle(fontWeight, alwaysAddFontStyle);

        if (style) {
          // since tokenFontWeightsValue is a primitive (string), we have to permutate the change directly
          (slice[key] as DeepKeyTokenMap<false>) = {
            weight: {
              ...token,
              [`${usesDtcg ? '$' : ''}type`]: 'fontWeight',
              [`${usesDtcg ? '$' : ''}value`]: weight,
            },
            style: {
              ...token,
              [`${usesDtcg ? '$' : ''}type`]: 'fontStyle',
              [`${usesDtcg ? '$' : ''}value`]: style,
            },
          };
        }
      }
    } else if (typeof potentiallyToken === 'object') {
      recurse(
        potentiallyToken as DeepKeyTokenMap<false> | SingleToken<false>,
        refCopy,
        alwaysAddFontStyle,
      );
    }
  });
}

export function addFontStyles(
  dictionary: DeepKeyTokenMap<false>,
  transformOpts?: TransformOptions,
): DeepKeyTokenMap<false> {
  const refCopy = structuredClone(dictionary);
  const newCopy = structuredClone(dictionary);
  recurse(newCopy, refCopy, transformOpts?.alwaysAddFontStyle);
  return newCopy;
}
