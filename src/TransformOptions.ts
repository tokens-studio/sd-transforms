export type ColorModifierFormat = 'hex' | 'hsl' | 'lch' | 'p3' | 'srgb';

export interface ColorModifierOptions {
  format: ColorModifierFormat;
}

export interface TransformOptions {
  alwaysAddFontStyle?: boolean;
  excludeParentKeys?: boolean;
  ['ts/color/modifiers']?: ColorModifierOptions;
}
