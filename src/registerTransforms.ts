import type { DesignTokens } from 'style-dictionary/types';
import StyleDictionary from 'style-dictionary';
import { transformPx } from './transformPx.js';
import { transformRem } from './transformRem.js';
import { transformHEXRGBaForCSS } from './css/transformHEXRGBa.js';
import { transformFontWeight } from './transformFontWeight.js';
import { transformLetterSpacingForCSS } from './css/transformLetterSpacing.js';
import { transformLineHeight } from './transformLineHeight.js';
import { transformTypographyForCompose } from './compose/transformTypography.js';
import { checkAndEvaluateMath } from './checkAndEvaluateMath.js';
import { mapDescriptionToComment } from './mapDescriptionToComment.js';
import { transformColorModifiers } from './color-modifiers/transformColorModifiers.js';
import { TransformOptions } from './TransformOptions.js';
import { transformOpacity } from './transformOpacity.js';
import { parseTokens } from './preprocessors/parse-tokens.js';
import { transformShadow } from './css/transformShadow.js';

export const transforms = [
  'ts/descriptionToComment',
  'ts/resolveMath',
  'ts/size/px',
  'ts/opacity',
  'ts/size/css/letterspacing',
  'ts/size/lineheight',
  'ts/typography/fontWeight',
  'ts/shadow/innerShadow',
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
  sd.registerPreprocessor({
    name: 'tokens-studio',
    preprocessor: dictionary => {
      return parseTokens(dictionary, transformOpts) as DesignTokens;
    },
  });

  sd.registerTransform({
    name: 'ts/descriptionToComment',
    type: 'attribute',
    filter: token => token.description,
    transform: token => mapDescriptionToComment(token),
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
   * after resolution, e.g. color modify or resolve math
   *
   * Any transforms that may need to occur after resolving of math therefore also
   * need to be transitive... which means basically every transform we have.
   */
  sd.registerTransform({
    name: 'ts/resolveMath',
    type: 'value',
    transitive: true,
    filter: token => ['string', 'object'].includes(typeof (token.$value ?? token.value)),
    transform: token => checkAndEvaluateMath(token),
  });

  sd.registerTransform({
    name: 'ts/size/px',
    type: 'value',
    transitive: true,
    filter: token => {
      const type = token.$type ?? token.type;
      return (
        typeof type === 'string' &&
        ['fontSize', 'dimension', 'typography', 'border', 'shadow'].includes(type)
      );
    },
    transform: token => transformPx(token),
  });

  sd.registerTransform({
    name: 'ts/size/rem',
    type: 'value',
    filter: token => {
      const type = token.$type ?? token.type;
      return (
        typeof type === 'string' &&
        ['fontSize', 'dimension', 'typography', 'border', 'shadow'].includes(type)
      );
    },
    transform: token =>
      transformRem(token.$value ?? token.value, transformOpts?.['ts/size/rem']?.baseFontSize),
  });

  sd.registerTransform({
    name: 'ts/opacity',
    type: 'value',
    transitive: true,
    filter: token => (token.$type ?? token.type) === 'opacity',
    transform: token => transformOpacity(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/size/css/letterspacing',
    type: 'value',
    transitive: true,
    filter: token => {
      const type = token.$type ?? token.type;
      return typeof type === 'string' && ['letterSpacing', 'typography'].includes(type);
    },
    transform: token => transformLetterSpacingForCSS(token),
  });

  sd.registerTransform({
    name: 'ts/size/lineheight',
    type: 'value',
    transitive: true,
    filter: token => {
      const type = token.$type ?? token.type;
      return typeof type === 'string' && ['lineHeight', 'typography'].includes(type);
    },
    transform: token => transformLineHeight(token),
  });

  sd.registerTransform({
    name: 'ts/typography/fontWeight',
    type: 'value',
    transitive: true,
    filter: token => {
      const type = token.$type ?? token.type;
      return typeof type === 'string' && ['fontWeight', 'typography'].includes(type);
    },
    transform: token => transformFontWeight(token),
  });

  sd.registerTransform({
    name: 'ts/shadow/innerShadow',
    type: 'value',
    transitive: true,
    filter: token => (token.$type ?? token.type) === 'shadow',
    transform: token => transformShadow(token.$value ?? token.value),
  });

  sd.registerTransform({
    name: 'ts/typography/compose/shorthand',
    type: 'value',
    transitive: true,
    filter: token => (token.$type ?? token.type) === 'typography',
    transform: token => transformTypographyForCompose(token),
  });

  sd.registerTransform({
    name: 'ts/color/css/hexrgba',
    type: 'value',
    transitive: true,
    filter: token => {
      const type = token.$type ?? token.type;
      return typeof type === 'string' && ['color', 'shadow', 'border'].includes(type);
    },
    transform: token => transformHEXRGBaForCSS(token),
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
