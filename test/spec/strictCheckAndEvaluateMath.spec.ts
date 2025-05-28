import { expect } from 'chai';
import { strictCheckAndEvaluateMath } from '../../src/strictCheckAndEvaluateMath.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';
import { cleanup, init } from '../integration/utils.js';
import { TransformedToken } from 'style-dictionary/types';
import { MixedUnitsExpressionError } from '../../src/utils/errors.js';

runTransformSuite(strictCheckAndEvaluateMath as (value: unknown) => unknown, {});

describe('check and evaluate math', () => {
  it('supports expression of type number', () => {
    expect(strictCheckAndEvaluateMath({ value: 10, type: 'number' })).to.equal(10);
  });

  it('can evaluate math expressions where more than one token has a unit, in case of px', () => {
    expect(strictCheckAndEvaluateMath({ value: '4px * 7px', type: 'dimension' })).to.equal('28px');
    expect(strictCheckAndEvaluateMath({ value: '4 * 7px * 8px', type: 'dimension' })).to.equal(
      '224px',
    );
  });

  it('cannot evaluate math expressions where more than one token has a unit, assuming no mixed units are used', () => {
    expect(strictCheckAndEvaluateMath({ value: '4em + 7em', type: 'dimension' })).to.equal('11em');
    expect(() => strictCheckAndEvaluateMath({ value: '4 + 7rem', type: 'dimension' })).to.throw(
      MixedUnitsExpressionError,
    );
    // expect(() => strictCheckAndEvaluateMath({ value: '4em + 7rem', type: 'dimension' })).to.throw(
    //   MixedUnitsExpressionError,
    // );
  });

  it.skip('can evaluate mixed units if operators are exclusively multiplication and the mix is px or unitless', () => {
    expect(strictCheckAndEvaluateMath({ value: '4 * 7em * 8em', type: 'dimension' })).to.equal(
      '224em',
    );
    expect(strictCheckAndEvaluateMath({ value: '4px * 7em', type: 'dimension' })).to.equal('28em');
    // 50em would be incorrect when dividing, as em grows, result should shrink, but doesn't
    expect(strictCheckAndEvaluateMath({ value: '1000 / 20em', type: 'dimension' })).to.equal(
      '1000 / 20em',
    );
    // cannot be expressed/resolved without knowing the value of em
    expect(strictCheckAndEvaluateMath({ value: '4px + 7em', type: 'dimension' })).to.equal(
      '4px + 7em',
    );
  });

  it.skip('can evaluate math expressions where more than one token has a unit, as long as for each piece of the expression the unit is the same', () => {
    // can resolve them, because all values share the same unit
    expect(strictCheckAndEvaluateMath({ value: '5px * 4px / 2px', type: 'dimension' })).to.equal(
      '10px',
    );
    expect(strictCheckAndEvaluateMath({ value: '10vw + 20vw', type: 'dimension' })).to.equal(
      '30vw',
    );

    // cannot resolve them, because em is dynamic and 20/20px is static value
    expect(strictCheckAndEvaluateMath({ value: '2em + 20', type: 'dimension' })).to.equal(
      '2em + 20',
    );
    expect(strictCheckAndEvaluateMath({ value: '2em + 20px', type: 'dimension' })).to.equal(
      '2em + 20px',
    );

    // can resolve them, because multiplying by pixels/unitless is possible, regardless of the other value's unit
    expect(strictCheckAndEvaluateMath({ value: '2pt * 4', type: 'dimension' })).to.equal('8pt');
    expect(strictCheckAndEvaluateMath({ value: '2em * 20px', type: 'dimension' })).to.equal('40em');
  });

  it.skip('supports multi-value expressions with math expressions', () => {
    expect(
      strictCheckAndEvaluateMath({ value: '8 / 4 * 7px 8 * 5px 2 * 4px', type: 'dimension' }),
    ).to.equal('14px 40px 8px');
    expect(
      strictCheckAndEvaluateMath({ value: '5px + 4px + 10px 3 * 2px', type: 'dimension' }),
    ).to.equal('19px 6px');
    expect(strictCheckAndEvaluateMath({ value: '5px 3 * 2px', type: 'dimension' })).to.equal(
      '5px 6px',
    );
    expect(strictCheckAndEvaluateMath({ value: '3 * 2px 5px', type: 'dimension' })).to.equal(
      '6px 5px',
    );
    // smoke test: this value has spaces as well but should be handled normally
    expect(
      strictCheckAndEvaluateMath({
        value: 'linear-gradient(90deg, #354752 0%, #0b0d0e 100%)',
        type: 'dimension',
      }),
    ).to.equal('linear-gradient(90deg, #354752 0%, #0b0d0e 100%)');
  });

  it.skip('supports expr-eval expressions', () => {
    expect(strictCheckAndEvaluateMath({ value: 'roundTo(4 / 7, 1)', type: 'dimension' })).to.equal(
      0.6,
    );
    expect(
      strictCheckAndEvaluateMath({ value: '8 * 14px roundTo(4 / 7, 1)', type: 'dimension' }),
    ).to.equal('112px 0.6');
    expect(
      strictCheckAndEvaluateMath({ value: 'roundTo(4 / 7, 1) 8 * 14px', type: 'dimension' }),
    ).to.equal('0.6 112px');
    expect(
      strictCheckAndEvaluateMath({ value: 'min(10, 24, 5, 12, 6) 8 * 14px', type: 'dimension' }),
    ).to.equal('5 112px');
    expect(
      strictCheckAndEvaluateMath({ value: 'ceil(roundTo(16/1.2,0)/2)*2', type: 'dimension' }),
    ).to.equal(14);
  });

  it.skip('supports expr-eval expressions with units', () => {
    expect(
      strictCheckAndEvaluateMath({ value: 'roundTo(4px / 7, 1)', type: 'dimension' }),
    ).to.equal('0.6px');
    expect(
      strictCheckAndEvaluateMath({ value: '8 * 14px roundTo(4 / 7px, 1)', type: 'dimension' }),
    ).to.equal('112px 0.6px');
    expect(
      strictCheckAndEvaluateMath({ value: 'roundTo(4px / 7px, 1) 8 * 14px', type: 'dimension' }),
    ).to.equal('0.6px 112px');
    expect(
      strictCheckAndEvaluateMath({
        value: 'min(10px, 24px, 5px, 12px, 6px) 8 * 14px',
        type: 'dimension',
      }),
    ).to.equal('5px 112px');
    expect(
      strictCheckAndEvaluateMath({ value: 'ceil(roundTo(16px/1.2,0)/2)*2', type: 'dimension' }),
    ).to.equal('14px');
  });

  it.skip('should support expr eval expressions in combination with regular math', () => {
    expect(
      strictCheckAndEvaluateMath({ value: 'roundTo(4 / 7, 1) * 24', type: 'dimension' }),
    ).to.equal(14.4);
  });

  it.skip('does not unnecessarily remove wrapped quotes around font-family values', () => {
    expect(
      strictCheckAndEvaluateMath({ value: `800 italic 16px/1 'Arial Black'`, type: 'dimension' }),
    ).to.equal(`800 italic 16px/1 'Arial Black'`);
  });

  it.skip('does not unnecessarily change the type of the value', () => {
    expect(strictCheckAndEvaluateMath({ value: 11, type: 'number' })).to.equal(11);
    // changes to number because the expression is a math expression evaluating to a number result
    expect(strictCheckAndEvaluateMath({ value: '11 * 5', type: 'dimension' })).to.equal(55);
    // keeps it as string because there is no math expression to evaluate, so just keep it as is
    expect(strictCheckAndEvaluateMath({ value: '11', type: 'dimension' })).to.equal('11');
  });

  it.skip('supports values that contain spaces and strings, e.g. a date format', () => {
    expect(strictCheckAndEvaluateMath({ value: `dd/MM/yyyy 'om' HH:mm`, type: 'date' })).to.equal(
      `dd/MM/yyyy 'om' HH:mm`,
    );
  });

  it.skip('allows a `mathFractionDigits` option to control the rounding of values in math', async () => {
    const dict = await init.skip({
      tokens: {
        foo: {
          value: '5',
          type: 'dimension',
        },
        bar: {
          value: '{foo} / 16',
          type: 'dimension',
        },
      },
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          mathFractionDigits: 3,
          files: [
            {
              format: 'css/variables',
              destination: 'foo.css',
            },
          ],
        },
      },
    });
    const enrichedTokens = await dict?.exportPlatform('css'); // platform to parse for is 'css' in this case
    cleanup(dict);
    expect((enrichedTokens?.bar as TransformedToken).value).to.eql('0.313px');
  });

  it.skip('supports boolean values', () => {
    expect(strictCheckAndEvaluateMath({ value: false, type: 'boolean' })).to.equal(false);
    expect(strictCheckAndEvaluateMath({ value: true, type: 'boolean' })).to.equal(true);
  });

  it.skip('supports DTCG tokens', () => {
    expect(strictCheckAndEvaluateMath({ $value: '4 * 7px', $type: 'dimension' })).to.equal('28px');
  });

  describe('composite type tokens', () => {
    it.skip('supports typography values', () => {
      expect(
        strictCheckAndEvaluateMath({
          value: {
            fontFamily: 'Arial',
            fontWeight: '100 * 3',
            fontSize: '16px * 1.5',
            lineHeight: 1,
          },
          type: 'typography',
        }),
      ).to.eql({
        fontFamily: 'Arial',
        fontWeight: 300,
        fontSize: '24px',
        lineHeight: 1,
      });
    });

    it.skip('supports shadow values', () => {
      expect(
        strictCheckAndEvaluateMath({
          value: {
            offsetX: '2*2px',
            offsetY: '2*4px',
            blur: '2*8px',
            spread: '2*6px',
            color: '#000',
          },
          type: 'shadow',
        }),
      ).to.eql({
        offsetX: '4px',
        offsetY: '8px',
        blur: '16px',
        spread: '12px',
        color: '#000',
      });
    });

    it.skip('supports shadow multi values', () => {
      expect(
        strictCheckAndEvaluateMath({
          value: [
            {
              offsetX: '2*2px',
              offsetY: '2*4px',
              blur: '2*8px',
              spread: '2*6px',
              color: '#000',
            },
          ],
          type: 'shadow',
        }),
      ).to.eql([
        {
          offsetX: '4px',
          offsetY: '8px',
          blur: '16px',
          spread: '12px',
          color: '#000',
        },
      ]);
    });

    it.skip('supports border values', () => {
      expect(
        strictCheckAndEvaluateMath({
          value: {
            width: '6px / 4',
            style: 'solid',
            color: '#000',
          },
          type: 'typography',
        }),
      ).to.eql({
        width: '1.5px',
        style: 'solid',
        color: '#000',
      });
    });

    it.skip('keeps values of type "object" that are not actual objects as is', () => {
      expect(
        strictCheckAndEvaluateMath({
          value: ['0px 4px 12px #000000', '0px 8px 18px #0000008C'],
          type: 'shadow',
        }),
      ).to.eql(['0px 4px 12px #000000', '0px 8px 18px #0000008C']);
    });
  });

  it.skip('does not transform hex values containing E', () => {
    expect(strictCheckAndEvaluateMath({ value: 'E6', type: 'other' })).to.equal('E6');
  });
});
