import { expect } from '@esm-bundle/chai';
import { transformLetterSpacingForCSS } from '../../../src/css/transformLetterSpacing.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformLetterSpacingForCSS as (value: unknown) => unknown, {});

describe('transform letter spacing', () => {
  it('transforms letter spacing % to em', () => {
    expect(transformLetterSpacingForCSS({ value: '50%', type: 'letterSpacing' })).to.equal('0.5em');
  });

  it("does not transform letter spacing if it doesn't end with %", () => {
    expect(transformLetterSpacingForCSS({ value: '100', type: 'letterSpacing' })).to.equal('100');
  });

  it('does not transform letter spacing if it cannot be parsed as float', () => {
    expect(transformLetterSpacingForCSS({ value: 'not-a-float%', type: 'letterSpacing' })).to.equal(
      'not-a-float%',
    );
  });

  describe('composite tokens', () => {
    it('should transforms letter spacing % to em in typography letterSpacing prop', () => {
      expect(
        transformLetterSpacingForCSS({
          type: 'typography',
          value: {
            fontSize: '16px',
            fontFamily: 'Arial',
            letterSpacing: '150%',
          },
        }),
      ).to.eql({ fontSize: '16px', fontFamily: 'Arial', letterSpacing: '1.5em' });
      expect(
        transformLetterSpacingForCSS({
          $type: 'typography',
          $value: {
            fontSize: '16px',
            fontFamily: 'Arial',
            letterSpacing: '150%',
          },
        }),
      ).to.eql({ fontSize: '16px', fontFamily: 'Arial', letterSpacing: '1.5em' });
    });

    it('should leave typography letterSpacing as is if it has already been stringified', () => {
      expect(
        transformLetterSpacingForCSS({
          type: 'typography',
          value: '16px Arial',
        }),
      ).to.eql('16px Arial');
    });
  });
});
