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

function flattenValues<T extends Required<SingleToken<false>>['value']>(val: T): T {
  return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, v.$value ?? v.value])) as T;
}

export function expandToken(token: Expandables, isShadow = false): SingleToken<false> {
  const uses$ = token.$value != null;
  const value = uses$ ? token.$value : token.value;
  // the $type and type may both be missing if the $type is coming from an ancestor,
  // however, style-dictionary runs a preprocessing step so missing $type is added from the closest ancestor
  // our token types are not aware of that however, so we must do an undefined check here
  const tokenType = token.$type ?? token.type;
  // ignore coverage, this undefined check is purely to appease TypeScript,
  // but we know type cannot be undefined here since we checked it in recurse()
  /* c8 ignore next 3 */
  if (tokenType === undefined) {
    return token;
  }

  const expandedObj = {} as SingleToken<false>;
  const getType = (key: string) => typeMaps[tokenType][key] ?? key;

  // multi-shadow
  if (isShadow && Array.isArray(value)) {
    value.forEach((shadow, index) => {
      expandedObj[index + 1] = {};
      Object.entries(shadow).forEach(([key, value]) => {
        expandedObj[index + 1][key] = {
          [`${uses$ ? '$' : ''}value`]: `${value}`,
          [`${uses$ ? '$' : ''}type`]: getType(key),
        };
      });
    });
  } else {
    Object.entries(value).forEach(([key, value]) => {
      expandedObj[key] = {
        [`${uses$ ? '$' : ''}value`]: `${value}`,
        [`${uses$ ? '$' : ''}type`]: getType(key),
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

    const uses$ = token.$value != null;
    const value = uses$ ? token.$value : token.value;
    const type = token.$type ?? token.type;
    if (value && type) {
      if (typeof type === 'string' && expandablesAsStringsArr.includes(type)) {
        const expandType = (type as ExpandablesAsStrings) === 'boxShadow' ? 'shadow' : type;
        const expand = shouldExpand<Expandables>(
          token as Expandables,
          opts.expand[expandType],
          filePath,
        );
        if (expand) {
          // if token uses a reference, attempt to resolve it
          if (typeof value === 'string' && usesReferences(value)) {
            let resolved = resolveReferences(
              value,
              copy as DesignTokens,
            ) as SingleToken<false>['value'];
            if (typeof resolved === 'object') {
              // If every key of the result (object) is a number, the ref value is a multi-value, which means TokenBoxshadowValue[]
              if (Object.keys(resolved).every(key => !isNaN(Number(key)))) {
                resolved = (Object.values(resolved) as TokenBoxshadowValue[]).map(part =>
                  flattenValues(part),
                );
              } else {
                resolved = flattenValues(resolved);
              }
            }

            if (resolved) {
              if (uses$) {
                token.$value = resolved;
              } else {
                token.value = resolved;
              }
            }
          }
          slice[key] = expandToken(token as Expandables, expandType === 'shadow');
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
