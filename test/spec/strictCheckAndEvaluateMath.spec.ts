import { expect } from 'chai';
import { strictCheckAndEvaluateMath as calc } from '../../src/strictCheckAndEvaluateMath.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';
import { cleanup, init } from '../integration/utils.js';
import { TransformedToken } from 'style-dictionary/types';
import { MathExprEvalError } from '../../src/utils/errors.js';

runTransformSuite(calc as (value: unknown) => unknown, {});

describe('check and evaluate math', () => {
  it('supports expression of type number', () => {
    expect(calc({ value: 10, type: 'number' })).to.equal(10);
  });

  it('can evaluate math expressions where more than one token has a unit, in case of px', () => {
    expect(calc({ value: '4px * 7px', type: 'dimension' })).to.equal('28px');
    expect(calc({ value: '4 * 7px * 8px', type: 'dimension' })).to.equal('224px');
  });

  it('cannot evaluate math expressions where more than one token has a unit, assuming no mixed units are used', () => {
    expect(calc({ value: '4em + 7em', type: 'dimension' })).to.equal('11em');
    expect(() => calc({ value: '4 + 7rem', type: 'dimension' })).to.throw(MathExprEvalError);
    expect(() => calc({ value: '4em + 7rem', type: 'dimension' })).to.throw(MathExprEvalError);
  });

  it('can evaluate math expressions where more than one token has a unit, as long as for each piece of the expression the unit is the same', () => {
    // can resolve them, because all values share the same unit
    expect(calc({ value: '5px * 4px / 2px', type: 'dimension' })).to.equal('10px');
    expect(calc({ value: '10vw + 20vw', type: 'dimension' })).to.equal('30vw');

    // cannot resolve them, because em is dynamic and 20/20px is static value
    expect(() => calc({ value: '2em + 20', type: 'dimension' })).to.throw(MathExprEvalError);
    expect(() => calc({ value: '2em + 20px', type: 'dimension' })).to.throw(MathExprEvalError);

    // can resolve them, because multiplying by pixels/unitless is possible, regardless of the other value's unit
    expect(calc({ value: '2pt * 4', type: 'dimension' })).to.equal('8pt');
  });

  it('supports multi-value expressions with math expressions', () => {
    expect(calc({ value: '8 / 4 * 7px 8 * 5px 2 * 4px', type: 'dimension' })).to.equal(
      '14px 40px 8px',
    );
    expect(calc({ value: '5px + 4px + 10px 3 * 2px', type: 'dimension' })).to.equal('19px 6px');
    expect(calc({ value: '5px 3 * 2px', type: 'dimension' })).to.equal('5px 6px');
    expect(calc({ value: '3 * 2px 5px', type: 'dimension' })).to.equal('6px 5px');
  });

  it('supports expr-eval expressions', () => {
    expect(calc({ value: 'roundTo(4 / 7, 1)', type: 'dimension' })).to.equal(0.6);
    expect(calc({ value: '8 * 14px roundTo(4 / 7, 1)', type: 'dimension' })).to.equal('112px 0.6');
    expect(calc({ value: 'roundTo(4 / 7, 1) 8 * 14px', type: 'dimension' })).to.equal('0.6 112px');
    expect(calc({ value: 'min(10, 24, 5, 12, 6) 8 * 14px', type: 'dimension' })).to.equal(
      '5 112px',
    );
    expect(calc({ value: 'ceil(roundTo(3.3333px, 2) * 2)*2', type: 'dimension' })).to.equal('14px');
  });

  it('supports expr-eval expressions with units', () => {
    expect(calc({ value: 'roundTo(4px / 7, 1)', type: 'dimension' })).to.equal('0.6px');
    expect(calc({ value: '8 * 14px roundTo(4 / 7px, 1)', type: 'dimension' })).to.equal(
      '112px 0.6px',
    );
    expect(calc({ value: 'roundTo(4px / 7px, 1) 8 * 14px', type: 'dimension' })).to.equal(
      '0.6px 112px',
    );
    expect(
      calc({
        value: 'min(10px, 24px, 5px, 12px, 6px) 8 * 14px',
        type: 'dimension',
      }),
    ).to.equal('5px 112px');
    expect(calc({ value: 'ceil(roundTo(16px/1.2,0)/2)*2', type: 'dimension' })).to.equal('14px');
  });

  it('should support expr eval expressions in combination with regular math', () => {
    expect(calc({ value: 'roundTo(roundTo(4 / 7, 1) * 24, 1)', type: 'dimension' })).to.equal(14.4);
  });

  it('does not unnecessarily remove wrapped quotes around font-family values', () => {
    expect(calc({ value: `800 italic 16px/1 'Arial Black'`, type: 'dimension' })).to.equal(
      `800 italic 16px 'Arial Black'`,
    );
  });

  it('does not unnecessarily change the type of the value', () => {
    expect(calc({ value: 11, type: 'number' })).to.equal(11);
    // changes to number because the expression is a math expression evaluating to a number result
    expect(calc({ value: '11 * 5', type: 'dimension' })).to.equal(55);
    // keeps it as string because there is no math expression to evaluate, so just keep it as is
    expect(calc({ value: '11', type: 'dimension' })).to.equal(11);
  });

  it('supports values that contain spaces and strings, e.g. a date format', () => {
    expect(calc({ value: `dd/MM/yyyy 'om' HH:mm`, type: 'date' })).to.equal(
      `dd/MM/yyyy 'om' HH:mm`,
    );
  });

  it('allows a `mathFractionDigits` option to control the rounding of values in math', async () => {
    const dict = await init({
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
          mathOptions: { fractionDigits: 3 },
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

  it('supports boolean values', () => {
    expect(calc({ value: false, type: 'boolean' })).to.equal(false);
    expect(calc({ value: true, type: 'boolean' })).to.equal(true);
  });

  it('supports DTCG tokens', () => {
    expect(calc({ $value: '4 * 7px', $type: 'dimension' })).to.equal('28px');
  });

  describe('composite type tokens', () => {
    it('supports typography values', () => {
      expect(
        calc({
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

    it('supports shadow values', () => {
      expect(
        calc({
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

    it('supports shadow multi values', () => {
      expect(
        calc({
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

    it('supports border values', () => {
      expect(
        calc({
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

    it('keeps values of type "object" that are not actual objects as is', () => {
      expect(
        calc({
          value: ['0px 4px 12px #000000', '0px 8px 18px #0000008C'],
          type: 'shadow',
        }),
      ).to.eql(['0px 4px 12px #000000', '0px 8px 18px #0000008C']);
    });
  });

  it('does not transform hex values containing E', () => {
    expect(calc({ value: 'E6', type: 'other' })).to.equal('E6');
  });
});
