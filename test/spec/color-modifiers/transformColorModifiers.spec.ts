import { expect } from 'chai';
import { ColorSpaceTypes } from '@tokens-studio/types';
import { transformColorModifiers } from '../../../src/color-modifiers/transformColorModifiers.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

const precision = 3;

runTransformSuite(transformColorModifiers as (value: unknown) => unknown, {
  value: '#C14242',
  type: 'color',
  $extensions: {
    'studio.tokens': {
      modify: {
        type: 'lighten',
        value: '0.2',
        space: ColorSpaceTypes.HSL,
        precision,
      },
    },
  },
});

describe('transform color modifiers', () => {
  describe('lighten', () => {
    it('supports lighten color modifiers in all 4 spaces', () => {
      const token = (space: ColorSpaceTypes | '') => ({
        value: '#C14242',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'lighten',
              value: '0.2',
              space,
              precision,
            },
          },
        },
      });

      // lighten faint red to more light red
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(0 50.6% 60.6%)');
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal('lch(57.7 47.5 29.7)');
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.76 0.435 0.422)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(80.5% 40.7% 40.7%)',
      );
      // without space, return original
      expect(transformColorModifiers(token(''))).to.equal('#C14242');
    });

    it('supports lighten color modifiers in all 4 spaces with high precision', () => {
      const token = (space: ColorSpaceTypes | '') => ({
        value: '#C14242',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'lighten',
              value: '0.2',
              space,
              precision: 10,
            },
          },
        },
      });

      // lighten faint red to more light red
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal(
        'hsl(0 50.59760956% 60.62745098%)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal(
        'lch(57.6852867 47.48011358 29.7038448)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.7601592155 0.4353163367 0.4221255883)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(80.54901961% 40.70588235% 40.70588235%)',
      );
      // without space, return original
      expect(transformColorModifiers(token(''))).to.equal('#C14242');
    });
  });

  describe('darken', () => {
    it('supports darken color modifiers in all 4 spaces', () => {
      const token = (space: ColorSpaceTypes | '') => ({
        value: '#C14242',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'darken',
              value: '0.2',
              space,
            },
          },
        },
      });

      // darken faint red to more darkened red
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(0 50.6% 40.6%)');
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal('lch(37.7 47.5 29.7)');
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.56 0.235 0.222)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(60.5% 20.7% 20.7%)',
      );
      // without space, return original
      expect(transformColorModifiers(token(''))).to.equal('#C14242');
    });

    it('supports darken color modifiers in all 4 spaces with high precision', () => {
      const token = (space: ColorSpaceTypes | '') => ({
        value: '#C14242',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'darken',
              value: '0.2',
              space,
              precision: 10,
            },
          },
        },
      });

      // darken faint red to more darkened red
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal(
        'hsl(0 50.59760956% 40.62745098%)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal(
        'lch(37.6852867 47.48011358 29.7038448)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.5601592155 0.2353163367 0.2221255883)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(60.54901961% 20.70588235% 20.70588235%)',
      );
      // without space, return original
      expect(transformColorModifiers(token(''))).to.equal('#C14242');
    });
  });

  describe('mix', () => {
    it('supports mix color modifiers in all 4 spaces', () => {
      const token = (space: ColorSpaceTypes | '') => ({
        value: '#000000',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5',
              color: '#FFFFFF',
              space,
            },
          },
        },
      });

      // mix black with white, should give a grey
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(none 0% 50%)');
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal('lch(50 0 none)');
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.5 0.5 0.5)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal('rgb(50% 50% 50%)');
      // without space, return original
      expect(transformColorModifiers(token(''))).to.equal('#000000');
    });

    it('supports mix color modifiers in all 4 spaces with high precision', () => {
      const token = (space: ColorSpaceTypes | '') => ({
        value: '#000000',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5',
              color: '#FFFFFF',
              space,
              precision: 10,
            },
          },
        },
      });

      // mix black with white, should give a grey
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(none 0% 50%)');
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal('lch(50 0 none)');
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.5 0.5 0.5)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal('rgb(50% 50% 50%)');
      // without space, return original
      expect(transformColorModifiers(token(''))).to.equal('#000000');
    });

    it('supports mix modifier value calculations', () => {
      const token = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5 + 6 * 0.04',
              color: '#4477DD',
              space,
              format,
            },
          },
        },
      });

      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(220 51.2% 67.9%)');
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal('lch(63.4 43.7 279)');
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.492 0.602 0.881)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(45.7% 60.5% 90.1%)',
      );
      expect(transformColorModifiers(token(''))).to.equal('#FFFFFF');
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB, 'hex'))).to.equal('#759ae6');
    });

    it('supports mix modifier value calculations with more color precision', () => {
      const token = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
              mathFractionDigits: 10,
            },
          },
        },
      });

      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(220 52.6% 67.1%)');
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal('lch(62.4 44.8 279)');
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.479 0.591 0.878)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(44.3% 59.5% 89.9%)',
      );
      expect(transformColorModifiers(token(''))).to.equal('#FFFFFF');
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB, 'hex'))).to.equal('#7198e5');
    });
  });

  describe('transparentize', () => {
    it('supports transparentize color modifiers in all 4 spaces', () => {
      const token = (space: ColorSpaceTypes | '') => ({
        value: '#C14242',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'alpha',
              value: '0.2',
              space,
            },
          },
        },
      });

      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal(
        'hsl(0 50.6% 50.8% / 0.2)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal(
        'lch(47.1 59.4 29.7 / 0.2)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.7 0.294 0.278 / 0.2)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(75.7% 25.9% 25.9% / 0.2)',
      );
    });

    it('supports transparentize color modifiers in all 4 spaces with high precision', () => {
      const token = (space: ColorSpaceTypes | '') => ({
        value: '#C14242',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'alpha',
              value: '0.2',
              space,
              precision: 10,
            },
          },
        },
      });

      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal(
        'hsl(0 50.59760956% 50.78431373% / 0.2)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal(
        'lch(47.10660837 59.35014198 29.7038448 / 0.2)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.7001990194 0.2941454208 0.2776569854 / 0.2)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(75.68627451% 25.88235294% 25.88235294% / 0.2)',
      );
    });
  });

  describe('overriding of math fraction digits options', () => {
    it('no modify math fraction digits apply default math fraction digits', () => {
      const token = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
            },
          },
        },
      });

      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(44.3% 59.5% 89.9%)',
      );
      expect(
        transformColorModifiers(token(ColorSpaceTypes.SRGB), {
          format: 'srgb',
          mathFractionDigits: 4,
        }),
      ).to.equal('rgb(44.3% 59.5% 89.9%)');
    });

    it('transform options color modify math fraction digits override default math fraction digits', () => {
      const token = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
              precision: 5,
            },
          },
        },
      });

      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(44.289% 59.483% 89.871%)',
      );
      expect(
        transformColorModifiers(token(ColorSpaceTypes.SRGB), {
          format: 'srgb',
          mathFractionDigits: 10,
        }),
      ).to.equal('rgb(44.287% 59.482% 89.87%)');
    });

    it('token modify math fraction digits override default math fraction digits', () => {
      const tokenLessPrecise = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
              precision: 5,
            },
          },
        },
      });

      const tokenMorePrecise = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
              precision: 5,
              mathFractionDigits: 10,
            },
          },
        },
      });

      expect(transformColorModifiers(tokenLessPrecise(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(44.289% 59.483% 89.871%)',
      );
      expect(transformColorModifiers(tokenMorePrecise(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(44.287% 59.482% 89.87%)',
      );
    });

    it('token modify math fraction digits override transform options color modify math fraction digits', () => {
      const tokenLessPrecise = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
              precision: 5,
            },
          },
        },
      });

      const tokenMorePrecise = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
              precision: 5,
              mathFractionDigits: 10,
            },
          },
        },
      });

      expect(
        transformColorModifiers(tokenLessPrecise(ColorSpaceTypes.SRGB), {
          format: 'srgb',
          mathFractionDigits: 3,
        }),
      ).to.equal('rgb(44.267% 59.467% 89.867%)');
      expect(
        transformColorModifiers(tokenMorePrecise(ColorSpaceTypes.SRGB), {
          format: 'srgb',
          mathFractionDigits: 3,
        }),
      ).to.equal('rgb(44.287% 59.482% 89.87%)');
    });
  });

  describe('overriding of color precision options', () => {
    it('no modify color precision apply default color precision', () => {
      const token = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
            },
          },
        },
      });

      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(44.3% 59.5% 89.9%)',
      );
      expect(
        transformColorModifiers(token(ColorSpaceTypes.SRGB), {
          format: 'srgb',
          precision,
        }),
      ).to.equal('rgb(44.3% 59.5% 89.9%)');
    });

    it('transform options color modify color precision override default color precision', () => {
      const token = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
            },
          },
        },
      });

      expect(
        transformColorModifiers(token(ColorSpaceTypes.SRGB), {
          format: 'srgb',
          precision: 8,
        }),
      ).to.equal('rgb(44.288667% 59.482667% 89.870667%)');
    });

    it('token modify color precision override default color precision', () => {
      const token = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
              precision: 8,
            },
          },
        },
      });

      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(44.288667% 59.482667% 89.870667%)',
      );
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it('token modify color precision override transform options color modify precision', () => {
      const token = (space: ColorSpaceTypes | '', format?) => ({
        value: '#FFFFFF',
        type: 'color',
        $extensions: {
          'studio.tokens': {
            modify: {
              type: 'mix',
              value: '0.5123123452 + 6 * 0.0412341234',
              color: '#4477DD',
              space,
              format,
              precision: 8,
            },
          },
        },
      });

      expect(
        transformColorModifiers(token(ColorSpaceTypes.SRGB), {
          format: 'srgb',
          precision: 5,
        }),
      ).to.equal('rgb(44.288667% 59.482667% 89.870667%)');
    });
  });

  it('returns the original color if the modifier type is invalid', () => {
    const token = (space: ColorSpaceTypes | '') => ({
      value: '#C14242',
      type: 'color',
      $extensions: {
        'studio.tokens': {
          modify: {
            type: '',
            value: '0.2',
            space,
          },
        },
      },
    });

    expect(transformColorModifiers(token(''))).to.equal('#C14242');
    // original, but in hsl space
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(0 50.6% 50.8%)');
  });

  it('allows passing an output format', () => {
    const token = (format?: string) => ({
      value: '#C14242',
      type: 'color',
      $extensions: {
        'studio.tokens': {
          modify: {
            type: 'darken',
            value: '0.2',
            space: 'srgb',
            format,
          },
        },
      },
    });

    // uses the color space as output format
    expect(transformColorModifiers(token())).to.equal('rgb(60.5% 20.7% 20.7%)');
    // output to hsl
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(0 49% 40.6%)');
    // output to hex
    expect(transformColorModifiers(token('hex'))).to.equal('#9a3535');
  });

  it('allows passing an output format as an option', () => {
    const token = (space: ColorSpaceTypes | '') => ({
      value: '#C14242',
      type: 'color',
      $extensions: {
        'studio.tokens': {
          modify: {
            type: 'darken',
            value: '0.2',
            space,
          },
        },
      },
    });

    // uses hex override for output format
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL), { format: 'hex' })).to.equal(
      '#9c3333',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.LCH), { format: 'hex' })).to.equal(
      '#983735',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.P3), { format: 'hex' })).to.equal(
      '#9b3535',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.SRGB), { format: 'hex' })).to.equal(
      '#9a3535',
    );

    // uses hsl override for output format
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL), { format: 'hsl' })).to.equal(
      'hsl(0 50.6% 40.6%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.LCH), { format: 'hsl' })).to.equal(
      'hsl(0.85 47.9% 40.3%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.P3), { format: 'hsl' })).to.equal(
      'hsl(0.052 49% 40.7%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.SRGB), { format: 'hsl' })).to.equal(
      'hsl(0 49% 40.6%)',
    );

    // uses lch override for output format
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL), { format: 'lch' })).to.equal(
      'lch(37.8 51 29.8)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.LCH), { format: 'lch' })).to.equal(
      'lch(37.7 47.5 29.7)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.P3), { format: 'lch' })).to.equal(
      'lch(37.9 49.4 29.4)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.SRGB), { format: 'lch' })).to.equal(
      'lch(37.8 49.4 29.4)',
    );

    // uses p3 override for output format
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL), { format: 'p3' })).to.equal(
      'color(display-p3 0.565 0.23 0.216)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.LCH), { format: 'p3' })).to.equal(
      'color(display-p3 0.551 0.241 0.224)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.P3), { format: 'p3' })).to.equal(
      'color(display-p3 0.56 0.235 0.222)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.SRGB), { format: 'p3' })).to.equal(
      'color(display-p3 0.56 0.235 0.222)',
    );

    // uses srgb override for output format
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL), { format: 'srgb' })).to.equal(
      'rgb(61.2% 20.1% 20.1%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.LCH), { format: 'srgb' })).to.equal(
      'rgb(59.5% 21.5% 21%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.P3), { format: 'srgb' })).to.equal(
      'rgb(60.6% 20.8% 20.7%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.SRGB), { format: 'srgb' })).to.equal(
      'rgb(60.5% 20.7% 20.7%)',
    );

    // without space, return original
    expect(transformColorModifiers(token(''))).to.equal('#C14242');
  });

  it('can convert from a non-srgb space to srgb space to then format it as a hex color (which is fundamentally rgb)', () => {
    const token = {
      value: '#C14242',
      type: 'color',
      $extensions: {
        'studio.tokens': {
          modify: {
            type: 'darken',
            value: '0.2',
            space: 'lch',
            format: 'hex',
          },
        },
      },
    };

    expect(transformColorModifiers(token)).to.equal('#983735');
  });

  it('supports UIColor(r,g,b,a) format', () => {
    const token = {
      value: 'UIColor(red: 1, green: 0, blue: 0.5, alpha: 0.5)',
      type: 'color',
      $extensions: {
        'studio.tokens': {
          modify: {
            type: 'darken',
            value: '0.5',
            space: 'srgb',
            format: 'srgb',
          },
        },
      },
    };

    expect(transformColorModifiers(token)).to.equal('rgb(50% 0% 25% / 0.5)');
  });

  // https://github.com/amzn/style-dictionary/blob/v4/docs/transforms.md#defer-transitive-transformation-manually
  it('should return undefined if the transformation needs to be deferred', () => {
    const token = {
      value: '#C14242',
      type: 'color',
      $extensions: {
        'studio.tokens': {
          modify: {
            type: 'darken',
            value: '{darkenAmount}',
            space: 'srgb',
            format: 'srgb',
          },
        },
      },
    };

    expect(transformColorModifiers(token)).to.be.undefined;
  });
});
