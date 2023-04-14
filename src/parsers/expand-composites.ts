import { DeepKeyTokenMap, SingleToken } from '@tokens-studio/types';
import {
  ExpandFilter,
  TransformOptions,
  Expandables,
  ExpandablesAsStrings,
  expandablesAsStringsArr,
} from '../TransformOptions.js';

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
  },
};

export function expandToken(compToken: SingleToken<false>, isShadow = false): SingleToken<false> {
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
  filePath: string,
): boolean {
  if (typeof condition === 'function') {
    return condition(token, filePath);
  }
  return condition;
}

function recurse(
  slice: DeepKeyTokenMap<false>,
  filePath: string,
  transformOpts: TransformOptions = {},
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
          slice[key] = expandToken(token as SingleToken, expandType === 'shadow');
        }
      }
    } else if (typeof token === 'object') {
      // TODO: figure out why we have to hack this typecast, if a value doesn't have a value & type,
      // it is definitely a nested DeepKeyTokenMap and not a SingleToken, but TS seems to think it must be
      // a SingleToken after this if statement
      recurse(token as unknown as DeepKeyTokenMap<false>, filePath, transformOpts);
    }
  }
}

export function expandComposites(
  dictionary: DeepKeyTokenMap<false>,
  filePath: string,
  transformOpts?: TransformOptions,
): DeepKeyTokenMap<false> {
  const copy = { ...dictionary };
  recurse(copy, filePath, transformOpts);
  return copy;
}
