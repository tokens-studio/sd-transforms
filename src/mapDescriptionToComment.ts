import { DesignToken } from 'style-dictionary';

/**
 * Helper: Maps the token description to a style dictionary comment attribute - this will be picked up by some Style Dictionary
 * formats and automatically output as code comments
 */
export function mapDescriptionToComment(token: DesignToken): DesignToken {
  // intentional mutation of the original object
  const _t = token;
  _t.comment = _t.description;
  return _t;
}
