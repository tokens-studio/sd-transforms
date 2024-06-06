export { registerTransforms, transforms } from './registerTransforms.js';

export { addFontStyles } from './preprocessors/add-font-styles.js';
export { alignTypes } from './preprocessors/align-types.js';
export { excludeParentKeys } from './preprocessors/exclude-parent-keys.js';
export { parseTokens } from './preprocessors/parse-tokens.js';

export { mapDescriptionToComment } from './mapDescriptionToComment.js';
export { checkAndEvaluateMath } from './checkAndEvaluateMath.js';
export { transformDimension } from './transformDimension.js';
export { transformFontWeight } from './transformFontWeight.js';
export { transformColorModifiers } from './color-modifiers/transformColorModifiers.js';
export { transformLineHeight } from './transformLineHeight.js';
export { transformOpacity } from './transformOpacity.js';

export { transformHEXRGBaForCSS } from './css/transformHEXRGBa.js';
export { transformLetterSpacingForCSS } from './css/transformLetterSpacing.js';
export { transformShadow } from './css/transformShadow.js';

export { transformTypographyForCompose } from './compose/transformTypography.js';

export { permutateThemes } from './permutateThemes.js';

/**
 * Some of the Tokens Studio typography/shadow props need to be aligned
 * when expanding them through StyleDictionary expand
 */
export const expandTypesMap = {
  typography: {
    paragraphSpacing: 'dimension',
    paragraphIndent: 'dimension',
    textDecoration: 'other',
    textCase: 'other',
  },
  /**
   * boxShadow/x/y are not shadow/offsetX/offsetY here because the SD expand on global level
   * happens before these types are aligned in sd-transforms preprocessor
   */
  boxShadow: {
    x: 'dimension',
    y: 'dimension',
    blur: 'dimension',
    spread: 'dimension',
  },
};
