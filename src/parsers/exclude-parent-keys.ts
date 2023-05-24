import { DeepKeyTokenMap } from '@tokens-studio/types';
import deepmerge from 'deepmerge';
import { TransformOptions } from '../TransformOptions.js';

export function excludeParentKeys(
  dictionary: DeepKeyTokenMap<false>,
  transformOpts?: TransformOptions,
): DeepKeyTokenMap<false> {
  if (!transformOpts?.excludeParentKeys) {
    return dictionary;
  }
  const copy = {} as DeepKeyTokenMap<false>;
  Object.values(dictionary).forEach(set => {
    Object.entries(set).forEach(([key, tokenGroup]) => {
      if (copy[key]) {
        copy[key] = deepmerge(copy[key] as DeepKeyTokenMap<false>, tokenGroup);
      } else {
        copy[key] = tokenGroup;
      }
    });
  });
  return copy;
}
