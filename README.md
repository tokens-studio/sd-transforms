# Style Dictionary Transforms for Tokens Studio

![NPM version badge](https://img.shields.io/npm/v/@tokens-studio/sd-transforms) ![License badge](https://img.shields.io/github/license/tokens-studio/sd-transforms)

## Table of contents

- [Installation](#installation)
- [Getting Started](#usage)
  - [Using the transforms](#using-the-transforms)
  - [Custom Transform Group](#custom-transform-group)
  - [Options](#options)
- [Theming](#theming)
  - [Themes complete example](#themes-complete-example)
  - [Multi-dimensional theming](#multi-dimensional-theming)
- [Transforms](#transforms)
- [Troubleshooting](#not-sure-how-to-fix-your-issue)

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
- Transform fontweight from keynames to fontweight numbers (100, 200, 300 ... 900) -> `ts/typography/fontWeight`
- Transform color modifiers from Tokens Studio to color values -> `ts/color/modifiers`

CSS:

- Transform letterspacing from `%` to `em` -> `ts/size/css/letterspacing`
- Transform colors to `rgba()` format -> `ts/color/css/hexrgba`
- Transform font family into valid CSS, adding single quotes if necessary -> `ts/typography/css/fontFamily`
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

```js
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
registerTransforms(StyleDictionary);

const sd = StyleDictionary.extend({
  source: ['**/*.json'], // <-- make sure to have this match your token files!!!
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
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

> You can also import as ES Modules if needed.

To run it use the following command

```sh
node build-output.js
```

> Note: make sure to choose either the full transformGroup, **OR** its separate transforms so you can adjust or add your own.
> [Combining a transformGroup with a transforms array can give unexpected results](https://github.com/amzn/style-dictionary/issues/813).

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
    },
    "css": {
      "transforms": ["ts/size/px", "ts/opacity"],
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

Therefore, if you wish to use the transform group, but adjust, add or remove a few transforms, your best option is to create a custom transform group:

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

> Note: it is easy to change the casing or to add attributes/cti transform to the group, without needing to create a custom transform group.
> For this, see section "Options" below for the `casing` and `addAttributeCTI` option.

### Options

You can pass options to the `registerTransforms` function.

```js
registerTransforms(StyleDictionary, {
  expand: {
    composition: false,
    typography: true,
    // Note: when using Style-Dictionary v4.0.0-prerelease.2 or higher, filePath no longer gets passed
    // as an argument, because preprocessors work on the full dictionary rather than per file (parsers)
    border: (token, filePath) =>
      token.value.width !== 0 && filePath.startsWith(path.resolve('tokens/core')),
    shadow: false,
  },
  excludeParentKeys: true,
  'ts/color/modifiers': {
    format: 'hex',
  },
});
```

Options:

| name                          | type                     | required | default         | description                                                                                                                           |
| ----------------------------- | ------------------------ | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| excludeParentKeys             | boolean                  | ❌       | `false`         | Whether or not to exclude parent keys from your token files                                                                           |
| addAttributeCTI               | boolean                  | ❌       | `false`         | Whether or not to add `'attribute/cti'` predefined transform to the `tokens-studio` transformGroup                                    |
| alwaysAddFontStyle            | boolean                  | ❌       | `false`         | Whether or not to always add a 'normal' fontStyle property to typography tokens which do not have explicit fontStyle                  |
| casing                        | string                   | ❌       | `camel`         | What kind of casing to use for token names. Options: [`camel`, `pascal`, `snake`, `kebab`, `constant`]                                |
| expand                        | boolean \| ExpandOptions | ❌       | See props below | `false` to not register the parser at all. By default, expands composition tokens. Optionally, border, shadow and typography as well. |
| expand.composition            | boolean \| ExpandFilter  | ❌       | `true`          | Whether or not to expand compositions. Also allows a filter callback function to conditionally expand per token/filePath              |
| expand.typography             | boolean \| ExpandFilter  | ❌       | `false`         | Whether or not to expand typography. Also allows a filter callback function to conditionally expand per token/filePath                |
| expand.shadow                 | boolean \| ExpandFilter  | ❌       | `false`         | Whether or not to expand shadows. Also allows a filter callback function to conditionally expand per token/filePath                   |
| expand.border                 | boolean \| ExpandFilter  | ❌       | `false`         | Whether or not to expand borders. Also allows a filter callback function to conditionally expand per token/filePath                   |
| ['ts/color/modifiers']        | ColorModifierOptions     | ❌       | See props below | Color modifier options                                                                                                                |
| ['ts/color/modifiers'].format | ColorModifierFormat      | ❌       | `undefined`     | Color modifier output format override ('hex' \| 'hsl' \| 'lch' \| 'p3' \| 'srgb'), uses local format or modifier space as default     |
|                               |

> Note: you can also import and use the `parseTokens` function to run the parsing steps on your tokens object manually.
> Handy if you have your own parsers set up (e.g. for JS files), and you want the parser-based features like composites-expansion to work there too.

## Theming

### Themes: complete example

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
  const $themes = JSON.parse(await promises.readFile('$themes.json', 'utf-8'));
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

### Multi-dimensional Theming

If you're using Tokens Studio multi-dimensional theming, you'll have to run some logic to create permutations of those multiple dimensions of themes.
We export a function called `permutateThemes` that allows passing the data from your `$themes.json`, and will give back an object with all the different permutations.

For example, consider the following multi-dimensional theme hierarchy (Group > Theme > TokenSet):

```
mode
  |-- light
  |     `-- core, light, theme
  `-- dark
        `-- core, dark, theme

brand
  |-- casual
  |     `-- core, casual
  `-- business
        `-- core, business
```

Here we have two groups:

1. `mode`: has two themes `light` & `dark`
2. `brand`: has two themes `casual` & `business`

Running `permutateThemes` on these themes will generate 4 theme combinations:

1. `light_casual`
2. `dark_casual`
3. `light_business`
4. `dark_business`

See details below:

```js
const { permutateThemes } = require('@tokens-studio/sd-transforms');
const fs = require('fs');

/**
 * Input:
 * [
 *  {
 *    name: 'light'
 *    group: 'mode',
 *    selectedTokensets: {
 *      'core': 'source',
 *      'light': 'enabled',
 *      'theme': 'enabled'
 *    }
 *  },
 *  {
 *    name: 'dark'
 *    group: 'mode',
 *    selectedTokensets: {
 *      'core': 'source',
 *      'dark': 'enabled',
 *      'theme': 'enabled'
 *    }
 *  },
 *  {
 *    name: 'casual'
 *    group: 'brand',
 *    selectedTokensets: {
 *      'core': 'source',
 *      'casual': 'enabled'
 *    }
 *  },
 *  {
 *    name: 'business'
 *    group: 'brand',
 *    selectedTokensets: {
 *      'core': 'source',
 *      'business': 'enabled'
 *    }
 *  }
 * ]
 *
 * Output:
 * {
 *   light_casual: ['core', 'light', 'theme', 'casual'],
 *   dark_casual: ['core', 'dark', 'theme', 'casual'],
 *   light_business: ['core', 'light', 'theme', 'business'],
 *   dark_business: ['core', 'dark', 'theme', 'business'],
 * }
 */
permutateThemes(JSON.parse(fs.readFileSync('$themes.json', 'utf-8')), { separator: '_' });
```

Note that it is a best practice to generate standalone output files for each theme combination. In the example above, we should generate 4 standalone CSS file `light_casual.css`, `dark_casual.css`, `light_business.css` and `dark_business.css`. We can then switch between them to change themes. Avoid generating all this output in a single file and trying to select different sections of the file. This will increase the file size as the number of theme combinations grows resulting in increased load times.

Full example with multi-dimensional themes:

```js
const { registerTransforms, permutateThemes } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');
const { promises } = require('fs');

registerTransforms(StyleDictionary, {
  /* options here if needed */
});

async function run() {
  const $themes = JSON.parse(await promises.readFile('$themes.json', 'utf-8'));
  const themes = permutateThemes($themes, { separator: '_' });
  const configs = Object.entries(themes).map(([name, tokensets]) => ({
    source: tokensets.map(tokenset => `${tokenset}.json`),
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        files: [
          {
            destination: `vars-${name}.css`,
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

You can find a variation of this example [here](https://github.com/tokens-studio/lion-example). It outputs a CSS file for every theme combination _for every component_, e.g. `button-business-blue.css`, `date-picker-business-blue.css` and so on. This caters to use cases where component-level tokens as required, e.g. when implementing Web Components.

## Transforms

### ts/descriptionToComment

This transform maps token descriptions into comments.

**matches**: All tokens that have a description property.

#### before

```json
{
  "token": {
    ...
    "description": "Some description about the token",
  }
}
```

#### after

```json
{
  "token": {
    ...
    "description": "Some description about the token",
    "comment": "Some description about the token",
  }
}
```

### ts/resolveMath

This transform checks and evaluates math expressions

**matches**: All tokens that have string values.

#### before

```json
{
  "token-one": {
    ...
    "value": "4*1.5px 4*1.5px 4*1.5px"
  },
  "token-two": {
    ...
    "value": "4 * 7"
  }
}
```

#### after

```json
{
  "token-one": {
    ...
    "value": "6px 6px 6px"
  },
  "token-two": {
    ...
    "value": "28"
  }
}
```

### ts/size/px

This transform adds `px` as a unit when dimension-like tokens do not have a unit.

**matches**: `token.type` is one of `['sizing', 'spacing', 'borderRadius', 'borderWidth', 'fontSizes', 'dimension']`

#### before

```json
{
  "token": {
    "type": "dimension",
    "value": 4
  }
}
```

#### after

```json
{
  "token": {
    "type": "dimension",
    "value": "4px"
  }
}
```

### ts/opacity

This transforms opacity token values declared with `%` into a number between `0` and `1`.

**matches**: `token.type` is `'opacity'`

#### before

```json
{
  "token": {
    "type": "opacity",
    "value": "50%"
  }
}
```

#### after

```json
{
  "token": {
    "type": "opacity",
    "value": 0.5
  }
}
```

### ts/size/lineheight

This transforms line-height token values declared with `%` into a unitless value.

**matches**: `token.type` is `'lineHeights'`

#### before

```json
{
  "token": {
    "type": "lineHeights",
    "value": "50%"
  }
}
```

#### after

```json
{
  "token": {
    "type": "lineHeights",
    "value": 0.5
  }
}
```

### ts/typography/fontWeight

This transforms fontweight from keynames to fontweight numbers.

**matches**: `token.type` is `'fontWeights'`

#### before

```json
{
  "token-one": {
    "type": "fontWeights",
    "value": "Bold"
  },
  "token-two": {
    "type": "fontWeights",
    "value": "Light"
  }
}
```

#### after

```json
{
  "token-one": {
    "type": "fontWeights",
    "value": "700"
  },
  "token-two": {
    "type": "fontWeights",
    "value": "300"
  }
}
```

### ts/color/modifiers

This transforms color modifiers from Tokens Studio to color values.

**matches**: `token.type` is `'color'` and has `token.$extensions['studio.tokens'].modify`

#### before

```json
{
  "token-one": {
    "value": "#C14242",
    "type": "color",
    "$extensions": {
      "studio.tokens": {
        "modify": {
          "type": "lighten",
          "value": "0.2",
          "space": "srgb"
        }
      }
    }
  },
  "token-two": {
    "value": "#C14242",
    "type": "color",
    "$extensions": {
      "studio.tokens": {
        "modify": {
          "type": "darken",
          "value": "0.2",
          "space": "hsl"
        }
      }
    }
  }
}
```

#### after

```json
{
  "token-one": {
    "value": "rgb(80.5% 40.7% 40.7%)",
    "type": "color"
  },
  "token-two": {
    "value": "hsl(0 50.6% 40.6%)",
    "type": "color"
  }
}
```

### ts/size/css/letterspacing

This transforms letter-spacing token values declared with `%` to a value with `em`.

**matches**: `token.type` is `'letterSpacing'`

#### before

```json
{
  "token": {
    "type": "letterSpacing",
    "value": "50%"
  }
}
```

#### after

```json
{
  "token": {
    "type": "letterSpacing",
    "value": "0.5em"
  }
}
```

### ts/color/css/hexrgba

This transforms color token values with Figma's "hex code RGBA" into actual `rgba()` format

**matches**: `token.type` is `'color'`

#### before

```json
{
  "token": {
    "type": "color",
    "value": "rgba(#ABC123, 0.5)"
  }
}
```

#### after

```json
{
  "token": {
    "type": "color",
    "value": "rgba(171, 193, 35, 0.5)"
  }
}
```

### ts/typography/css/fontFamily

This transforms font-family token values into valid CSS, adding single quotes if necessary.

**matches**: `token.type` is `'fontFamilies'`

#### before

```json
{
  "token": {
    "type": "fontFamilies",
    "value": "Arial Black, Times New Roman, Foo, sans-serif"
  }
}
```

#### after

```json
{
  "token": {
    "type": "fontFamilies",
    "value": "'Arial Black', 'Times New Roman', Foo, sans-serif"
  }
}
```

### ts/typography/css/shorthand

This transforms typography tokens into a valid CSS shorthand

**matches**: `token.type` is `'typography'`

#### before

```json
{
  "token": {
    "type": "typography",
    "value": {
      "fontWeight": "500",
      "fontSize": "20px",
      "lineHeight": "1.5",
      "fontFamily": "Arial"
    }
  }
}
```

#### after

```json
{
  "token": {
    "value": "500 20px/1.5 Arial"
  }
}
```

### ts/shadow/css/shorthand

This transforms shadow tokens into a valid CSS shadow shorthand

**matches**: `token.type` is `'boxShadow'`

#### before

```json
{
  "token": {
    "type": "boxShadow",
    "value": {
      "x": "5px",
      "y": "3px",
      "blur": "6px",
      "spread": "2px",
      "color": "#000000"
    }
  }
}
```

#### after

```json
{
  "token": {
    "value": "5px 3px 6px 2px #000000"
  }
}
```

### ts/border/css/shorthand

This transforms border tokens into a valid CSS border shorthand

**matches**: `token.type` is `'border'`

#### before

```json
{
  "token": {
    "type": "border",
    "value": {
      "width": "5",
      "style": "dashed",
      "color": "rgba(#000000, 1)"
    }
  }
}
```

#### after

```json
{
  "token": {
    "value": "5px dashed rgba(0, 0, 0, 1)"
  }
}
```

## Not sure how to fix your issue?

### Create a reproduction by:-

1. Open the configurator tool [link](https://configurator.tokens.studio/)
2. Upload your tokens and add your style dictionary config and transforms
3. Copy the URL as it will include your settings
4. Join our Slack [link](https://tokens.studio/slack)
5. Open style-dictionary-configurator channel
6. Create a thread about your issue and paste your reproduction link inside it
