import { DeepKeyTokenMap, SingleToken } from '@tokens-studio/types';

const typesMap = {
  boxShadow: 'shadow',
  fontFamilies: 'fontFamily',
  fontWeights: 'fontWeight',
  fontSizes: 'fontSize',
  lineHeights: 'lineHeight',
  spacing: 'dimension',
  sizing: 'dimension',
  borderRadius: 'dimension',
  text: 'content',
};

function recurse(slice: DeepKeyTokenMap<false> | SingleToken<false>) {
  const { value, type, $type } = slice;
  if ($type || (value && type)) {
    const usesDTCG = !!$type;
    const t = (usesDTCG ? $type : type) as string;
    slice[`${usesDTCG ? '$' : ''}type`] = typesMap[t] ?? t;
  } else {
    Object.values(slice).forEach(val => {
      if (typeof val === 'object') {
        recurse(val);
      }
    });
  }
}

export function alignTypes(dictionary: DeepKeyTokenMap<false>): DeepKeyTokenMap<false> {
  const copy = structuredClone(dictionary);
  recurse(copy);
  return copy;
}
