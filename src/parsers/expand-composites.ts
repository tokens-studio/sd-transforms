import { DeepKeyTokenMap, SingleToken } from '@tokens-studio/types';
import {
  ExpandFilter,
  TransformOptions,
  Expandables,
  ExpandablesAsStrings,
  expandablesAsStringsArr,
} from '../TransformOptions.js';
import { resolveReference } from './resolveReference.js';

const typeMaps = {
  boxShadow: {
    x: 'dimension',
    y: 'dimension',
    blur: 'dimension',
    spread: 'dimension',
    type: 'other',
  },
  border: {
    width: 'borderWidth',
    style: 'other',
  },
  composition: {},
  typography: {
    fontFamily: 'fontFamilies',
    fontWeight: 'fontWeights',
    lineHeight: 'lineHeights',
    fontSize: 'fontSizes',
    fontStyle: 'fontStyles',
  },
};

export function expandToken(compToken: SingleToken<false>, isShadow = false): SingleToken<false> {
  if (typeof compToken.value !== 'object') {
    return compToken;
  }
  const expandedObj = {} as SingleToken<false>;

  const getType = (key: string) => typeMaps[compToken.type][key] ?? key;

  // multi-shadow
  if (isShadow && Array.isArray(compToken.value)) {
    compToken.value.forEach((shadow, index) => {
      expandedObj[index + 1] = {};
      Object.entries(shadow).forEach(([key, value]) => {
        expandedObj[index + 1][key] = {
          value: `${value}`,
          type: getType(key),
        };
      });
    });
  } else {
    Object.entries(compToken.value).forEach(([key, value]) => {
      expandedObj[key] = {
        value: `${value}`,
        type: getType(key),
      };
    });
  }

  return expandedObj;
}

function shouldExpand<T extends SingleToken>(
  token: T,
  condition: boolean | ExpandFilter<T>,
  filePath?: string,
): boolean {
  if (typeof condition === 'function') {
    return condition(token, filePath);
  }
  return condition;
}

function recurse(
  slice: DeepKeyTokenMap<false> | SingleToken<false>,
  copy: DeepKeyTokenMap<false> | SingleToken<false>,
  transformOpts: TransformOptions = {},
  filePath?: string,
) {
  const opts = {
    ...transformOpts,
    expand: {
      composition: true,
      typography: false,
      border: false,
      shadow: false,
      ...(transformOpts.expand || {}),
    },
  };

  for (const key in slice) {
    const token = slice[key];
    if (typeof token !== 'object' || token === null) {
      continue;
    }
    const { type } = token;
    if (token.value && type) {
      if (typeof type === 'string' && expandablesAsStringsArr.includes(type)) {
        const expandType = (type as ExpandablesAsStrings) === 'boxShadow' ? 'shadow' : type;
        const expand = shouldExpand<Expandables>(
          token as Expandables,
          opts.expand[expandType],
          filePath,
        );
        if (expand) {
          // if token uses a reference, resolve it
          token.value = resolveReference(token.value, copy);
          slice[key] = expandToken(token, expandType === 'shadow');
        }
      }
    } else {
      recurse(token, copy, transformOpts, filePath);
    }
  }
}

export function expandComposites(
  dictionary: DeepKeyTokenMap<false> | SingleToken<false>,
  transformOpts?: TransformOptions,
  filePath?: string,
): DeepKeyTokenMap<false> | SingleToken<false> {
  const copy = structuredClone(dictionary);
  recurse(copy, copy, transformOpts, filePath);
  return copy;
}
