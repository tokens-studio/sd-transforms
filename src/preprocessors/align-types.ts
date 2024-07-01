import { DeepKeyTokenMap, SingleToken, TokenTypes } from '@tokens-studio/types';

// TODO: composition tokens props also need the same types alignments..
// nested composition tokens are out of scope.

type valueOfTokenTypes = (typeof TokenTypes)[keyof typeof TokenTypes];

const typesMap = {
  fontFamilies: 'fontFamily',
  fontWeights: 'fontWeight',
  fontSizes: 'fontSize',
  lineHeights: 'lineHeight',
  boxShadow: 'shadow',
  spacing: 'dimension',
  sizing: 'dimension',
  borderRadius: 'dimension',
  text: 'content',
} as Partial<Record<valueOfTokenTypes, string>>;

const propsMap = {
  shadow: {
    x: 'offsetX',
    y: 'offsetY',
  },
} as Partial<Record<valueOfTokenTypes, Record<string, string>>>;

function recurse(slice: DeepKeyTokenMap<false> | SingleToken<false>) {
  const isToken =
    (Object.hasOwn(slice, '$type') && Object.hasOwn(slice, '$value')) ||
    (Object.hasOwn(slice, 'type') && Object.hasOwn(slice, 'value'));
  if (isToken) {
    const { $value, value, type, $type } = slice;
    const usesDTCG = Object.hasOwn(slice, '$value');
    const t = (usesDTCG ? $type : type) as string;
    const v = usesDTCG ? $value : value;
    const tProp = `${usesDTCG ? '$' : ''}type` as '$type' | 'type';
    const newT = (typesMap[t as keyof typeof typesMap] ?? t) as valueOfTokenTypes;
    (slice[tProp] as valueOfTokenTypes) = newT;

    // now also check propsMap if we need to map some props
    if (typeof v === 'object') {
      const pMap = propsMap[newT as keyof typeof propsMap];
      if (pMap) {
        const convertProps = (obj: Record<string, unknown>) => {
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
