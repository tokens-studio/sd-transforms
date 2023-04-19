import { DeepKeyTokenMap } from '@tokens-studio/types';
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
      copy[key] = tokenGroup;
    });
  });
  return copy;
}
