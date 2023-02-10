/**
 * @typedef {import("./registerTransforms").DesignToken & { description?: string }} DesignTokenWithDescription
 */
/**
 * Helper: Maps the token description to a style dictionary comment attribute - this will be picked up by some Style Dictionary
 * formats and automatically output as code comments
 * @param {DesignTokenWithDescription} token
 * @returns {DesignTokenWithDescription} token
 */
export function mapDescriptionToComment(token) {
  // purposeful mutation of the original object
  const _t = token;
  _t.comment = _t.description;
  return _t;
}
