import { expect } from '@esm-bundle/chai';
import { transformDimension } from '../../src/transformDimension.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

runTransformSuite(transformDimension as (value: unknown) => unknown, {});

describe('transform dimension', () => {
  it('transforms unitless dimensions, by suffixing with "px"', () => {
    expect(transformDimension({ value: '4' })).to.equal('4px');
    expect(transformDimension({ value: 4 })).to.equal('4px');
  });

  it('does not transform a dimension if it already is suffixed with "px"', () => {
    expect(transformDimension({ value: '4px' })).to.equal('4px');
  });

  it('does not transform a dimension if it is not numeric', () => {
    expect(transformDimension({ value: '4em' })).to.equal('4em');
  });

  it('does not transform a dimension if it is 0', () => {
    expect(transformDimension({ value: '0' })).to.equal('0');
    expect(transformDimension({ value: 0 })).to.equal('0');
  });

  describe('composite tokens', () => {
    it('should add units to typography props', () => {
      expect(
        transformDimension({
          type: 'typography',
          value: {
            fontSize: '4',
            fontFamily: 'Arial',
          },
        }),
      ).to.eql({ fontSize: '4px', fontFamily: 'Arial' });
      expect(
        transformDimension({
          $type: 'typography',
          $value: {
            fontSize: '4',
            fontFamily: 'Arial',
          },
        }),
      ).to.eql({ fontSize: '4px', fontFamily: 'Arial' });
    });

    it('should add units to shadow props', () => {
      expect(
        transformDimension({
          type: 'shadow',
          value: {
            offsetX: '1',
            offsetY: '2',
            blur: '3',
            spread: '4',
            color: '#000',
          },
        }),
      ).to.eql({ offsetX: '1px', offsetY: '2px', blur: '3px', spread: '4px', color: '#000' });
      expect(
        transformDimension({
          $type: 'shadow',
          $value: {
            offsetX: '1',
            offsetY: '2',
            blur: '3',
            spread: '4',
            color: '#000',
          },
        }),
      ).to.eql({ offsetX: '1px', offsetY: '2px', blur: '3px', spread: '4px', color: '#000' });
    });

    it('should add units to multi shadow props', () => {
      expect(
        transformDimension({
          type: 'shadow',
          value: [
            {
              offsetX: '1',
              offsetY: '2',
              blur: '3',
              spread: '4',
              color: '#000',
            },
          ],
        }),
      ).to.eql([{ offsetX: '1px', offsetY: '2px', blur: '3px', spread: '4px', color: '#000' }]);
      expect(
        transformDimension({
          $type: 'shadow',
          $value: [
            {
              offsetX: '1',
              offsetY: '2',
              blur: '3',
              spread: '4',
              color: '#000',
            },
          ],
        }),
      ).to.eql([{ offsetX: '1px', offsetY: '2px', blur: '3px', spread: '4px', color: '#000' }]);
    });

    it('should add units to border props', () => {
      expect(
        transformDimension({
          type: 'border',
          value: {
            width: '4',
            color: '#000',
          },
        }),
      ).to.eql({ width: '4px', color: '#000' });
      expect(
        transformDimension({
          $type: 'border',
          $value: {
            width: '4',
            color: '#000',
          },
        }),
      ).to.eql({ width: '4px', color: '#000' });
    });
  });
});
