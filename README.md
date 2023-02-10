# Style Dictionary Transforms for Tokens Studio

![NPM version badge](https://img.shields.io/npm/v/@tokens-studio/sd-transforms) ![License badge](https://img.shields.io/github/license/tokens-studio/sd-transforms)

> This library is currently in beta.

This package contains custom transforms for [Style-Dictionary](https://amzn.github.io/style-dictionary/#/),
to work with Design Tokens that are exported from [Tokens Studio](https://tokens.studio/):

- Check and evaluate Math expressions (transitive)
- Transform dimensions tokens to have `px` as a unit when missing (transitive)
- Transform letterspacing from `%` to `em`
- Transform lineheight from `%` to unitless (150% -> 1.5)
- Transform fontweight from keynames to fontweight numbers (100, 200, 300 ... 900)
- Transform colors to `rgba()` format
- Transform typography objects to CSS typography parts
- Transform Tokens Studio shadow objects to CSS shadow format
- Registers these transforms, in addition to `attribute/cti`, `name/cti/camelCase` for naming purposes, as a transform group called `tokens-studio`

## Installation

With [NPM](https://www.npmjs.com/):

```sh
npm install @tokens-studio/sd-transforms
```

## Usage

```js
import { registerTransforms } from '@tokens-studio/sd-transforms';

// will register them on StyleDictionary object
// that is installed as a dependency of this package,
// in most case this will be npm install deduped with your installation,
// thus being the same object as you use
registerTransforms();

// or pass your own StyleDictionary object to it in case the former doesn't work
registerTransforms(sdObject);
```

In your Style-Dictionary config:

```json
{
  "source": ["**/*.tokens.json"],
  "platforms": {
    "js": {
      "transformGroup": "tokens-studio",
      "buildPath": "build/js/",
      "files": [
        {
          "destination": "variables.js",
          "format": "javascript/es6"
        }
      ]
    },
    "css": {
      "transforms": [
        "ts/resolveMath",
        "ts/size/px",
        "ts/size/letterspacing",
        "ts/size/lineheight",
        "ts/type/fontWeight",
        "ts/color/hexrgba",
        "ts/typography/shorthand",
        "ts/shadow/shorthand",
        "attribute/cti",
        "name/cti/kebab"
      ],
      "buildPath": "build/css/",
      "files": [
        {
          "destination": "variables.css",
          "format": "css/variables"
        }
      ]
    }
  }
}
```

More fine-grained control:

```js
import module from 'module';
import { transformDimension } from '@tokens-studio/sd-transforms';

const require = module.createRequire(import.meta.url);
const StyleDictionary = require('style-dictionary');

StyleDictionary.registerTransform({
  name: 'my/size/px',
  type: 'value',
  transitive: true,
  matcher: token => ['fontSizes', 'dimension', 'borderRadius', 'spacing'].includes(token.type),
  transformer: token => transformDimension(token.value),
});
```

### CommonJS

If you use CommonJS, no problem, you can use this package as CommonJS,
if your tooling supports [package entry points](https://nodejs.org/api/packages.html#package-entry-points) (a.k.a. exports map)!

```js
const { registerTransforms } = require('@tokens-studio/sd-transforms');
```
