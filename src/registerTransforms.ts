import type { DesignTokens } from 'style-dictionary/types';
import StyleDictionary from 'style-dictionary';
import { transformDimension } from './transformDimension.js';
import { transformHEXRGBaForCSS } from './css/transformHEXRGBa.js';
import { transformShadowForCSS } from './css/transformShadow.js';
import { transformFontWeights } from './transformFontWeights.js';
import { transformLetterSpacingForCSS } from './css/transformLetterSpacing.js';
import { transformLineHeight } from './transformLineHeight.js';
import { processFontFamily, transformTypographyForCSS } from './css/transformTypography.js';
import { transformTypographyForCompose } from './compose/transformTypography.js';
import { transformBorderForCSS } from './css/transformBorder.js';
import { checkAndEvaluateMath } from './checkAndEvaluateMath.js';
import { mapDescriptionToComment } from './mapDescriptionToComment.js';
import { transformColorModifiers } from './color-modifiers/transformColorModifiers.js';
import { TransformOptions } from './TransformOptions.js';
import { transformOpacity } from './transformOpacity.js';
import { parseTokens } from './parsers/parse-tokens.js';

export const transforms = [
  'ts/descriptionToComment',
  'ts/size/px',
  'ts/opacity',
  'ts/size/lineheight',
  'ts/typography/fontWeight',
  'ts/resolveMath',
  'ts/size/css/letterspacing',
  'ts/typography/css/fontFamily',
  'ts/typography/css/shorthand',
  'ts/border/css/shorthand',
  'ts/shadow/css/shorthand',
  'ts/color/css/hexrgba',
  'ts/color/modifiers',
];

/**
 * typecasting since this will need to work in browser environment, so we cannot
 * import style-dictionary as it depends on nodejs env
 */
export async function registerTransforms(
  sd: typeof StyleDictionary,
  transformOpts?: TransformOptions,
) {
  // >= 4.0.0-prelease.2, once SD reaches full release: 4.0.0, sd-transforms will get
  // a breaking release where we always use preprocessors
  // and are no longer backwards compatible with sd 3 or lower
  const supportsPreprocessors =
    sd.VERSION.match(/4\.0\.0(-prerelease\.([2-9]|[0-9]{2}))/g) !== null;
  // Allow completely disabling the registering of this parser
  // in case people want to combine the expandComposites() utility with their own parser and prevent conflicts
  if (transformOpts?.expand !== false) {
    // expand composition tokens, typography, border, shadow (latter 3 conditionally, as opt-in)
    if (supportsPreprocessors) {
      sd.registerPreprocessor({
        name: 'tokens-studio',
        preprocessor: dictionary => {
          return parseTokens(dictionary, transformOpts) as DesignTokens;
        },
      });
    }
  }

  sd.registerTransform({
    name: 'ts/descriptionToComment',
    type: 'attribute',
    // in style-dictionary v4.0.0-prerelease.9, $description is converted to comments (createPropertyFormatter)
    filter: token => !token.$description && token.description,
    transform: token => mapDescriptionToComment(token),
  });

  sd.registerTransform({
    name: 'ts/size/px',
    type: 'value',
    filter: token => {
      const type = token.$type ?? token.type;
      return (
        typeof type === 'string' &&
        ['sizing', 'spacing', 'borderRadius', 'borderWidth', 'fontSizes', 'dimension'].includes(
          type,
        )
      );
    },
    transform: token => transformDimension(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/opacity',
    type: 'value',
    filter: token => (token.$type ?? token.type) === 'opacity',
    transform: token => transformOpacity(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/size/css/letterspacing',
    type: 'value',
    filter: token => (token.$type ?? token.type) === 'letterSpacing',
    transform: token => transformLetterSpacingForCSS(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/size/lineheight',
    type: 'value',
    filter: token => (token.$type ?? token.type) === 'lineHeights',
    transform: token => transformLineHeight(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/typography/fontWeight',
    type: 'value',
    filter: token => (token.$type ?? token.type) === 'fontWeights',
    transform: token => transformFontWeights(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/typography/css/fontFamily',
    type: 'value',
    filter: token => (token.$type ?? token.type) === 'fontFamilies',
    transform: token => processFontFamily(token.$value ?? token.value),
  });

  /**
   * The transforms below are transitive transforms, because their values
   * can contain references, e.g.:
   * - rgba({color.r}, {color.g}, 0, 0)
   * - {dimension.scale} * {spacing.sm}
   * - { fontSize: "{foo}" }
   * - { width: "{bar}" }
   * - { blur: "{qux}" }
   * or because the modifications have to be done on this specific token,
   * after resolution, e.g. color modify
   */
  sd.registerTransform({
    name: 'ts/resolveMath',
    type: 'value',
    transitive: true,
    filter: token => typeof (token.$value ?? token.value) === 'string',
    transform: token => checkAndEvaluateMath(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/typography/css/shorthand',
    type: 'value',
    transitive: true,
    filter: token => (token.$type ?? token.type) === 'typography',
    transform: token => transformTypographyForCSS(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/typography/compose/shorthand',
    type: 'value',
    transitive: true,
    filter: token => (token.$type ?? token.type) === 'typography',
    transform: token => transformTypographyForCompose(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/border/css/shorthand',
    type: 'value',
    transitive: true,
    filter: token => {
      return (token.$type ?? token.type) === 'border';
    },
    transform: token => transformBorderForCSS(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/shadow/css/shorthand',
    type: 'value',
    transitive: true,
    filter: token => {
      const type = token.$type ?? token.type;
      return typeof type === 'string' && ['boxShadow'].includes(type);
    },
    transform: token => {
      const val = token.$value ?? token.value;
      return Array.isArray(val)
        ? val.map(single => transformShadowForCSS(single)).join(', ')
        : transformShadowForCSS(val);
    },
  });

  sd.registerTransform({
    name: 'ts/color/css/hexrgba',
    type: 'value',
    transitive: true,
    filter: token => (token.$type ?? token.type) === 'color',
    transform: token => transformHEXRGBaForCSS(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/color/modifiers',
    type: 'value',
    transitive: true,
    filter: token =>
      (token.$type ?? token.type) === 'color' &&
      token.$extensions &&
      token.$extensions['studio.tokens']?.modify,
    transform: token => transformColorModifiers(token, transformOpts?.['ts/color/modifiers']),
  });

  sd.registerTransformGroup({
    name: 'tokens-studio',
    // add a default name transform, since this is almost always needed
    // it's easy to override by users, adding their own "transforms"
    transforms: [...transforms, 'name/camel'],
  });
}
