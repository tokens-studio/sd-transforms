import { expect } from 'chai';
import { transformShadow } from '../../../src/css/transformShadow.js';
import { runTransformSuite } from '../../suites/transform-suite.spec.js';

runTransformSuite(transformShadow as (value: unknown) => unknown);

describe('transformShadow', () => {
  it('transforms shadow innerShadow type to inset', () => {
    expect(
      // @ts-expect-error type prop gets transformed
      transformShadow({
        x: '0',
        y: '4px',
        blur: '10px',
        spread: '0',
        color: 'rgba(0,0,0,0.4)',
        type: 'innerShadow',
      }),
    ).to.eql({
      x: '0',
      y: '4px',
      blur: '10px',
      spread: '0',
      color: 'rgba(0,0,0,0.4)',
      type: 'inset',
    });

    expect(
      // @ts-expect-error type prop gets transformed
      transformShadow({
        x: '0',
        y: '4px',
        blur: '10px',
        spread: '0',
        color: 'rgba(0,0,0,0.4)',
        type: 'inset',
      }),
    ).to.eql({
      x: '0',
      y: '4px',
      blur: '10px',
      spread: '0',
      color: 'rgba(0,0,0,0.4)',
      type: 'inset',
    });
  });

  it('transforms shadow array value innerShadow type to inset', () => {
    expect(
      transformShadow([
        {
          x: '0',
          y: '4px',
          blur: '10px',
          spread: '0',
          color: 'rgba(0,0,0,0.4)',
          // @ts-expect-error type prop gets transformed
          type: 'innerShadow',
        },
        {
          x: '2',
          y: '8',
          blur: '12px',
          spread: '0',
          color: 'rgba(0,0,0,0.4)',
          // @ts-expect-error type prop gets transformed
          type: 'inset',
        },
      ]),
    ).to.eql([
      {
        x: '0',
        y: '4px',
        blur: '10px',
        spread: '0',
        color: 'rgba(0,0,0,0.4)',
        type: 'inset',
      },
      {
        x: '2',
        y: '8',
        blur: '12px',
        spread: '0',
        color: 'rgba(0,0,0,0.4)',
        type: 'inset',
      },
    ]);
  });

  it('transforms shadow invalid type value to undefined', () => {
    expect(
      // @ts-expect-error type prop gets transformed
      transformShadow({
        x: '0',
        y: '4px',
        blur: '10px',
        spread: '0',
        color: 'rgba(0,0,0,0.4)',
        type: 'foo',
      }),
    ).to.eql({
      x: '0',
      y: '4px',
      blur: '10px',
      spread: '0',
      color: 'rgba(0,0,0,0.4)',
      type: undefined,
    });
  });
});
