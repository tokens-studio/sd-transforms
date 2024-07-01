import type { DesignToken } from 'style-dictionary/types';

/**
 * Helper: Maps the token description to a style dictionary comment attribute - this will be picked up by some Style Dictionary
 * formats and automatically output as code comments
 */
export function mapDescriptionToComment(token: DesignToken): DesignToken {
  // intentional mutation of the original object
  const _t = token;
  // Replace carriage returns with just newlines
  _t.comment = _t.description.replace(/\r?\n|\r/g, '\n');
  return _t;
}
