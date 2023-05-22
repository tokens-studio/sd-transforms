# Style Dictionary Transforms for Tokens Studio

![NPM version badge](https://img.shields.io/npm/v/@tokens-studio/sd-transforms) ![License badge](https://img.shields.io/github/license/tokens-studio/sd-transforms)

> This library is currently in beta.

This package contains custom transforms for [Style-Dictionary](https://amzn.github.io/style-dictionary/#/),
to work with Design Tokens that are exported from [Tokens Studio](https://tokens.studio/):

Generic:

- Expands composition tokens into multiple, optionally also does so for typography, border and shadow tokens -> parser
- Optionally excludes parent keys from your tokens file, e.g. when using single-file export from Tokens Studio Figma plugin -> parser
- Maps token descriptions to comments -> `ts/descriptionToComment`
- Check and evaluate Math expressions (transitive) -> `ts/resolveMath`
- Transform dimensions tokens to have `px` as a unit when missing (transitive) -> `ts/size/px`
- Transform opacity from `%` to number between `0` and `1` -> `ts/opacity`
- Transform lineheight from `%` to unitless (150% -> 1.5) -> `ts/size/lineheight`
- Transform fontweight from keynames to fontweight numbers (100, 200, 300 ... 900) -> `ts/type/fontWeight`
- Transform color modifiers from Tokens Studio to color values -> `ts/color/modifiers`

CSS:

- Transform letterspacing from `%` to `em` -> `ts/size/css/letterspacing`
- Transform colors to `rgba()` format -> `ts/color/css/hexrgba`
- Transform typography objects to CSS shorthand -> `ts/typography/css/shorthand`
- Transform Tokens Studio shadow objects to CSS shadow shorthand -> `ts/shadow/css/shorthand`
- Transform border objects to CSS border shorthand -> `ts/border/css/shorthand`

Android:

- Transform typography objects to Android Compose shorthand -> `ts/typography/compose/shorthand`

Registers the **generic** and **CSS** transforms, in addition to `name/cti/camel` for naming purposes, as a transform group called `tokens-studio`.

## Installation

With [NPM](https://www.npmjs.com/):

```sh
npm install @tokens-studio/sd-transforms
```

## Usage

> Note: this library is available both in CJS and ESM

## create a file to run custom transformers 

```js
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
registerTransforms(StyleDictionary);
```

Can also import in ESM if needed.

### Using the transforms

In your Style-Dictionary config, you can **either** use the `tokens-studio` transformGroup **or** the separate transforms (all of the names of those are listed):

```json
{
  "source": ["**/*.tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "tokens-studio",
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

More fine-grained control is possible, every transformation is available as a raw JavaScript function
for you to create your own Style-Dictionary transformer out of.

```js
const { transformDimension } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

StyleDictionary.registerTransform({
  name: 'my/size/px',
  type: 'value',
  transitive: true,
  matcher: token => ['fontSizes', 'dimension', 'borderRadius', 'spacing'].includes(token.type),
  transformer: token => transformDimension(token.value),
});
```

### Custom Transform Group

In Style-Dictionary, [`transformGroup` and `transforms` cannot be combined in a platform inside your config](https://github.com/amzn/style-dictionary/issues/813).

Therefore, if you wish to use the transform group, but adjust, add or remove a few transforms, your best option is creating a custom transformGroup:

```js
const { transforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

// Register custom tokens-studio transform group
// without 'px' being added to numbers without a unit
// and also adding 'name/cti/camel' for the token names
StyleDictionary.registerTransformGroup({
  name: 'custom/tokens-studio',
  transforms: [...transforms, 'name/cti/camel'].filter(transform => transform !== 'ts/size/px'),
});
```

### Options

You can pass options to the `registerTransforms` function.

```js
registerTransforms({
  expand: {
    composition: false,
    typography: true,
    border: (token, filePath) =>
      token.value.width !== 0 && filePath.startsWith(path.resolve('tokens/core')),
    shadow: false,
  },
  excludeParentKeys: true,
});
```

Options:

| name               | type                     | required | default         | description                                                                                                                           |
| ------------------ | ------------------------ | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| excludeParentKeys  | boolean                  | ❌       | `false`         | Whether or not to exclude parent keys from your token files                                                                           |
| expand             | boolean \| ExpandOptions | ❌       | See props below | `false` to not register the parser at all. By default, expands composition tokens. Optionally, border, shadow and typography as well. |
| expand.composition | boolean \| ExpandFilter  | ❌       | `true`          | Whether or not to expand compositions. Also allows a filter callback function to conditionally expand per token/filePath              |
| expand.typography  | boolean \| ExpandFilter  | ❌       | `false`         | Whether or not to expand typography. Also allows a filter callback function to conditionally expand per token/filePath                |
| expand.shadow      | boolean \| ExpandFilter  | ❌       | `false`         | Whether or not to expand shadows. Also allows a filter callback function to conditionally expand per token/filePath                   |
| expand.border      | boolean \| ExpandFilter  | ❌       | `false`         | Whether or not to expand borders. Also allows a filter callback function to conditionally expand per token/filePath                   |
|                    |

> Note: you can also import and use the `expandComposites` function to run the expansion on your token object manually.
> Handy if you have your own parsers set up (e.g. for JS files), and you want the expansions to work there too.

<br/>

## Full example
Create a `.js` file, e.g.: `build-output.js`, with the contents:


```cjs
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

registerTransforms(StyleDictionary);

const sd = StyleDictionary.extend({
  source: ['**/*.tokens.json'],
  platforms: {
    js: {
      transformGroup: 'tokens-studio',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'variables.js',
          format: 'javascript/es6',
        },
      ],
    },
    css: {
      transforms: [
        'ts/descriptionToComment',
        'ts/size/px',
        'ts/opacity',
        'ts/size/lineheight',
        'ts/type/fontWeight',
        'ts/resolveMath',
        'ts/size/css/letterspacing',
        'ts/typography/css/shorthand',
        'ts/border/css/shorthand',
        'ts/shadow/css/shorthand',
        'ts/color/css/hexrgba',
        'ts/color/modifiers',
        'name/cti/kebab',
      ],
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
  },
});

sd.cleanAllPlatforms();
sd.buildAllPlatforms();
```

#### To run it use following command
```sh
node build-output.js
```


> Note: make sure to choose either the full transformGroup, **OR** its separate transforms so you can adjust or add your own.
> [Combining a transformGroup with a transforms array can give unexpected results](https://github.com/amzn/style-dictionary/issues/813).

### Themes full example

You might be using Themes in the PRO version of Tokens Studio.

Here's a full example of how you can use this in conjunction with Style Dictionary and sd-transforms:

Run this script:

```cjs
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');
const { promises } = require('fs');

registerTransforms(StyleDictionary, {
  /* options here if needed */
});

async function run() {
  const $themes = JSON.parse(await promises.readFile('$themes.json'));
  const configs = $themes.map(theme => ({
    source: Object.entries(theme.selectedTokenSets)
      .filter(([, val]) => val !== 'disabled')
      .map(([tokenset]) => `${tokenset}.json`),
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        files: [
          {
            destination: `vars-${theme.name}.css`,
            format: 'css/variables',
          },
        ],
      },
    },
  }));

  configs.forEach(cfg => {
    const sd = StyleDictionary.extend(cfg);
    sd.cleanAllPlatforms(); // optionally, cleanup files first..
    sd.buildAllPlatforms();
  });
}

run();
```

## Not sure how to fix your issue ? 
### Create a reproduction by :-

1. Open configurator tool [link](https://configurator.tokens.studio/) 
2. Upload your tokens and add your style dictionary config and transforms
3. Copy the Url as it will include your settings.
4. Join our slack [link](https://tokens.studio/slack)
5. Open style-dictionary-configurator channel.
6. Create a thread about your issue and paste your reproduction link inside it.
