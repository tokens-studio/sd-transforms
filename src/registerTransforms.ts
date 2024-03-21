import type StyleDictionary from 'style-dictionary';
import type { DesignTokens } from 'style-dictionary/types';
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
        name: 'sd-transforms-preprocessors',
        preprocessor: dictionary => {
          return parseTokens(dictionary, transformOpts) as DesignTokens;
        },
      });
    } else {
      sd.registerParser({
        pattern: /\.json$/,
        parse: ({ filePath, contents }) => {
          const tokens = JSON.parse(contents);
          return parseTokens(tokens, transformOpts, filePath) as DesignTokens;
        },
      });
    }
  }

  sd.registerTransform({
    name: 'ts/descriptionToComment',
    type: 'attribute',
    // in style-dictionary v4.0.0-prerelease.9, $description is converted to comments (createPropertyFormatter)
    matcher: token => !token.$description && token.description,
    transformer: token => mapDescriptionToComment(token),
  });

  sd.registerTransform({
    name: 'ts/size/px',
    type: 'value',
    matcher: token => {
      const type = token.$type ?? token.type;
      return (
        typeof type === 'string' &&
        ['sizing', 'spacing', 'borderRadius', 'borderWidth', 'fontSizes', 'dimension'].includes(
          type,
        )
      );
    },
    transformer: token => transformDimension(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/opacity',
    type: 'value',
    matcher: token => (token.$type ?? token.type) === 'opacity',
    transformer: token => transformOpacity(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/size/css/letterspacing',
    type: 'value',
    matcher: token => (token.$type ?? token.type) === 'letterSpacing',
    transformer: token => transformLetterSpacingForCSS(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/size/lineheight',
    type: 'value',
    matcher: token => (token.$type ?? token.type) === 'lineHeights',
    transformer: token => transformLineHeight(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/typography/fontWeight',
    type: 'value',
    matcher: token => (token.$type ?? token.type) === 'fontWeights',
    transformer: token => transformFontWeights(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/typography/css/fontFamily',
    type: 'value',
    matcher: token => (token.$type ?? token.type) === 'fontFamilies',
    transformer: token => processFontFamily(token.$value ?? token.value),
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
    matcher: token => typeof (token.$value ?? token.value) === 'string',
    transformer: token => checkAndEvaluateMath(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/typography/css/shorthand',
    type: 'value',
    transitive: true,
    matcher: token => (token.$type ?? token.type) === 'typography',
    transformer: token => transformTypographyForCSS(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/typography/compose/shorthand',
    type: 'value',
    transitive: true,
    matcher: token => (token.$type ?? token.type) === 'typography',
    transformer: token => transformTypographyForCompose(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/border/css/shorthand',
    type: 'value',
    transitive: true,
    matcher: token => {
      return (token.$type ?? token.type) === 'border';
    },
    transformer: token => transformBorderForCSS(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/shadow/css/shorthand',
    type: 'value',
    transitive: true,
    matcher: token => {
      const type = token.$type ?? token.type;
      return typeof type === 'string' && ['boxShadow'].includes(type);
    },
    transformer: token => {
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
    matcher: token => (token.$type ?? token.type) === 'color',
    transformer: token => transformHEXRGBaForCSS(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/color/modifiers',
    type: 'value',
    transitive: true,
    matcher: token =>
      (token.$type ?? token.type) === 'color' &&
      token.$extensions &&
      token.$extensions['studio.tokens']?.modify,
    transformer: token => transformColorModifiers(token, transformOpts?.['ts/color/modifiers']),
  });

  sd.registerTransformGroup({
    name: 'tokens-studio',
    // add a default name transform, since this is almost always needed
    // it's easy to override by users, adding their own "transforms"
    transforms: [...transforms, 'name/camel'],
  });
}
