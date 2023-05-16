import { expect } from '@esm-bundle/chai';
import { transformTypographyForCSS } from '../../../src/css/transformTypography.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformTypographyForCSS as (value: unknown) => unknown);

describe('transform typography', () => {
  it('transforms typography object to typography shorthand', () => {
    expect(
      transformTypographyForCSS({
        fontWeight: '500',
        fontSize: '20px',
        lineHeight: '1.5',
        fontFamily: 'Arial',
      }),
    ).to.equal('500 20px/1.5 Arial');
  });

  it('transforms fontWeight prop according to fontweight map for CSS and px dimensions', () => {
    expect(
      transformTypographyForCSS({
        fontWeight: 'light',
        fontSize: '20',
        lineHeight: '1.5',
        fontFamily: 'Arial',
      }),
    ).to.equal('300 20px/1.5 Arial');
  });

  it('provides defaults for missing properties', () => {
    expect(
      transformTypographyForCSS({
        fontWeight: 'light',
        fontSize: '20',
        fontFamily: 'Arial',
      }),
    ).to.equal('300 20px/1 Arial');

    expect(transformTypographyForCSS({})).to.equal('400 16px/1 sans-serif');
  });
});
