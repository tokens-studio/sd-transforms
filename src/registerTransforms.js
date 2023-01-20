import { transformDimension } from './transformDimension.js';
import { transformHEXRGBa } from './transformHEXRGBa.js';
import { transformShadow } from './transformShadow.js';

/**
 * @typedef {import('style-dictionary/types/index')} StyleDictionary
 * @typedef {import('style-dictionary/types/DesignToken').DesignToken} DesignToken
 */

const isBrowser = typeof window === 'object';

/**
 * typecasting since this will need to work in browser environment, so we cannot
 * import style-dictionary as it depends on nodejs env
 * @param {StyleDictionary} sd
 * @returns {Promise<void>}
 */
export async function registerTransforms(sd) {
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
    matcher: /** @param {DesignToken} token */ token =>
      ['fontSizes', 'dimension', 'borderRadius', 'spacing'].includes(token.type),
    transformer: /** @param {DesignToken} token */ token => transformDimension(token.value),
  });

  _sd.registerTransform({
    name: 'ts/color/hexrgba',
    type: 'value',
    transitive: true,
    matcher: /** @param {DesignToken} token */ token =>
      typeof token.value === 'string' && token.value.startsWith('rgba(#'),
    transformer: /** @param {DesignToken} token */ token => transformHEXRGBa(token.value),
  });

  _sd.registerTransform({
    name: 'ts/shadow/shorthand',
    type: 'value',
    transitive: true,
    matcher: /** @param {DesignToken} token */ token => ['boxShadow'].includes(token.type),
    transformer: /** @param {DesignToken} token */ token =>
      Array.isArray(token.original.value)
        ? token.original.value
            .map(/** @param {Record<string,string>} single */ single => transformShadow(single))
            .join(', ')
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
