import { expect } from '@esm-bundle/chai';
import { transformLineHeight } from '../../src/transformLineHeight.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

runTransformSuite(transformLineHeight as (value: unknown) => unknown, {});

describe('transform line height', () => {
  it('transforms line-height % to unit-less decimal value', () => {
    expect(transformLineHeight({ value: '50%' })).to.equal(0.5);
  });

  it("does not transform line-height if it doesn't end with %", () => {
    expect(transformLineHeight({ value: '100' })).to.equal('100');
  });

  it('does not transform line-height if it cannot be parsed as float', () => {
    expect(transformLineHeight({ value: 'not-a-float%' })).to.equal('not-a-float%');
  });

  describe('composite tokens', () => {
    it('should transforms letter spacing % to em in typography letterSpacing prop', () => {
      expect(
        transformLineHeight({
          type: 'typography',
          value: {
            fontSize: '16px',
            fontFamily: 'Arial',
            lineHeight: '150%',
          },
        }),
      ).to.eql({ fontSize: '16px', fontFamily: 'Arial', lineHeight: 1.5 });
      expect(
        transformLineHeight({
          $type: 'typography',
          $value: {
            fontSize: '16px',
            fontFamily: 'Arial',
            lineHeight: '150%',
          },
        }),
      ).to.eql({ fontSize: '16px', fontFamily: 'Arial', lineHeight: 1.5 });
    });

    it('should leave typography lineHeight as is if it has already been stringified', () => {
      expect(
        transformLineHeight({
          type: 'typography',
          value: '300 16px/1 Arial',
        }),
      ).to.eql('300 16px/1 Arial');
    });
  });
});
