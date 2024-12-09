export type ColorModifierFormat = 'hex' | 'hsl' | 'lch' | 'p3' | 'srgb';

export interface ColorModifierOptions {
  format: ColorModifierFormat;
}

export interface TransformOptions {
  platform?: 'css' | 'compose';
  name?: string;
  withSDBuiltins?: boolean;
  alwaysAddFontStyle?: boolean;
  excludeParentKeys?: boolean;
  mathFractionDigits?: number;
  ['ts/color/modifiers']?: ColorModifierOptions;
}
