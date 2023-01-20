import module from 'module';
import { transformDimension } from './transformDimension.js';
import { transformHEXRGBa } from './transformHEXRGBa.js';
import { transformShadow } from './transformShadow.js';

const require = module.createRequire(import.meta.url);
const StyleDictionary = require('style-dictionary');

/**
 *
 * @param {StyleDictionary} sd
 */
export function registerTransforms(sd) {
  const _sd = sd ?? StyleDictionary;

  _sd.registerTransform({
    name: 'ts/size/px',
    type: 'value',
    transitive: true,
    matcher: token => ['fontSizes', 'dimension', 'borderRadius', 'spacing'].includes(token.type),
    transformer: token => transformDimension(token.value),
  });

  _sd.registerTransform({
    name: 'ts/color/hexrgba',
    type: 'value',
    transitive: true,
    matcher: token => typeof token.value === 'string' && token.value.startsWith('rgba(#'),
    transformer: token => transformHEXRGBa(token.value),
  });

  _sd.registerTransform({
    name: 'ts/shadow/shorthand',
    type: 'value',
    transitive: true,
    matcher: token => ['boxShadow'].includes(token.type),
    transformer: token =>
      Array.isArray(token.original.value)
        ? token.original.value.map(single => transformShadow(single)).join(', ')
        : transformShadow(token.original.value),
  });

  _sd.registerTransformGroup({
    name: 'tokens-studio',
    transforms: [
      'ts/size/px',
      'ts/color/hexrgba',
      'ts/shadow/shorthand',
      'attribute/cti',
      // by default we go with camel, as having no default will likely give the user
      // errors straight away. They can override this default easily, an additional name/cti
      // transform will just override earlier transforms in this transformGroup array
      'name/cti/camel',
    ],
  });
}
