import { expect } from '@esm-bundle/chai';
import { transformTypography } from '../src/transformTypography.js';

describe('transform typography', () => {
  it('transforms typography object to typography shorthand', () => {
    expect(
      transformTypography({
        fontWeight: '500',
        fontSize: '20px',
        lineHeight: '1.5',
        fontFamily: 'Arial',
      }),
    ).to.equal('500 20px/1.5 Arial');
  });
});
