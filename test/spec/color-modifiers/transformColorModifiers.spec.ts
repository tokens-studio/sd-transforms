import { expect } from '@esm-bundle/chai';
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
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(0 50.6% 60.6%)');
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal('lch(57.7 47.5 29.7)');
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.76 0.44 0.42)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(80.5% 40.7% 40.7%)',
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
        'color(display-p3 0.56 0.24 0.22)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(60.5% 20.7% 20.7%)',
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
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(0 0% 50%)');
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal('lch(50 0 0)');
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.5 0.5 0.5)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal('rgb(50% 50% 50%)');
      // without space, return original
      expect(transformColorModifiers(token(''))).to.equal('#000000');
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
        'color(display-p3 0.7 0.29 0.28 / 0.2)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(75.7% 25.9% 25.9% / 0.2)',
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
    expect(transformColorModifiers(token('hsl'))).to.equal('hsl(0 49% 40.6%)');
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
      'hsl(0.05 49% 40.7%)',
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
      'color(display-p3 0.57 0.23 0.22)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.LCH), { format: 'p3' })).to.equal(
      'color(display-p3 0.55 0.24 0.22)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.P3), { format: 'p3' })).to.equal(
      'color(display-p3 0.56 0.24 0.22)',
    );
    expect(transformColorModifiers(token(ColorSpaceTypes.SRGB), { format: 'p3' })).to.equal(
      'color(display-p3 0.56 0.23 0.22)',
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
