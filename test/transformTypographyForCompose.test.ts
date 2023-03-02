import { expect } from '@esm-bundle/chai';
import { transformTypographyForCompose } from '../src/compose/transformTypography.js';

describe('transform typography', () => {
  it('transforms typography object to typography shorthand', () => {
    expect(
      transformTypographyForCompose({
        fontWeight: '500',
        fontSize: '20px',
        lineHeight: '1.5',
        fontFamily: 'Arial',
      }),
    ).to.equal(`TextStyle(
500
20px
1.5
Arial
)`);
  });
});
