import { DeepKeyTokenMap, TokenTypographyValue } from '@tokens-studio/types';
import { usesReferences, resolveReferences } from 'style-dictionary/utils';
import { fontWeightReg, fontStyles } from '../transformFontWeights.js';
import { TransformOptions } from '../TransformOptions.js';

function recurse(
  slice: DeepKeyTokenMap<false>,
  copy: DeepKeyTokenMap<false>,
  alwaysAddFontStyle = false,
) {
  for (const key in slice) {
    const token = slice[key];
    if (typeof token !== 'object' || token === null) {
      continue;
    }
    const { value, type, $type } = token;
    if ($type === 'typography' || type === 'typography') {
      if (typeof value !== 'object' || value.fontWeight === undefined) {
        continue;
      }
      let fontWeight = value.fontWeight;
      let resolved;
      if (usesReferences(fontWeight)) {
        try {
          resolved = resolveReferences(fontWeight, copy);
        } catch (e) {
          // dont throw fatal, see: https://github.com/tokens-studio/sd-transforms/issues/217
          // we throw once we only support SD v4, for v3 we need to be more permissive
          console.error(e);
        }

        if (resolved) {
          fontWeight = `${resolved}`;
        }
      }
      // cast because fontStyle is a prop we will add ourselves
      const tokenValue = value as TokenTypographyValue & { fontStyle: string };

      if (fontWeight) {
        const fontStyleMatch = fontWeight.match(fontWeightReg);
        if (fontStyleMatch?.groups?.weight && fontStyleMatch.groups.style) {
          tokenValue.fontStyle = fontStyleMatch.groups.style.toLowerCase();
          tokenValue.fontWeight = fontStyleMatch?.groups?.weight;
        }

        // Roboto Regular Italic might have only: `fontWeight: 'Italic'`
        // which means that the weight is Regular and the style is Italic
        if (fontStyles.includes(fontWeight.toLowerCase())) {
          tokenValue.fontStyle = fontWeight.toLowerCase();
          tokenValue.fontWeight = 'Regular';
        }
      }

      if (!tokenValue.fontStyle && alwaysAddFontStyle) {
        tokenValue.fontStyle = 'normal';
      }
    } else if (typeof token === 'object') {
      recurse(token as unknown as DeepKeyTokenMap<false>, copy, alwaysAddFontStyle);
    }
  }
}

export function addFontStyles(
  dictionary: DeepKeyTokenMap<false>,
  transformOpts?: TransformOptions,
): DeepKeyTokenMap<false> {
  const copy = structuredClone(dictionary);
  recurse(copy, copy, transformOpts?.alwaysAddFontStyle);
  return copy;
}
