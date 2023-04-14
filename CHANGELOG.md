# @tokens-studio/sd-transforms

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
