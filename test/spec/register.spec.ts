import { expect } from 'chai';
import StyleDictionary from 'style-dictionary';
import { cleanup } from '../integration/utils.js';
import { getTransforms, register } from '../../src/register.js';

const agnosticTransforms = [
  'ts/descriptionToComment',
  'ts/resolveMath',
  'ts/size/px',
  'ts/opacity',
  'ts/size/lineheight',
  'ts/typography/fontWeight',
  'ts/color/modifiers',
];
const cssTransforms = [
  'ts/color/css/hexrgba',
  'ts/size/css/letterspacing',
  'ts/shadow/innerShadow',
];

const builtinTransformsCSS = StyleDictionary.hooks.transformGroups.css;

const tokens = {
  dimension: {
    scale: {
      value: '2',
      type: 'math',
    },
    xs: {
      value: '4px',
      type: 'dimension',
    },
    sm: {
      value: '{dimension.xs} * {dimension.scale}',
      type: 'dimension',
    },
    md: {
      value: '{dimension.sm} * {dimension.scale}',
      type: 'dimension',
    },
    lg: {
      value: '{dimension.md} * {dimension.scale}',
      type: 'dimension',
    },
    xl: {
      value: '{dimension.lg} * {dimension.scale}',
      type: 'dimension',
    },
  },
  opacity: {
    value: '25%',
    type: 'opacity',
  },
  spacing: {
    sm: {
      value: '{dimension.sm}',
      type: 'spacing',
    },
    xl: {
      value: '{dimension.xl}',
      type: 'spacing',
    },
    'multi-value': {
      value: '{dimension.sm} {dimension.xl}',
      type: 'spacing',
      description:
        'You can have multiple values in a single spacing token. Read more on these: https://docs.tokens.studio/available-tokens/spacing-tokens#multi-value-spacing-tokens',
    },
  },
  colors: {
    black: {
      value: '#000000',
      type: 'color',
    },
    white: {
      value: '#ffffff',
      type: 'color',
    },
    blue: {
      value: '#0000FF',
      type: 'color',
    },
    'blue-alpha': {
      value: 'rgba({colors.blue}, 50%)',
      type: 'color',
    },
    red: {
      '400': {
        value: '{colors.red.500}',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'lighten',
              value: '0.1',
              space: 'srgb',
            },
          },
        },
      },
      '500': {
        value: '#f56565',
        type: 'color',
      },
      '600': {
        value: '{colors.red.500}',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'darken',
              value: '0.1',
              space: 'srgb',
            },
          },
        },
      },
    },
    gradient: {
      value: 'linear-gradient(180deg, {colors.black} 0%, rgba({colors.black}, 0.00) 45%)',
      type: 'color',
    },
  },
  lineHeights: {
    heading: {
      value: '110%',
      type: 'lineHeights',
    },
    body: {
      value: 1.4,
      type: 'lineHeights',
    },
  },
  letterSpacing: {
    default: {
      value: 0,
      type: 'letterSpacing',
    },
    increased: {
      value: '150%',
      type: 'letterSpacing',
    },
    decreased: {
      value: '-5%',
      type: 'letterSpacing',
    },
  },
  fontWeights: {
    headingRegular: {
      value: '600',
      type: 'fontWeights',
    },
    headingBold: {
      value: 700,
      type: 'fontWeights',
    },
    bodyRegular: {
      value: 'Regular',
      type: 'fontWeights',
    },
  },
  fontSizes: {
    h6: {
      value: '{fontSizes.body} * 1',
      type: 'fontSizes',
    },
    body: {
      value: '16',
      type: 'fontSizes',
    },
  },
  'heading-6': {
    value: {
      fontSize: '{fontSizes.h6}',
      fontWeight: '700',
      fontFamily: "Arial Black, Suisse Int'l, sans-serif",
      lineHeight: '1',
    },
    type: 'typography',
  },
  blur: {
    value: '10',
    type: 'sizing',
  },
  shadow: {
    value: [
      {
        x: '0',
        y: '4',
        blur: '{blur}',
        spread: '0',
        color: 'rgba(0,0,0,0.4)',
        type: 'innerShadow',
      },
    ],
    type: 'boxShadow',
  },
  'border-width': {
    value: '5',
    type: 'sizing',
  },
  border: {
    value: {
      style: 'solid',
      width: '{border-width}',
      color: '#000000',
    },
    type: 'border',
  },
  color: {
    value: '#FF00FF',
    type: 'color',
  },
  usesColor: {
    value: 'rgba( {color}, 1)',
    type: 'color',
  },
};

let dict: StyleDictionary | undefined;

describe('register', () => {
  beforeEach(async () => {
    if (dict) {
      cleanup(dict);
    }
  });

  afterEach(async () => {
    if (dict) {
      await cleanup(dict);
    }
  });

  it('allows grabbing the transforms', () => {
    expect(getTransforms()).to.eql([...agnosticTransforms, ...cssTransforms]);
    expect(getTransforms({ platform: 'css' })).to.eql([...agnosticTransforms, ...cssTransforms]);
    expect(getTransforms({ platform: 'compose' })).to.eql([
      ...agnosticTransforms,
      'ts/typography/compose/shorthand',
    ]);
    // @ts-expect-error invalid platform option, we check it anyway
    expect(getTransforms({ platform: 'invalid' })).to.eql(agnosticTransforms);
  });

  it('allows registering', () => {
    register(StyleDictionary);
    expect(StyleDictionary.hooks.transformGroups['tokens-studio']).to.eql([
      ...agnosticTransforms,
      ...cssTransforms,
      ...builtinTransformsCSS,
      'name/camel',
    ]);
  });

  it('allows registering without builtins', () => {
    register(StyleDictionary, { withSDBuiltins: false });
    expect(StyleDictionary.hooks.transformGroups['tokens-studio']).to.eql([
      ...agnosticTransforms,
      ...cssTransforms,
      'name/camel',
    ]);
  });

  it('allows registering for compose', () => {
    register(StyleDictionary, { platform: 'compose', withSDBuiltins: false });
    expect(StyleDictionary.hooks.transformGroups['tokens-studio']).to.eql([
      ...agnosticTransforms,
      'ts/typography/compose/shorthand',
      'name/camel',
    ]);
  });

  it('allows registering with a different name', () => {
    register(StyleDictionary, {
      name: 'tokens-studio-css',
    });
    expect(StyleDictionary.hooks.transformGroups['tokens-studio-css']).to.eql([
      ...agnosticTransforms,
      ...cssTransforms,
      ...builtinTransformsCSS,
      'name/camel',
    ]);
  });

  it('passes smoke/integration test for css', async () => {
    const cfg = {
      tokens,
      preprocessors: ['tokens-studio'],
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          files: [
            {
              format: 'css/variables',
            },
          ],
        },
      },
    };
    register(StyleDictionary);

    const sd = new StyleDictionary(cfg);

    const output = (await sd.formatPlatform('css'))[0].output;
    expect(output).to.equal(`/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --dimensionScale: 2;
  --dimensionXs: 4px;
  --dimensionSm: 8px;
  --dimensionMd: 16px;
  --dimensionLg: 32px;
  --dimensionXl: 64px;
  --opacity: 0.25;
  --spacingSm: 8px;
  --spacingXl: 64px;
  --spacingMultiValue: 8px 64px; /** You can have multiple values in a single spacing token. Read more on these: https://docs.tokens.studio/available-tokens/spacing-tokens#multi-value-spacing-tokens */
  --colorsBlack: #000000;
  --colorsWhite: #ffffff;
  --colorsBlue: #0000ff;
  --colorsBlueAlpha: rgba(0, 0, 255, 50%);
  --colorsRed400: rgb(96.471% 45.647% 45.647%);
  --colorsRed500: #f56565;
  --colorsRed600: rgb(86.471% 35.647% 35.647%);
  --colorsGradient: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.00) 45%);
  --lineHeightsHeading: 1.1;
  --lineHeightsBody: 1.4;
  --letterSpacingDefault: 0;
  --letterSpacingIncreased: 1.5em;
  --letterSpacingDecreased: -0.05em;
  --fontWeightsHeadingRegular: 600;
  --fontWeightsHeadingBold: 700;
  --fontWeightsBodyRegular: 400;
  --fontSizesH6: 16px;
  --fontSizesBody: 16px;
  --heading6: 700 16px/1 'Arial Black', 'Suisse Int\\'l', sans-serif;
  --blur: 10px;
  --shadow: inset 0 4px 10px 0 rgba(0,0,0,0.4);
  --borderWidth: 5px;
  --border: 5px solid #000000;
  --color: #ff00ff;
  --usesColor: rgba(255, 0, 255, 1);
}
`);
  });

  it('passes smoke/integration test for compose', async () => {
    const cfg = {
      tokens,
      preprocessors: ['tokens-studio'],
      expand: {
        include: ['border', 'shadow'],
      },
      platforms: {
        compose: {
          transformGroup: 'tokens-studio',
          files: [
            {
              format: 'compose/object',
              options: {
                packageName: 'foo',
                className: 'bar',
              },
            },
          ],
        },
      },
    };
    register(StyleDictionary, { platform: 'compose', withSDBuiltins: false });

    const sd = new StyleDictionary(cfg);

    const output = (await sd.formatPlatform('compose'))[0].output;
    expect(output).to.equal(`

// Do not edit directly, this file was auto-generated.



package foo

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.*

object bar {
  val blur = 10px
  val borderColor = #000000
  val borderStyle = solid
  val borderWidth = 5px
  val borderWidth = 5px
  val color = #FF00FF
  val colorsBlack = #000000
  val colorsBlue = #0000FF
  val colorsBlueAlpha = rgba(#0000FF, 50%)
  val colorsGradient = linear-gradient(180deg, #000000 0%, rgba(#000000, 0.00) 45%)
  val colorsRed400 = rgb(96.471% 45.647% 45.647%)
  val colorsRed500 = #f56565
  val colorsRed600 = rgb(86.471% 35.647% 35.647%)
  val colorsWhite = #ffffff
  val dimensionLg = 32px
  val dimensionMd = 16px
  val dimensionScale = 2
  val dimensionSm = 8px
  val dimensionXl = 64px
  val dimensionXs = 4px
  val fontSizesBody = 16px
  val fontSizesH6 = 16px
  val fontWeightsBodyRegular = 400
  val fontWeightsHeadingBold = 700
  val fontWeightsHeadingRegular = 600
  val heading6 = TextStyle(
16px
700
Arial Black, Suisse Int'l, sans-serif
1
)
  val letterSpacingDecreased = -5%
  val letterSpacingDefault = 0
  val letterSpacingIncreased = 150%
  val lineHeightsBody = 1.4
  val lineHeightsHeading = 1.1
  val opacity = 0.25
  val shadowBlur = 10px
  val shadowColor = rgba(0,0,0,0.4)
  val shadowOffsetX = 0
  val shadowOffsetY = 4px
  val shadowSpread = 0
  val shadowType = innerShadow
  /** You can have multiple values in a single spacing token. Read more on these: https://docs.tokens.studio/available-tokens/spacing-tokens#multi-value-spacing-tokens */
  val spacingMultiValue = 8px 64px
  val spacingSm = 8px
  val spacingXl = 64px
  val usesColor = rgba( #FF00FF, 1)
}
`);
  });
});
