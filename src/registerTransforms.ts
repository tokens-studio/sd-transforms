import { Core } from 'style-dictionary';
import { transformPx } from './transformPx.js';
import { transformRem } from './transformRem.js';
import { transformHEXRGBa } from './transformHEXRGBa.js';
import { transformShadow } from './transformShadow.js';
import { transformFontWeights } from './transformFontWeights.js';
import { transformLetterSpacing } from './transformLetterSpacing.js';
import { transformLineHeight } from './transformLineHeight.js';
import { transformTypographyForCSS } from './css/transformTypography.js';
import { transformTypographyForCompose } from './compose/transformTypography.js';
import { checkAndEvaluateMath } from './checkAndEvaluateMath.js';
import { mapDescriptionToComment } from './mapDescriptionToComment.js';
import { transformColorModifiers } from './color-modifiers/transformColorModifiers.js';

const isBrowser = typeof window === 'object';

/**
 * typecasting since this will need to work in browser environment, so we cannot
 * import style-dictionary as it depends on nodejs env
 */
export async function registerTransforms(sd: Core) {
  let _sd = sd;

  // NodeJS env and no passed SD? let's register on our installed SD
  // We're in ESM, but style-dictionary is CJS only, so we need module.createRequire
  if (!isBrowser && _sd === undefined) {
    const module = await import('module');
    const mod = module.default;
    const require = mod.createRequire(import.meta.url);
    _sd = require('style-dictionary');
  }

  _sd.registerTransform({
    name: 'ts/size/px',
    type: 'value',
    transitive: true,
    matcher: token => token.type === 'borderWidth',
    transformer: token => transformPx(token.value),
  });

  _sd.registerTransform({
    name: 'ts/size/rem',
    type: 'value',
    transitive: true,
    matcher: token =>
      ['sizing', 'spacing', 'borderRadius', 'fontSizes', 'dimension'].includes(
        token.type,
      ),
    transformer: token => transformRem(token.value),
  });

  _sd.registerTransform({
    name: 'ts/color/hexrgba',
    type: 'value',
    transitive: true,
    matcher: token => typeof token.value === 'string' && token.value.startsWith('rgba(#'),
    transformer: token => transformHEXRGBa(token.value),
  });

  _sd.registerTransform({
    name: 'ts/color/modifiers',
    type: 'value',
    transitive: true,
    matcher: token =>
      token.type === 'color' && token.$extensions && token.$extensions['studio.tokens']?.modify,
    transformer: token => transformColorModifiers(token),
  });

  _sd.registerTransform({
    name: 'ts/shadow/shorthand',
    type: 'value',
    transitive: true,
    matcher: token => ['boxShadow'].includes(token.type),
    transformer: token =>
      Array.isArray(token.value)
        ? token.value.map(single => transformShadow(single)).join(', ')
        : transformShadow(token.value),
  });

  _sd.registerTransform({
    name: 'ts/type/fontWeight',
    type: 'value',
    transitive: true,
    matcher: token => token.type === 'fontWeights',
    transformer: token => transformFontWeights(token.value),
  });

  _sd.registerTransform({
    name: 'ts/size/letterspacing',
    type: 'value',
    transitive: true,
    matcher: token => token.type === 'letterSpacing',
    transformer: token => transformLetterSpacing(token.value),
  });

  _sd.registerTransform({
    name: 'ts/size/lineheight',
    type: 'value',
    transitive: true,
    matcher: token => token.type === 'lineHeights',
    transformer: token => transformLineHeight(token.value),
  });

  _sd.registerTransform({
    name: 'ts/typography/css/shorthand',
    type: 'value',
    transitive: true,
    matcher: token => token.type === 'typography',
    transformer: token => transformTypographyForCSS(token.value),
  });

  _sd.registerTransform({
    name: 'ts/typography/compose/shorthand',
    type: 'value',
    transitive: true,
    matcher: token => token.type === 'typography',
    transformer: token => transformTypographyForCompose(token.value),
  });

  _sd.registerTransform({
    name: 'ts/resolveMath',
    type: 'value',
    transitive: true,
    matcher: token => typeof token.value === 'string',
    // Putting this in strings seems to be required
    transformer: token => `${checkAndEvaluateMath(token.value)}`,
  });

  _sd.registerTransform({
    name: 'ts/descriptionToComment',
    type: 'attribute',
    matcher: token => token.description,
    transformer: token => mapDescriptionToComment(token),
  });

  _sd.registerTransformGroup({
    name: 'tokens-studio',
    transforms: [
      'ts/descriptionToComment',
      'ts/resolveMath',
      'ts/size/px',
      'ts/size/letterspacing',
      'ts/size/lineheight',
      'ts/type/fontWeight',
      'ts/color/hexrgba',
      'ts/color/modifiers',
      'ts/typography/css/shorthand',
      'ts/shadow/shorthand',
      // by default we go with camel, as having no default will likely give the user
      // errors straight away. This can be overridden by manually passing an array of transforms
      // instead of this transformGroup, or by doing a name conversion in your custom format
      'name/cti/camel',
    ],
  });
}
