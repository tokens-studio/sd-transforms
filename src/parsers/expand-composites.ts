import type { DeepKeyTokenMap, SingleToken, TokenBoxshadowValue } from '@tokens-studio/types';
import type { DesignTokens } from 'style-dictionary/types';
import { usesReferences, resolveReferences } from 'style-dictionary/utils';
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
    fontStyle: 'fontStyles',
  },
};

function flattenValues<T extends SingleToken<false>['value']>(val: T): T {
  return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, v.value])) as T;
}

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
    const token = slice[key] as SingleToken<false>;
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
          // if token uses a reference, attempt to resolve it
          if (typeof token.value === 'string' && usesReferences(token.value)) {
            try {
              const resolved = resolveReferences(token.value, copy as DesignTokens);
              if (resolved) {
                token.value = resolved;
              }
            } catch (e) {
              // we don't want to throw a fatal error, expansion can still occur, just with the reference kept as is
              console.error(e);
            }
            // If every key of the result (object) is a number, the ref value is a multi-value, which means TokenBoxshadowValue[]
            if (
              typeof token.value === 'object' &&
              Object.keys(token.value).every(key => !isNaN(Number(key)))
            ) {
              token.value = (Object.values(token.value) as TokenBoxshadowValue[]).map(part =>
                flattenValues(part),
              );
            } else if (!usesReferences(token.value)) {
              token.value = flattenValues(token.value);
            }
          }
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
