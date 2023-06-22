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
      expect(transformColorModifiers(token(ColorSpaceTypes.HSL))).to.equal('hsl(91.8 0% 46.6%)');
      expect(transformColorModifiers(token(ColorSpaceTypes.LCH))).to.equal('lch(50 0 0)');
      expect(transformColorModifiers(token(ColorSpaceTypes.P3))).to.equal(
        'color(display-p3 0.47 0.47 0.47)',
      );
      expect(transformColorModifiers(token(ColorSpaceTypes.SRGB))).to.equal(
        'rgb(46.6% 46.6% 46.6%)',
      );
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
});
