import { expect } from 'chai';
import { transformHEXRGBaForCSS } from '../../../src/css/transformHEXRGBa.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformHEXRGBaForCSS as (value: unknown) => unknown, {});

describe('transform HEXRGBa', () => {
  it("transforms Figma's hex code RGBA to actual RGBA format", () => {
    expect(transformHEXRGBaForCSS({ value: 'rgba(#ABC123, 0.5)' })).to.equal(
      'rgba(171, 193, 35, 0.5)',
    );
    expect(transformHEXRGBaForCSS({ value: 'rgba(#ABC123, 1)' })).to.equal('rgba(171, 193, 35, 1)');
    expect(transformHEXRGBaForCSS({ value: 'rgba(#ABC123, 50%)' })).to.equal(
      'rgba(171, 193, 35, 50%)',
    );
    expect(transformHEXRGBaForCSS({ value: 'rgba(#ABC123, 1%)' })).to.equal(
      'rgba(171, 193, 35, 1%)',
    );
    expect(transformHEXRGBaForCSS({ value: 'rgba(#ABC123, 0.75666)' })).to.equal(
      'rgba(171, 193, 35, 0.75666)',
    );
  });

  it("transforms Figma's hex code RGBA to actual RGBA format regardless of whitespacing", () => {
    expect(transformHEXRGBaForCSS({ value: 'rgba( #ABC123 , 0.5)' })).to.equal(
      'rgba(171, 193, 35, 0.5)',
    );
  });

  it('does not transform the color if it doesnt match the regex', () => {
    expect(transformHEXRGBaForCSS({ value: 'foo' })).to.equal('foo');
  });

  it("does not transform if it's already rgba() format", () => {
    expect(transformHEXRGBaForCSS({ value: 'rgba(0,0,0,1)' })).to.equal('rgba(0,0,0,1)');
  });

  it('does not transform if the hex value cannot be interpreted properly', () => {
    expect(transformHEXRGBaForCSS({ value: 'rgba(#000000abcd, 0.3)' })).to.equal(
      'rgba(#000000abcd, 0.3)',
    );
  });

  it('correctly transforms values containing the HEXRGBa pattern', () => {
    expect(
      transformHEXRGBaForCSS({
        value: 'linear-gradient(180deg, #000000 0%, rgba(#000000, 0.00) 45%)',
      }),
    ).to.equal('linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.00) 45%)');
    expect(transformHEXRGBaForCSS({ value: 'rgba(#000000, 0.00) rgba(#000000, 1)' })).to.equal(
      'rgba(0, 0, 0, 0.00) rgba(0, 0, 0, 1)',
    );
  });

  describe('composite tokens', () => {
    it('should transforms colors inside shadow tokens', () => {
      expect(
        transformHEXRGBaForCSS({
          type: 'shadow',
          value: {
            offsetX: '6px',
            offsetY: 0,
            blur: '10px',
            color: 'rgba(#000000, 0.5)',
          },
        }),
      ).to.eql({ offsetX: '6px', offsetY: 0, blur: '10px', color: 'rgba(0, 0, 0, 0.5)' });
      expect(
        transformHEXRGBaForCSS({
          $type: 'shadow',
          $value: [
            {
              offsetX: '6px',
              offsetY: 0,
              blur: '10px',
              color: 'rgba(#000000, 1)',
            },
          ],
        }),
      ).to.eql([{ offsetX: '6px', offsetY: 0, blur: '10px', color: 'rgba(0, 0, 0, 1)' }]);
    });

    it('should transforms colors inside border tokens', () => {
      expect(
        transformHEXRGBaForCSS({
          type: 'border',
          value: {
            width: '2px',
            style: 'solid',
            color: 'rgba(#000000, 0.5)',
          },
        }),
      ).to.eql({ width: '2px', style: 'solid', color: 'rgba(0, 0, 0, 0.5)' });
      expect(
        transformHEXRGBaForCSS({
          $type: 'border',
          $value: {
            width: '2px',
            style: 'solid',
            color: 'rgba(#000000, 0.5)',
          },
        }),
      ).to.eql({ width: '2px', style: 'solid', color: 'rgba(0, 0, 0, 0.5)' });
    });
  });

  it('transforms shorthand hex formats correctly', () => {
    // 3-digit hex (#RGB)
    expect(transformHEXRGBaForCSS({ value: '#F00' })).to.equal('#F00');

    // 4-digit hex (#RGBA)
    expect(transformHEXRGBaForCSS({ value: '#F00F' })).to.equal('rgba(255, 0, 0, 1)');
    expect(transformHEXRGBaForCSS({ value: '#F000' })).to.equal('rgba(255, 0, 0, 0)');

    // Mixed formats in a single value
    expect(
      transformHEXRGBaForCSS({
        value: 'linear-gradient(180deg, rgba(#000, 0.5), rgba(#F00F, 0.5))',
      }),
    ).to.equal('linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(255, 0, 0, 0.5))');
  });

  it('handles invalid hex values gracefully', () => {
    expect(transformHEXRGBaForCSS({ value: 'rgba(#GGG, 0.5)' })).to.equal('rgba(#GGG, 0.5)');
    expect(transformHEXRGBaForCSS({ value: 'rgba(#12, 0.5)' })).to.equal('rgba(#12, 0.5)');
  });

  it('transforms HEX8 format correctly', () => {
    expect(transformHEXRGBaForCSS({ value: '#000000FF' })).to.equal('rgba(0, 0, 0, 1)');
    expect(transformHEXRGBaForCSS({ value: '#00000000' })).to.equal('rgba(0, 0, 0, 0)');
  });
});
