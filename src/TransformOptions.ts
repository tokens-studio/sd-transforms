export type ColorModifierFormat = 'hex' | 'hsl' | 'lch' | 'p3' | 'srgb';

export interface ColorModifierOptions {
  format: ColorModifierFormat;
  mathFractionDigits?: number;
  precision?: number;
}

export interface TransformOptions {
  platform?: 'css' | 'compose';
  name?: string;
  withSDBuiltins?: boolean;
  alwaysAddFontStyle?: boolean;
  excludeParentKeys?: boolean;
  ['ts/color/modifiers']?: ColorModifierOptions;
}
