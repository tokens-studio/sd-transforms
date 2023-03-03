# @tokens-studio/sd-transforms

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
