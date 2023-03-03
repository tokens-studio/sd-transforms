import { transformTypographyForCompose } from '../src/compose/transformTypography';
import { expect } from '@esm-bundle/chai';
import { runTransformSuite } from './suites/transform-suite.test';

runTransformSuite(transformTypographyForCompose as (value: unknown) => unknown);

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
