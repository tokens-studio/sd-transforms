import { expect } from 'chai';
import { ColorSpaceTypes } from '@tokens-studio/types';
import { transformColorModifiers } from '../../../src/color-modifiers/transformColorModifiers.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformColorModifiers as (value: unknown) => unknown, {
  value: '#C14242',
  type: 'color',
  $extensions: {
    'studio.tokens': {
      modify: {
        type: 'lighten',
        value: '0.2',
        space: ColorSpaceTypes.HSL,
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
            },
          },
        },
      });

      // lighten faint red to more light red
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal(
        'hsl(0 50.598% 60.627%)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal(
        'lch(57.685 47.48 29.704)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.76016 0.43532 0.42213)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(80.549% 40.706% 40.706%)',
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
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal(
        'hsl(0 50.598% 40.627%)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal(
        'lch(37.685 47.48 29.704)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.56016 0.23532 0.22213)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(60.549% 20.706% 20.706%)',
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

      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal(
        'hsl(220 51.231% 67.933%)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal(
        'lch(63.417 43.678 278.69)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.49226 0.60164 0.88112)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(45.733% 60.533% 90.133%)',
      );
      expect(transformColorModifiers(token(''))).to.equal('#FFFFFF');
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB, 'hex'))).to.equal('#759ae6');
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
        'hsl(0 50.598% 50.784% / 0.2)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal(
        'lch(47.107 59.35 29.704 / 0.2)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.7002 0.29415 0.27766 / 0.2)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(75.686% 25.882% 25.882% / 0.2)',
      );
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
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(0 50.598% 50.784%)');
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
    expect(transformColorModifiers(token())).to.equal('rgb(60.549% 20.706% 20.706%)');
    // output to hsl
    expect(transformColorModifiers(token('hsl'))).to.equal('hsl(0 49.035% 40.627%)');
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
      'hsl(0 50.598% 40.627%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.LCH), { format: 'hsl' })).to.equal(
      'hsl(0.84955 47.88% 40.252%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.P3), { format: 'hsl' })).to.equal(
      'hsl(0.05177 48.997% 40.665%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.SRGB), { format: 'hsl' })).to.equal(
      'hsl(0 49.035% 40.627%)',
    );

    // uses lch override for output format
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL), { format: 'lch' })).to.equal(
      'lch(37.824 50.982 29.805)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.LCH), { format: 'lch' })).to.equal(
      'lch(37.685 47.48 29.704)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.P3), { format: 'lch' })).to.equal(
      'lch(37.854 49.384 29.403)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.SRGB), { format: 'lch' })).to.equal(
      'lch(37.805 49.408 29.373)',
    );

    // uses p3 override for output format
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL), { format: 'p3' })).to.equal(
      'color(display-p3 0.56519 0.23007 0.21637)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.LCH), { format: 'p3' })).to.equal(
      'color(display-p3 0.5509 0.24058 0.22405)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.P3), { format: 'p3' })).to.equal(
      'color(display-p3 0.56016 0.23532 0.22213)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.SRGB), { format: 'p3' })).to.equal(
      'color(display-p3 0.55975 0.23469 0.22176)',
    );

    // uses srgb override for output format
    expect(transformColorModifiers(token(ColorSpaceTypes.HSL), { format: 'srgb' })).to.equal(
      'rgb(61.184% 20.071% 20.071%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.LCH), { format: 'srgb' })).to.equal(
      'rgb(59.525% 21.525% 20.979%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.P3), { format: 'srgb' })).to.equal(
      'rgb(60.59% 20.775% 20.741%)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.SRGB), { format: 'srgb' })).to.equal(
      'rgb(60.549% 20.706% 20.706%)',
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
