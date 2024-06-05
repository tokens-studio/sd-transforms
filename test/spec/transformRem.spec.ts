import { expect } from '@esm-bundle/chai';
import { transformRem } from '../../src/transformRem.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';

runTransformSuite(transformRem as (value: unknown) => unknown, {});

describe('transform dimension', () => {
  it('transforms and scales unitless dimensions with "rem"', () => {
    expect(transformRem({ value: '4' })).to.equal('0.25rem');
    expect(transformRem({ value: 4 })).to.equal('0.25rem');

    expect(transformRem({ value: '16' })).to.equal('1rem');
    expect(transformRem({ value: 16 })).to.equal('1rem');
  });

  it('transforms and scales unitless dimensions with "rem" using custom "baseFontSize', () => {
    expect(transformRem({ value: '16' }, 20)).to.equal('0.8rem');
    expect(transformRem({ value: 16 }, 20)).to.equal('0.8rem');

    expect(transformRem({ value: '20' }, 20)).to.equal('1rem');
    expect(transformRem({ value: 20 }, 20)).to.equal('1rem');
  });

  it('does not transform a dimension if it already is suffixed with "rem"', () => {
    expect(transformRem({ value: '4rem' })).to.equal('4rem');
  });

  it('does not transform a dimension if it is not numeric', () => {
    expect(transformRem({ value: '4em' })).to.equal('4em');
  });

  it('does not transform a dimension if it is 0', () => {
    expect(transformRem({ value: '0' })).to.equal('0');
    expect(transformRem({ value: 0 })).to.equal('0');
  });

  describe('composite tokens', () => {
    it('should add units to typography props', () => {
      expect(
        transformRem({
          type: 'typography',
          value: {
            fontSize: '4',
            fontFamily: 'Arial',
          },
        }),
      ).to.eql({ fontSize: '0.25rem', fontFamily: 'Arial' });
      expect(
        transformRem({
          $type: 'typography',
          $value: {
            fontSize: '0.25rem',
            fontFamily: 'Arial',
          },
        }),
      ).to.eql({ fontSize: '0.25rem', fontFamily: 'Arial' });
    });

    it('should add units to shadow props', () => {
      expect(
        transformRem({
          type: 'shadow',
          value: {
            offsetX: '1',
            offsetY: '2',
            blur: '3',
            spread: '4',
            color: '#000',
          },
        }),
      ).to.eql({
        offsetX: '0.0625rem',
        offsetY: '0.125rem',
        blur: '0.1875rem',
        spread: '0.25rem',
        color: '#000',
      });
      expect(
        transformRem({
          $type: 'shadow',
          $value: {
            offsetX: '1',
            offsetY: '2',
            blur: '3',
            spread: '4',
            color: '#000',
          },
        }),
      ).to.eql({
        offsetX: '0.0625rem',
        offsetY: '0.125rem',
        blur: '0.1875rem',
        spread: '0.25rem',
        color: '#000',
      });
    });

    it('should add units to multi shadow props', () => {
      expect(
        transformRem({
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
      ).to.eql([
        {
          offsetX: '0.0625rem',
          offsetY: '0.125rem',
          blur: '0.1875rem',
          spread: '0.25rem',
          color: '#000',
        },
      ]);
      expect(
        transformRem({
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
      ).to.eql([
        {
          offsetX: '0.0625rem',
          offsetY: '0.125rem',
          blur: '0.1875rem',
          spread: '0.25rem',
          color: '#000',
        },
      ]);
    });

    it('should add units to border props', () => {
      expect(
        transformRem({
          type: 'border',
          value: {
            width: '4',
            color: '#000',
          },
        }),
      ).to.eql({ width: '0.25rem', color: '#000' });
      expect(
        transformRem({
          $type: 'border',
          $value: {
            width: '4',
            color: '#000',
          },
        }),
      ).to.eql({ width: '0.25rem', color: '#000' });
    });
  });
});
