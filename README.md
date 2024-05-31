# Style Dictionary Transforms for Tokens Studio

![NPM version badge](https://img.shields.io/npm/v/@tokens-studio/sd-transforms) ![License badge](https://img.shields.io/github/license/tokens-studio/sd-transforms)

> Note: this README contains examples that assume latest version of this package & v4 style-dictionary latest prerelease.

## Table of contents

- [Installation](#installation)
- [Compatibility](#compatibility)
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

Registers the **generic** and **CSS** transforms as a transform group called `tokens-studio`.

## Installation

With [NPM](https://www.npmjs.com/):

```sh
npm install @tokens-studio/sd-transforms
```

## Compatibility

This package is to be used in combination with [Style Dictionary](https://github.com/amzn/style-dictionary).

There are some caveats however, with regards to which versions of Style Dictionary are compatible with which versions of this package:

| Style Dictionary                                          | sd-transforms           |
| --------------------------------------------------------- | ----------------------- |
| **3.0.0** - **4.0.0**-prerelease.**1**                    | <= **0.12.2**           |
| **4.0.0**-prerelease.**2** - **4.0.0**-prerelease.**18**  | **0.13.0** - **0.14.4** |
| **4.0.0**-prerelease.**18** - **4.0.0**-prerelease.**26** | **0.13.0** - **0.15.2** |
| >= **4.0.0**-prerelease.**27**                            | >= **0.16.0**           |

This may seem a little tedious, but the reason is because `sd-transforms` is still in alpha, and Style Dictionary v4 is still being worked on, iteratively doing lots of breaking changes.

This will be much simpler when Style Dictionary v4 is released, at that point `sd-transforms` v1 will be released and be out of alpha.
Both APIs will be stable then.

## Usage

> Note: this library is available both in CJS and ESM

```js
import { registerTransforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
registerTransforms(StyleDictionary);

const sd = new StyleDictionary({
  // make sure to have source match your token files!
  // be careful about accidentally matching your package.json or similar files that are not tokens
  source: ['tokens/**/*.json'],
  preprocessors: ['tokens-studio'], // <-- since 0.16.0 this must be explicit
  platforms: {
    css: {
      transformGroup: 'tokens-studio', // <-- apply the tokens-studio transformGroup to apply all transforms
      transforms: ['name/kebab'], // <-- add a token name transform for generating token names, default is camel
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

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
```

> You can also import as ES Modules if needed.

To run it use the following command

```sh
node build-output.js
```

> From Style-Dictionary `4.0.0-prerelease.18`, [`transformGroup` and `transforms` can now be combined in a platform inside your config](https://github.com/amzn/style-dictionary/blob/v4/CHANGELOG.md#400-prerelease18).

### Using the preprocessor

If you want to use `excludeParentKeys` or allow this package to extract the `fontStyle` from the `fontWeight` e.g. `regular italic`,
you must add the `'tokens-studio'` preprocessor explicitly in the configuration:

```json
{
  "source": ["tokens/**/*.json"],
  "preprocessors": ["tokens-studio"],
  "platforms": {}
}
```

### Using the transforms

```json
{
  "source": ["tokens/**/*.json"],
  "preprocessors": ["tokens-studio"],
  "platforms": {
    "css": {
      "transformGroup": "tokens-studio",
      "transforms": ["name/kebab"],
      "buildPath": "build/css/",
      "files": [
        {
          "destination": "variables.css",
          "format": "css/variables"
        }
      ]
    },
    "css": {
      "transforms": ["ts/size/px", "ts/opacity", "name/kebab"],
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
for you to create your own Style-Dictionary transform out of.

```js
import { transformDimension } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'my/size/px',
  type: 'value',
  transitive: true,
  filter: token => ['fontSizes', 'dimension', 'borderRadius', 'spacing'].includes(token.type),
  transform: token => transformDimension(token.value),
});
```

### Custom Transform Group

> From Style-Dictionary `4.0.0-prerelease.18`, [`transformGroup` and `transforms` can now be combined in a platform inside your config](https://github.com/amzn/style-dictionary/blob/v4/CHANGELOG.md#400-prerelease18).

You can create a custom `transformGroup` that includes the individual transforms from this package.
If you wish to use the `transformGroup`, but adjust or remove a few transforms, your best option is to create a custom transform group:

```js
import { transforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';

// Register custom tokens-studio transform group
// without 'px' being added to numbers without a unit
// and also adding 'name/constant' for the token names
StyleDictionary.registerTransformGroup({
  name: 'custom/tokens-studio',
  transforms: [...transforms, 'name/constant'].filter(transform => transform !== 'ts/size/px'),
});
```

### Options

You can pass options to the `registerTransforms` function.

```js
registerTransforms(StyleDictionary, {
  excludeParentKeys: true,
  'ts/color/modifiers': {
    format: 'hex',
  },
});
```

Options:

| name                          | type                 | required | default         | description                                                                                                                       |
| ----------------------------- | -------------------- | -------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| excludeParentKeys             | boolean              | ❌       | `false`         | Whether or not to exclude parent keys from your token files                                                                       |
| alwaysAddFontStyle            | boolean              | ❌       | `false`         | Whether or not to always add a 'normal' fontStyle property to typography tokens which do not have explicit fontStyle              |
| ['ts/color/modifiers']        | ColorModifierOptions | ❌       | See props below | Color modifier options                                                                                                            |
| ['ts/color/modifiers'].format | ColorModifierFormat  | ❌       | `undefined`     | Color modifier output format override ('hex' \| 'hsl' \| 'lch' \| 'p3' \| 'srgb'), uses local format or modifier space as default |

> Note: you can also import and use the `parseTokens` function to run the parsing steps on your tokens object manually.
> Handy if you have your own parsers set up (e.g. for JS files), and you want the parser-based features like composites-expansion to work there too.

## Theming

### Themes: complete example

You might be using Themes in the PRO version of Tokens Studio.

Here's a full example of how you can use this in conjunction with Style Dictionary and sd-transforms:

Run this script:

```cjs
import { registerTransforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import { promises } from 'fs';

registerTransforms(StyleDictionary, {
  /* options here if needed */
});

async function run() {
  const $themes = JSON.parse(await promises.readFile('$themes.json', 'utf-8'));
  const configs = $themes.map(theme => ({
    source: Object.entries(theme.selectedTokenSets)
      .filter(([, val]) => val !== 'disabled')
      .map(([tokenset]) => `${tokenset}.json`),
    preprocessors: ['tokens-studio'], // <-- since 0.16.0 this must be explicit
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['name/kebab'],
        files: [
          {
            destination: `vars-${theme.name}.css`,
            format: 'css/variables',
          },
        ],
      },
    },
  }));

  async function cleanAndBuild(cfg) {
    const sd = new StyleDictionary(cfg);
    await sd.cleanAllPlatforms(); // optionally, cleanup files first..
    await sd.buildAllPlatforms();
  }
  await Promise.all(configs.map(cleanAndBuild));
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
import { permutateThemes } from '@tokens-studio/sd-transforms';
import fs from 'fs';

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
import { registerTransforms, permutateThemes } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import { promises } from 'fs';

registerTransforms(StyleDictionary, {
  /* options here if needed */
});

async function run() {
  const $themes = JSON.parse(await promises.readFile('$themes.json', 'utf-8'));
  const themes = permutateThemes($themes, { separator: '_' });
  const configs = Object.entries(themes).map(([name, tokensets]) => ({
    source: tokensets.map(tokenset => `${tokenset}.json`),
    preprocessors: ['tokens-studio'], // <-- since 0.16.0 this must be explicit
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['name/kebab'],
        files: [
          {
            destination: `vars-${name}.css`,
            format: 'css/variables',
          },
        ],
      },
    },
  }));

  async function cleanAndBuild(cfg) {
    const sd = new StyleDictionary(cfg);
    await sd.cleanAllPlatforms(); // optionally, cleanup files first..
    await sd.buildAllPlatforms();
  }
  await Promise.all(configs.map(cleanAndBuild));
}

run();
```

You can find a variation of this example [here](https://github.com/tokens-studio/lion-example). It outputs a CSS file for every theme combination _for every component_, e.g. `button-business-blue.css`, `date-picker-business-blue.css` and so on. This caters to use cases where component-level tokens as required, e.g. when implementing Web Components.

## Transforms

### ts/descriptionToComment

This transform maps token descriptions into comments.

Also converts carriage return `\r` into `\n` and `\r\n` into just `\n`.

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
