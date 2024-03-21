# @tokens-studio/sd-transforms

## 0.15.0

### Minor Changes

- 09b1fc0: BREAKING: remove options `addAttributeCTI` & `casing`.
  Since `transformGroup` can now be combined with `transforms`, this is now much easier to accomplish in Style-Dictionary without additional sd-transforms options.

  Before:

  ```js
  registerTransforms(StyleDictionary, { addAttributeCTI: true, casing: 'kebab' });
  ```

  After:

  ```json
  {
    "platforms": {
      "css": {
        "transformGroup": "tokens-studio",
        "transforms": ["attribute/cti", "name/kebab"]
      }
    }
  }
  ```

  > From this version onwards, Style-Dictionary v4.0.0-prerelease.19 minimum is required.

## 0.14.4

### Patch Changes

- 41d83fa: Add "book" to named font weights, converted to 400

## 0.14.3

### Patch Changes

- 9351782: Fix expand utility with latest style-dictionary prerelease.16, values would end up undefined due to bad reference resolve.

## 0.14.2

### Patch Changes

- d2c1ff6: Revert back change that throws fatal error for broken references when expanding tokens or adding fontStyle. To keep compatibility with Style-Dictionary v3.
  [See the issue describing the problem and necessary workaround for v3](https://github.com/tokens-studio/sd-transforms/issues/217).
- d2c1ff6: Fix fontWeights transformer to allow spaces within fontWeights.

## 0.14.1

### Patch Changes

- f5a8b12: Copy metadata from composite type tokens when expanding.

## 0.14.0

### Minor Changes

- 03e3819: Add [W3C Design Token Community Group draft spec](https://design-tokens.github.io/community-group/format/) forward compatibility.

## 0.13.4

### Patch Changes

- 8bde22d: Support references in color modifiers now that style-dictionary transformers can defer themselves.
- 771428a: Fix expanding composition tokens flattening to not occur for certain object values and resulting in [object Object].

## 0.13.3

### Patch Changes

- cfc0c3d: Fix rgba(hex, alpha) regex to allow percentages, add more tests for different types of alpha values.

## 0.13.2

### Patch Changes

- 3f97dc2: Remove trailing console logs from previous update.

## 0.13.1

### Patch Changes

- 7409419: Use expr-eval-fork to work around a prototype pollution vulnerability in the original package.

## 0.13.0

### Minor Changes

- 6c95fe4: BREAKING: remove code that allowed user to not pass StyleDictionary instance to registerTransforms, and grabbed the locally installed StyleDictionary automatically. This seemed like a cool feature at first, but can cause hard to trace bugs if there are multiple installations of style-dictionary (due to incompatible semver).
- 6c95fe4: Will now use preprocessors instead of parsers when user Style-Dictionary is v4.0.0-prerelease.2 or higher. Fixes an issue with multi-file references not being resolvable when running composite token expansion or add font style utilities.

## 0.12.2

### Patch Changes

- 7dad579: Workaround fix in color modifiers transform to allow UIColor format. This workaround should be removed (in a breaking change) if https://github.com/amzn/style-dictionary/issues/1063 gets resolved and post-transitive transforms become a thing.

## 0.12.1

### Patch Changes

- e7ecf43: Fixes transform HEXRGBa format when this format is contained within a value, e.g. linear-gradient() or multi-value.

## 0.12.0

### Minor Changes

- 6f4b5ed: BREAKING: swap expandComposites 2nd argument and 3rd argument. 2nd argument is now TransformOptions and 3rd argument the filePath (string). This used to be vice versa and was inconsistent with the other parser functions.
- 6f4b5ed: Add and expose a parseTokens function to make it more developer friendly to add the sd-transforms parsing step to your own custom parser.
- f7e88b6: BREAKNG: Use structuredClone instead of shallow Object.assign copy in parsers. Must use NodeJS v17 at minimum now, as opposed to v15.14.0 before this update.
- 6f4b5ed: Add the addAttributeCTI option to registerTransforms function, to automatically add `attribute/cti` predefined transform to the `tokens-studio` transformGroup.

### Patch Changes

- 2307b9d: Refined CSS font name processing: Enhanced escapeApostrophes for accurate apostrophe handling in font names. Updated quoteWrapWhitespacedFont for smart quoting and escaping in multi-word fonts. Ensures better CSS font family compatibility.

## 0.11.10

### Patch Changes

- 8c2e03f: Fix types for expandComposites functions, no longer trips up on key value pairs with primitive values during parsing process.

## 0.11.9

### Patch Changes

- a3ad58b: Fix the webpackIgnore statement to use single \*. For NextJS integration (webpack).

## 0.11.8

### Patch Changes

- dd58528: Remove reliance on browser-style-dictionary. This created problems with CJS style-dictionary config files (default export).

## 0.11.7

### Patch Changes

- 72b828d: Fix permutateThemes to order "enabled" sets below "source" sets so enabled sets overrides are prioritized in Style-Dictionary.

## 0.11.6

### Patch Changes

- 2e8576e: resolveMath no longer unnecessarily changes the token type to number if the token value is a string without any expressions to resolve.

## 0.11.5

### Patch Changes

- Fix resolve reference for multi-value shadow tokens when expanding shadow tokens.

## 0.11.4

### Patch Changes

- 77b4f04: Add a webpack ignore statement to dynamic import of node builtin in node env. Should be ignored at compile-time, done at run-time.

## 0.11.3

### Patch Changes

- 333355b: Specify import to "module" as "node:module" for build tools to better understand it as a built-in.

## 0.11.2

### Patch Changes

- 3f37446: Fix for add-font-styles parser to deal with value props not being objects (e.g. null).

## 0.11.1

### Patch Changes

- 597ddcd: Slightly adjust how math evaluation is done on non-numeric string and boolean values, so as to not remove quotes inside strings.
- e486d94: Handle fonts that put only fontStyle inside fontWeight properly e.g. "Italic", which should resolve to weight "Regular" and style "Italic".
- 40e1b27: Add alwaysAddFontStyle to recursive function parameters.

## 0.11.0

### Minor Changes

- 96a66a9: checkAndEvaluateMath to not stringify if not needed:

  - for single math expressions resolving to a floating number without unit, we can keep it as a `Number`
  - for expressions such as `false` or `true` (`Boolean`), keep as `Boolean` type

## 0.10.5

### Patch Changes

- 0032d8d: Hotfix for evaluate math of values that have non-numericals wrapped in spaces.

## 0.10.4

### Patch Changes

- 894efe4: Add option to always add font style when expanding typography objects.
- d76b5cc: Add export for addFontStyles parser.

## 0.10.3

### Patch Changes

- eff2f93: Fix resolve math transform multi-value splitter function to properly split more than 2 values where each value does itself not contain any spaces.

## 0.10.2

### Patch Changes

- 1327559: Add 'ts/color/modifiers' option: `format`, to globally set the output format for color modifiers.
- 29ac771: Add hairline and ultra to fontWeightsMap, reflect to 1 and 1000 respectively.
- c59df89: Add option to easily change the casing of the output token names, without requiring to create a custom transform group.

## 0.10.1

### Patch Changes

- 6a6a5d2: ts/color/css/hexrgba to correctly apply on all color typed tokens, including those containing references.

## 0.10.0

### Minor Changes

- 3425572: BREAKING: permutateThemes to return the same format regardless of whether multi-dimensional themes are used or not. Format: `{ themeName: [sets] }`.
- 2731a5e: BREAKING: change name of ts/type/fontWeight transform to -> ts/typography/fontWeight, for consistency's sake.
- 0363efc: BREAKING: add parser that extracts fontStyle from fontWeight and adds it as a separate property on Typography tokens object values.

### Patch Changes

- 2731a5e: Add value transform `ts/typography/css/fontFamily` to font-families which adds quotes if it has white space. The source
  value will then match with how it's rendered in the composite typography token value. `outputReferences: true` will now replace
  the quoted value with the reference. Previously, the reference was wrapped in quotes.
- acb344c: Properly take into account fontStyle inside fontWeights values, in both the fontWeights and CSS typography shorthand transforms.

## 0.9.10

### Patch Changes

- c4bb776: Allow color modifications to format to hex when the color space is not sRGB. It will do a conversion step to sRGB space before formatting to hex.

## 0.9.9

### Patch Changes

- 4a8a44f: Fix path to the typescript types

## 0.9.8

### Patch Changes

- d8eabab: Fix font-families with spaces in between them for multiple comma separated font fallbacks.

## 0.9.7

### Patch Changes

- a18c91f: Export permutateThemes utility function, allowing you to input your multi-dimensional $themes.json data, and receive the permutations (single dimensional outputs) as a result. [See docs](./README.md#multi-dimensional-theming).

## 0.9.6

### Patch Changes

- 21608ff: Patches the transformHEXRGBa function to allow for whitespaces surrounding the HEX code. The Tokens Studio plugin automatically adds these whitespaces when working with aliases so this patch removes the need for manually having to remove those whitespaces.

## 0.9.5

### Patch Changes

- 0e493a1: Fixes comment transformer for descriptions with line breaks

## 0.9.4

### Patch Changes

- de971fe: Fixed the return types of lineHeight, opacity and fontWeight to be number instead of string

## 0.9.3

### Patch Changes

- bd7fe6e: Handle references and deep references for tokens that can be expanded, like typography, border, shadow and composition.
- b69b05b: set font family name in quotes if its name has whitespaces
- 4a3d5f9: Error handle if SD cannot resolve reference.

## 0.9.2

### Patch Changes

- 01d45fd: Fix hex rgba regex matcher to be lazier about some character matching, warn for errors from colorjs.io hex parsing.

## 0.9.1

### Patch Changes

- ce69ada: Consider that properties can also be empty string, which is especially common if the typography/border/shadow tokens are coming from Tokens Studio.

## 0.9.0

### Minor Changes

- 24a20df: BREAKING: when missing properties inside typography, border or shadow objects, we prefill them with empty string, 0, or some default value.

## 0.8.7

### Patch Changes

- 3f12797: Exclude parent keys can lead to duplicate property keys. Ensure they are deepmerged instead of overwritten.

## 0.8.6

### Patch Changes

- 345e03e: Expose transforms names, so it's easy to create a custom transformGroup and adjust, add or remove transforms in it.

## 0.8.5

### Patch Changes

- d637cec: Use Rollup output.interop for CJS output, to properly handle default exports in our CJS external dependencies.

## 0.8.4

### Patch Changes

- d37eebc: Support values of type number for checkAndEvaluateMath utility.

## 0.8.3

### Patch Changes

- acd3ddb: Evaluate math expressions within complex value types like border, typography, shadow.

## 0.8.2

### Patch Changes

- a25a1ff: Add excludeParentKeys option to the transform options, in order to exclude parent keys from your token files. This is useful if you use a single-file export from Tokens Studio Figma Plugin.

## 0.8.1

### Patch Changes

- 4d3b98b: Fix package exports paths.

## 0.8.0

### Minor Changes

- 3728d90: BREAKING: remove modifier type files, use @tokens-studio/types instead for it.

## 0.7.0

### Minor Changes

- 2f2cd8c: BREAKING: Register parser that expands composition tokens by default, and optionally typography, border and shadow tokens as well.
- e23ec38: BREAKING: Register ts/opacity transform, to transform opacity to number between 0 and 1, which is more multi-platform than percentages%. Breaking because people might not expect to have their opacity tokens suddenly as decimal numbers.

## 0.6.0

### Minor Changes

- cc7d86b: BREAKING: move the following transforms to CSS namespace, since they are CSS-specific transforms:

  - `ts/size/letterspacing` -> `ts/size/css/letterspacing`
  - `ts/color/hexrgba` -> `ts/color/css/hexrgba`
  - `ts/shadow/shorthand` -> `ts/shadow/css/shorthand`

- cc7d86b: New transform: `ts/border/css/shorthand` -> transform border objects to CSS shorthand.
- cc7d86b: BREAKING: turn a few of our transforms from transitive to default transforms, if transitive was not necessary:

  - `ts/descriptionToComment`
  - `ts/size/px`
  - `ts/size/css/letterspacing`
  - `ts/size/lineheight`
  - `ts/type/fontWeight`

### Patch Changes

- f320d4a: Keep shadow shorthands as is instead of attempting to transform them again.

## 0.5.7

### Patch Changes

- 3d73476: Add `inset` to shadow CSS shorthand if the type is innerShadow.

## 0.5.6

### Patch Changes

- a824884: Do not use original value for transforms, use transformed value instead.

## 0.5.5

### Patch Changes

- df20034: Allow letter spacing to be a number value, since 0 is a legitimate value for letter spacing.

## 0.5.4

### Patch Changes

- 2869382: Use expr-eval to evaluate math functions like roundTo().

## 0.5.3

### Patch Changes

- a75c420: Add engines property to pkg.json, NodeJS 15.14.0 and higher supported.

## 0.5.2

### Patch Changes

- a94d137: Transform typography to make use of transform fontweights map for the fontWeight property.
- 81362be: Account for token values being of type number in certain transformers.

## 0.5.1

### Patch Changes

- 48846b3: Fix checkAndEvaluateMath to deal with regular values with spaces in them like linear-gradient(a, b1 b2, c1 c2).
- 4f6da6c: Return original value if mapped fontweight is undefined.

## 0.5.0

### Minor Changes

- 2ad1630: BREAKING: remove attribute/cti transform from tokens-studio transform group, this is redundant. However, users might rely on it, therefore it is a breaking change.

## 0.4.6

### Patch Changes

- 71d12d2: Improve checkAndEvaluateMath for expressions with more than one unit.

## 0.4.5

### Patch Changes

- a2b2a22: Account for undefined as a token value in transformers. This may happen if a token value is a reference, but the reference is broken. A fatal error in the transform makes it more difficult for the user to find out that they have broken references and to debug it, therefore we guard against it in our transformers.

## 0.4.4

### Patch Changes

- e366ac0: Export transformColorModifiers function inside the main entrypoint.
- b9f179a: Allow passing an output format to the color modify props of Tokens Studio.

## 0.4.3

### Patch Changes

- 31c81b4: Fix property name modifier -> modify.

## 0.4.2

### Patch Changes

- 2cff78f: Fix check and evaluate math, don't run it on non-string token values, no longer fails on simple expressions.

## 0.4.1

### Patch Changes

- 5718a7b: Fix small bug in transform typography for compose, passes token value instead of full token.
- 2d4ce90: Change regex for HEXRGBa detection space character from lazy to greedy, to more tightly match the "alpha" number without leading spaces.
- 22f9859: Add color modifiers transform, [see more info](https://github.com/tokens-studio/figma-plugin/issues/1166).
- 2d4ce90: Add multi-value support for evaluating math expressions in token values.

## 0.4.0

### Minor Changes

- d4d2bc2: **BREAKING**: Renames typography transform to clarify it's transformed to CSS-based format.
  Previously `transformTypography`, now `transformTypographyForCSS`.

### Patch Changes

- d4d2bc2: Adds a transformer for typography tokens on Jetpack Compose

## 0.3.3

### Patch Changes

- 0288c1f: Include missing token types (sizing, borderWidth) in ts/size/px transform matcher.

## 0.3.2

### Patch Changes

- 5826117: Add lineheight tranform for aligning Figma and CSS behaviour. Add transform to assign Tokens Studio description to Style Dictionary comment.

## 0.3.1

### Patch Changes

- 631424d: No longer need to commit to using @rollup/plugin-commonjs. We prebundle the dependency that is CJS-only so users don't need to worry about it.

## 0.3.0

### Minor Changes

- 6c35e0e: Add 4 more transforms necessary for dealing with Tokens Studio syntax.

## 0.2.0

### Minor Changes

- cfa044f: Take into account that env might be browser. Only attempt to import module and use createRequire in NodeJS env.

## 0.1.0

### Minor Changes

- 6e3bd89: Initial release of sd-transforms, a library to easily register transforms related to Tokens Studio
