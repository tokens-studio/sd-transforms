import { expect } from 'chai';
import { transformTypographyForCompose } from '../../../src/compose/transformTypography.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformTypographyForCompose as (value: unknown) => unknown, {});

describe('transform typography', () => {
  it('transforms typography object to typography shorthand', () => {
    expect(
      transformTypographyForCompose({
        value: {
          fontWeight: '500',
          fontSize: '20px',
          lineHeight: '1.5',
          fontFamily: 'Arial',
        },
      }),
    ).to.equal(`TextStyle(
500
20px
1.5
Arial
)`);
  });

  it('transforms typography object to typography shorthand', () => {
    expect(
      transformTypographyForCompose({
        value: {
          fontWeight: 'light',
          fontSize: '20px',
          lineHeight: '1.5',
          fontFamily: 'Arial',
        },
      }),
    ).to.equal(`TextStyle(
300
20px
1.5
Arial
)`);
  });

  it('transforms ignores unknown properties in typography object and transforms to empty string', () => {
    expect(
      transformTypographyForCompose({
        value: { fontWeight: 'light', foo: '20px', lineHeight: '1.5', fontFamily: 'Arial' },
      }),
    ).to.equal(`TextStyle(
300
1.5
Arial
)`);
  });
});
