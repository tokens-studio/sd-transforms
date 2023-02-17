# @tokens-studio/sd-transforms

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
