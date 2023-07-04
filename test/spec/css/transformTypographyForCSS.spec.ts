import { expect } from '@esm-bundle/chai';
import {
  transformTypographyForCSS,
  isCommaSeparated,
} from '../../../src/css/transformTypography.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformTypographyForCSS as (value: unknown) => unknown);

describe('transform typography', () => {
  describe('typography utils', () => {
    it('isCommaSeparated returns true if string is comma seperated', () => {
      expect(isCommaSeparated('foo,bar')).to.be.true;
    });
  });

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
        fontSize: '',
        fontFamily: 'Arial',
      }),
    ).to.equal('300 16px/1 Arial');

    expect(transformTypographyForCSS({})).to.equal('400 16px/1 sans-serif');
  });

  it('sets quotes around fontFamily if it has white-spaces in name', () => {
    expect(
      transformTypographyForCSS({
        fontWeight: 'light',
        fontSize: '20',
        lineHeight: '1.5',
        fontFamily: 'Arial Narrow, Arial, sans-serif',
      }),
    ).to.equal("300 20px/1.5 'Arial Narrow', Arial, sans-serif");
  });

  it('sets fontFamily to sans-serif when it is not defined ', () => {
    expect(
      transformTypographyForCSS({
        fontWeight: 'light',
        fontSize: '20',
        lineHeight: '1.5',
      }),
    ).to.equal('300 20px/1.5 sans-serif');
  });

  it('includes fontStyle if included in the fontWeight', () => {
    expect(
      transformTypographyForCSS({
        fontWeight: 'light Italic',
        fontSize: '20',
        lineHeight: '1.5',
      }),
    ).to.equal('300 italic 20px/1.5 sans-serif');

    expect(
      transformTypographyForCSS({
        fontWeight: 'light',
        fontSize: '20',
        lineHeight: '1.5',
        fontStyle: 'italic',
      }),
    ).to.equal('300 italic 20px/1.5 sans-serif');
  });
});
