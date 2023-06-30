import { DeepKeyTokenMap, SingleToken, TokenTypographyValue } from '@tokens-studio/types';
// @ts-expect-error no type exported for this function
import getReferences from 'style-dictionary/lib/utils/references/getReferences.js';
// @ts-expect-error no type exported for this function
import usesReference from 'style-dictionary/lib/utils/references/usesReference.js';

function recurse(
  slice: DeepKeyTokenMap<false>,
  boundGetRef: (ref: string) => Array<SingleToken<false>>,
) {
  for (const key in slice) {
    const token = slice[key];
    const { type, value } = token;
    if (type === 'typography') {
      let fontWeight;

      if (usesReference(value)) {
        let ref = { value: value } as SingleToken<false>;
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
        fontWeight = (ref.value as TokenTypographyValue).fontWeight;
        (token as SingleToken<false>).value = ref.value;
      } else if (typeof value === 'object') {
        fontWeight = value.fontWeight;
      }

      // cast it to TokenTypographyValue now that we've resolved references all the way, we know it cannot be a string anymore.
      const tokenValue = value as TokenTypographyValue;

      if (fontWeight) {
        const fontStyleReg = /(italic|oblique|normal)$/gi;
        const fontStyleMatch = fontWeight.match(fontStyleReg);
        if (fontStyleMatch) {
          // @ts-expect-error fontStyle is not a property that exists on Typography Tokens, we just add it ourselves
          tokenValue.fontStyle = fontStyleMatch[0].toLowerCase();
          tokenValue.fontWeight = tokenValue.fontWeight?.replace(fontStyleReg, '').trim();
        }
      }
    } else if (typeof token === 'object') {
      recurse(token as unknown as DeepKeyTokenMap<false>, boundGetRef);
    }
  }
}

export function addFontStyles(dictionary: DeepKeyTokenMap<false>): DeepKeyTokenMap<false> {
  const copy = { ...dictionary };
  const boundGetRef = getReferences.bind({ properties: copy });
  recurse(copy, boundGetRef);
  return copy;
}
