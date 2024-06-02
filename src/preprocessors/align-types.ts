import { DeepKeyTokenMap, SingleToken } from '@tokens-studio/types';

export const typesMap = {
  fontFamilies: 'fontFamily',
  fontWeights: 'fontWeight',
  fontSizes: 'fontSize',
  lineHeights: 'lineHeight',
  boxShadow: 'shadow',
  spacing: 'dimension',
  sizing: 'dimension',
  borderRadius: 'dimension',
  text: 'content',
};

const propsMap = {
  shadow: {
    x: 'offsetX',
    y: 'offsetY',
  },
};

function recurse(slice: DeepKeyTokenMap<false> | SingleToken<false>) {
  const isToken =
    (Object.hasOwn(slice, '$type') && Object.hasOwn(slice, '$value')) ||
    (Object.hasOwn(slice, 'type') && Object.hasOwn(slice, 'value'));
  if (isToken) {
    const { $value, value, type, $type } = slice;
    const usesDTCG = Object.hasOwn(slice, '$value');
    const t = (usesDTCG ? $type : type) as string;
    const v = usesDTCG ? $value : value;
    const newT = typesMap[t] ?? t;
    slice[`${usesDTCG ? '$' : ''}type`] = newT;

    // now also check propsMap if we need to map some props
    if (typeof v === 'object') {
      const pMap = propsMap[newT as keyof typeof propsMap];
      if (pMap) {
        const convertProps = obj => {
          Object.entries(pMap).forEach(([key, propValue]) => {
            if (obj[key] !== undefined) {
              obj[propValue] = obj[key];
              delete obj[key];
            }
          });
        };

        const newV = v;
        if (Array.isArray(newV)) {
          newV.forEach(convertProps);
        } else {
          convertProps(newV);
        }
        slice[`${usesDTCG ? '$' : ''}value`] = newV;
      }
    }
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
