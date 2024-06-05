import {
  SingleBorderToken,
  SingleBoxShadowToken,
  SingleCompositionToken,
  SingleToken,
  SingleTypographyToken,
} from '@tokens-studio/types';

export type Expandables =
  | SingleCompositionToken
  | SingleTypographyToken
  | SingleBorderToken
  | SingleBoxShadowToken;

export const expandablesAsStringsArr = ['composition', 'typography', 'border', 'boxShadow'];
export type ExpandablesAsStrings = (typeof expandablesAsStringsArr)[number];

export type ExpandFilter<T extends SingleToken> = (token: T, filePath?: string) => boolean;

export interface ExpandOptions {
  typography?: boolean | ExpandFilter<SingleTypographyToken>; // default false
  border?: boolean | ExpandFilter<SingleBorderToken>; // default false
  shadow?: boolean | ExpandFilter<SingleBoxShadowToken>; // default false
  composition?: boolean | ExpandFilter<SingleCompositionToken>; // default true
}

export type ColorModifierFormat = 'hex' | 'hsl' | 'lch' | 'p3' | 'srgb';

export interface ColorModifierOptions {
  format: ColorModifierFormat;
}

export interface SizeModifierOptions {
  baseFontSize: number;
}

export interface TransformOptions {
  alwaysAddFontStyle?: boolean;
  excludeParentKeys?: boolean;
  ['ts/color/modifiers']?: ColorModifierOptions;
  ['ts/size/rem']?: SizeModifierOptions;
}
