import { DeepKeyTokenMap, SingleToken, TokenTypographyValue } from '@tokens-studio/types';
// @ts-expect-error no type exported for this function
import getReferences from 'style-dictionary/lib/utils/references/getReferences.js';
// @ts-expect-error no type exported for this function
import usesReference from 'style-dictionary/lib/utils/references/usesReference.js';
import { fontWeightReg } from '../transformFontWeights.js';
import { TransformOptions } from '../TransformOptions.js';

function recurse(
  slice: DeepKeyTokenMap<false>,
  boundGetRef: (ref: string) => Array<SingleToken<false>>,
  alwaysAddFontStyle = false,
) {
  for (const key in slice) {
    const token = slice[key];
    const { type, value } = token;
    if (type === 'typography') {
      if (typeof value !== 'object') {
        continue;
      }
      let fontWeight = value.fontWeight;

      if (usesReference(fontWeight)) {
        let ref = { value: fontWeight } as SingleToken<false>;
        while (ref && ref.value && typeof ref.value === 'string' && usesReference(ref.value)) {
          try {
            ref = Object.fromEntries(
              Object.entries(boundGetRef(ref.value)[0]).map(([k, v]) => [k, v]),
            ) as SingleToken<false>;
          } catch (e) {
            console.warn(`Warning: could not resolve reference ${ref.value}`);
            return;
          }
        }
        fontWeight = ref.value as string;
      }

      // cast it to TokenTypographyValue now that we've resolved references all the way, we know it cannot be a string anymore.
      // fontStyle is a prop we add ourselves
      const tokenValue = value as TokenTypographyValue & { fontStyle: string };

      if (fontWeight) {
        const fontStyleMatch = fontWeight.match(fontWeightReg);
        if (fontStyleMatch?.groups?.weight && fontStyleMatch.groups.style) {
          tokenValue.fontStyle = fontStyleMatch.groups.style.toLowerCase();
          tokenValue.fontWeight = fontStyleMatch?.groups?.weight;
        }
      }

      if (!tokenValue.fontStyle && alwaysAddFontStyle) {
        tokenValue.fontStyle = 'normal';
      }
    } else if (typeof token === 'object') {
      recurse(token as unknown as DeepKeyTokenMap<false>, boundGetRef);
    }
  }
}

export function addFontStyles(
  dictionary: DeepKeyTokenMap<false>,
  transformOpts?: TransformOptions,
): DeepKeyTokenMap<false> {
  const copy = { ...dictionary };
  const boundGetRef = getReferences.bind({ properties: copy });
  recurse(copy, boundGetRef, transformOpts?.alwaysAddFontStyle);
  return copy;
}
