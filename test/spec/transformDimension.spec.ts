import { expect } from 'chai';
import { transformDimension } from '../../src/transformDimension.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

runTransformSuite(transformDimension as (value: unknown) => unknown, {});

describe('transform dimension', () => {
  it('transforms unitless dimensions, by suffixing with "px"', () => {
    expect(transformDimension({ value: '4' })).to.equal('4px');
    expect(transformDimension({ value: 4 })).to.equal('4px');
  });

  it('supports multiple values', () => {
    expect(transformDimension({ value: '4 8' })).to.equal('4px 8px');
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
    describe('typography', () => {
      it('should add units to single-value fontSize with type', () => {
        expect(
          transformDimension({
            type: 'typography',
            value: {
              fontSize: '4',
              fontFamily: 'Arial',
            },
          }),
        ).to.eql({ fontSize: '4px', fontFamily: 'Arial' });
      });

      it('should add units to single-value fontSize with $type', () => {
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

      it('should add units to multi-value fontSize with type', () => {
        expect(
          transformDimension({
            type: 'typography',
            value: {
              fontSize: '4 8',
              fontFamily: 'Arial',
            },
          }),
        ).to.eql({ fontSize: '4px 8px', fontFamily: 'Arial' });
      });

      it('should add units to multi-value fontSize with $type', () => {
        expect(
          transformDimension({
            $type: 'typography',
            $value: {
              fontSize: '4 8',
              fontFamily: 'Arial',
            },
          }),
        ).to.eql({ fontSize: '4px 8px', fontFamily: 'Arial' });
      });
    });

    describe('shadow', () => {
      it('should add units to single shadow value props', () => {
        expect(
          transformDimension({
            type: 'shadow',
            value: {
              offsetX: '1',
              offsetY: 2,
              blur: '3',
              spread: '4',
              color: '#000',
            },
          }),
        ).to.eql({
          offsetX: '1px',
          offsetY: '2px',
          blur: '3px',
          spread: '4px',
          color: '#000',
        });
        expect(
          transformDimension({
            type: 'shadow',
            value: {
              offsetX: '1 2',
              offsetY: '3 4',
              blur: '5 6',
              spread: '7 8',
              color: '#000',
            },
          }),
        ).to.eql({
          offsetX: '1px 2px',
          offsetY: '3px 4px',
          blur: '5px 6px',
          spread: '7px 8px',
          color: '#000',
        });
      });

      it('should add units to shadow props with $type', () => {
        expect(
          transformDimension({
            $type: 'shadow',
            $value: {
              offsetX: '1',
              offsetY: 2,
              blur: '3',
              spread: '4',
              color: '#000',
            },
          }),
        ).to.eql({
          offsetX: '1px',
          offsetY: '2px',
          blur: '3px',
          spread: '4px',
          color: '#000',
        });
        expect(
          transformDimension({
            $type: 'shadow',
            $value: {
              offsetX: '1 2',
              offsetY: '3 4',
              blur: '5 6',
              spread: '7 8',
              color: '#000',
            },
          }),
        ).to.eql({
          offsetX: '1px 2px',
          offsetY: '3px 4px',
          blur: '5px 6px',
          spread: '7px 8px',
          color: '#000',
        });
      });

      it('should add units to multi-shadow props', () => {
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
              {
                offsetX: '5',
                offsetY: '6',
                blur: '7',
                spread: '8',
                color: '#fff',
              },
            ],
          }),
        ).to.eql([
          { offsetX: '1px', offsetY: '2px', blur: '3px', spread: '4px', color: '#000' },
          { offsetX: '5px', offsetY: '6px', blur: '7px', spread: '8px', color: '#fff' },
        ]);

        expect(
          transformDimension({
            type: 'shadow',
            value: [
              {
                offsetX: '1 2',
                offsetY: '3 4',
                blur: '5 6',
                spread: '7 8',
                color: '#000',
              },
              {
                offsetX: '5',
                offsetY: '6',
                blur: '7',
                spread: '8',
                color: '#fff',
              },
            ],
          }),
        ).to.eql([
          {
            offsetX: '1px 2px',
            offsetY: '3px 4px',
            blur: '5px 6px',
            spread: '7px 8px',
            color: '#000',
          },
          { offsetX: '5px', offsetY: '6px', blur: '7px', spread: '8px', color: '#fff' },
        ]);

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
              {
                offsetX: '5',
                offsetY: '6',
                blur: '7',
                spread: '8',
                color: '#fff',
              },
            ],
          }),
        ).to.eql([
          { offsetX: '1px', offsetY: '2px', blur: '3px', spread: '4px', color: '#000' },
          { offsetX: '5px', offsetY: '6px', blur: '7px', spread: '8px', color: '#fff' },
        ]);
      });
    });

    describe('border', () => {
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
            type: 'border',
            value: {
              width: '4 8',
              color: '#000',
            },
          }),
        ).to.eql({ width: '4px 8px', color: '#000' });
      });

      it('should add units to border props with $type', () => {
        expect(
          transformDimension({
            $type: 'border',
            $value: {
              width: '4',
              color: '#000',
            },
          }),
        ).to.eql({ width: '4px', color: '#000' });
        expect(
          transformDimension({
            $type: 'border',
            $value: {
              width: '4 8',
              color: '#000',
            },
          }),
        ).to.eql({ width: '4px 8px', color: '#000' });
      });
    });
  });
});
