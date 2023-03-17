import { expect } from '@esm-bundle/chai';
import { transformTypographyForCSS } from '../src/css/transformTypography';
import { runTransformSuite } from './suites/transform-suite.test';

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

  it('transforms fontWeight prop according to fontweight map for CSS', () => {
    expect(
      transformTypographyForCSS({
        fontWeight: 'light',
        fontSize: '20px',
        lineHeight: '1.5',
        fontFamily: 'Arial',
      }),
    ).to.equal('300 20px/1.5 Arial');
  });
});
