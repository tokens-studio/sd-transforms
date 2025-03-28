import { expect } from 'chai';
import { checkAndEvaluateMath } from '../../src/checkAndEvaluateMath.js';
import { runTransformSuite } from '../suites/transform-suite.spec.js';
import { cleanup, init } from '../integration/utils.js';
import { TransformedToken } from 'style-dictionary/types';

runTransformSuite(checkAndEvaluateMath as (value: unknown) => unknown, {});

describe('check and evaluate math', () => {
  it('checks and evaluates math expressions', () => {
    expect(
      checkAndEvaluateMath({ value: '4*1.5px 4*1.5px 4*1.5px', type: 'dimension' }, 4),
    ).to.equal('6px 6px 6px');
    expect(checkAndEvaluateMath({ value: '4px', type: 'dimension' }, 4)).to.equal('4px');
    expect(checkAndEvaluateMath({ value: '4 * 7', type: 'dimension' }, 4)).to.equal(28);
    expect(checkAndEvaluateMath({ value: '4 * 7px', type: 'dimension' }, 4)).to.equal('28px');
    expect(checkAndEvaluateMath({ value: '4 * 7rem', type: 'dimension' }, 4)).to.equal('28rem');
    expect(
      checkAndEvaluateMath({ value: '(15 + 20 - 17 * 8 / 3) * 7px', type: 'dimension' }, 4),
    ).to.equal('-72.3333px');
  });

  it('supports expression of type number', () => {
    expect(checkAndEvaluateMath({ value: 10, type: 'number' }, 4)).to.equal(10);
  });

  it('can evaluate math expressions where more than one token has a unit, in case of px', () => {
    expect(checkAndEvaluateMath({ value: '4px * 7px', type: 'dimension' }, 4)).to.equal('28px');
    expect(checkAndEvaluateMath({ value: '4 * 7px * 8px', type: 'dimension' }, 4)).to.equal(
      '224px',
    );
  });

  it('can evaluate math expressions where more than one token has a unit, assuming no mixed units are used', () => {
    expect(checkAndEvaluateMath({ value: '4em + 7em', type: 'dimension' }, 4)).to.equal('11em');
    expect(checkAndEvaluateMath({ value: '4 + 7rem', type: 'dimension' }, 4)).to.equal('4 + 7rem');
    expect(checkAndEvaluateMath({ value: '4em + 7rem', type: 'dimension' }, 4)).to.equal(
      '4em + 7rem',
    );
  });

  it('can evaluate mixed units if operators are exclusively multiplication and the mix is px or unitless', () => {
    expect(checkAndEvaluateMath({ value: '4 * 7em * 8em', type: 'dimension' }, 4)).to.equal(
      '224em',
    );
    expect(checkAndEvaluateMath({ value: '4px * 7em', type: 'dimension' }, 4)).to.equal('28em');
    // 50em would be incorrect when dividing, as em grows, result should shrink, but doesn't
    expect(checkAndEvaluateMath({ value: '1000 / 20em', type: 'dimension' }, 4)).to.equal(
      '1000 / 20em',
    );
    // cannot be expressed/resolved without knowing the value of em
    expect(checkAndEvaluateMath({ value: '4px + 7em', type: 'dimension' }, 4)).to.equal(
      '4px + 7em',
    );
  });

  it('can evaluate math expressions where more than one token has a unit, as long as for each piece of the expression the unit is the same', () => {
    // can resolve them, because all values share the same unit
    expect(checkAndEvaluateMath({ value: '5px * 4px / 2px', type: 'dimension' }, 4)).to.equal(
      '10px',
    );
    expect(checkAndEvaluateMath({ value: '10vw + 20vw', type: 'dimension' }, 4)).to.equal('30vw');

    // cannot resolve them, because em is dynamic and 20/20px is static value
    expect(checkAndEvaluateMath({ value: '2em + 20', type: 'dimension' }, 4)).to.equal('2em + 20');
    expect(checkAndEvaluateMath({ value: '2em + 20px', type: 'dimension' }, 4)).to.equal(
      '2em + 20px',
    );

    // can resolve them, because multiplying by pixels/unitless is possible, regardless of the other value's unit
    expect(checkAndEvaluateMath({ value: '2pt * 4', type: 'dimension' }, 4)).to.equal('8pt');
    expect(checkAndEvaluateMath({ value: '2em * 20px', type: 'dimension' }, 4)).to.equal('40em');
  });

  it('supports multi-value expressions with math expressions', () => {
    expect(
      checkAndEvaluateMath({ value: '8 / 4 * 7px 8 * 5px 2 * 4px', type: 'dimension' }, 4),
    ).to.equal('14px 40px 8px');
    expect(
      checkAndEvaluateMath({ value: '5px + 4px + 10px 3 * 2px', type: 'dimension' }, 4),
    ).to.equal('19px 6px');
    expect(checkAndEvaluateMath({ value: '5px 3 * 2px', type: 'dimension' }, 4)).to.equal(
      '5px 6px',
    );
    expect(checkAndEvaluateMath({ value: '3 * 2px 5px', type: 'dimension' }, 4)).to.equal(
      '6px 5px',
    );
    // smoke test: this value has spaces as well but should be handled normally
    expect(
      checkAndEvaluateMath(
        {
          value: 'linear-gradient(90deg, #354752 0%, #0b0d0e 100%)',
          type: 'dimension',
        },
        4,
      ),
    ).to.equal('linear-gradient(90deg, #354752 0%, #0b0d0e 100%)');
  });

  it('supports expr-eval expressions', () => {
    expect(checkAndEvaluateMath({ value: 'roundTo(4 / 7, 1)', type: 'dimension' }, 4)).to.equal(
      0.6,
    );
    expect(
      checkAndEvaluateMath({ value: '8 * 14px roundTo(4 / 7, 1)', type: 'dimension' }, 4),
    ).to.equal('112px 0.6');
    expect(
      checkAndEvaluateMath({ value: 'roundTo(4 / 7, 1) 8 * 14px', type: 'dimension' }, 4),
    ).to.equal('0.6 112px');
    expect(
      checkAndEvaluateMath({ value: 'min(10, 24, 5, 12, 6) 8 * 14px', type: 'dimension' }, 4),
    ).to.equal('5 112px');
    expect(
      checkAndEvaluateMath({ value: 'ceil(roundTo(16/1.2,0)/2)*2', type: 'dimension' }, 4),
    ).to.equal(14);
  });

  it('supports expr-eval expressions with units', () => {
    expect(checkAndEvaluateMath({ value: 'roundTo(4px / 7, 1)', type: 'dimension' }, 4)).to.equal(
      '0.6px',
    );
    expect(
      checkAndEvaluateMath({ value: '8 * 14px roundTo(4 / 7px, 1)', type: 'dimension' }, 4),
    ).to.equal('112px 0.6px');
    expect(
      checkAndEvaluateMath({ value: 'roundTo(4px / 7px, 1) 8 * 14px', type: 'dimension' }, 4),
    ).to.equal('0.6px 112px');
    expect(
      checkAndEvaluateMath(
        {
          value: 'min(10px, 24px, 5px, 12px, 6px) 8 * 14px',
          type: 'dimension',
        },
        4,
      ),
    ).to.equal('5px 112px');
    expect(
      checkAndEvaluateMath({ value: 'ceil(roundTo(16px/1.2,0)/2)*2', type: 'dimension' }, 4),
    ).to.equal('14px');
  });

  it('should support expr eval expressions in combination with regular math', () => {
    expect(
      checkAndEvaluateMath({ value: 'roundTo(4 / 7, 1) * 24', type: 'dimension' }, 4),
    ).to.equal(14.4);
  });

  it('does not unnecessarily remove wrapped quotes around font-family values', () => {
    expect(
      checkAndEvaluateMath({ value: `800 italic 16px/1 'Arial Black'`, type: 'dimension' }, 4),
    ).to.equal(`800 italic 16px/1 'Arial Black'`);
  });

  it('does not unnecessarily change the type of the value', () => {
    expect(checkAndEvaluateMath({ value: 11, type: 'number' }, 4)).to.equal(11);
    // changes to number because the expression is a math expression evaluating to a number result
    expect(checkAndEvaluateMath({ value: '11 * 5', type: 'dimension' }, 4)).to.equal(55);
    // keeps it as string because there is no math expression to evaluate, so just keep it as is
    expect(checkAndEvaluateMath({ value: '11', type: 'dimension' }, 4)).to.equal('11');
  });

  it('supports values that contain spaces and strings, e.g. a date format', () => {
    expect(checkAndEvaluateMath({ value: `dd/MM/yyyy 'om' HH:mm`, type: 'date' }, 4)).to.equal(
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

  it('supports boolean values', () => {
    expect(checkAndEvaluateMath({ value: false, type: 'boolean' }, 4)).to.equal(false);
    expect(checkAndEvaluateMath({ value: true, type: 'boolean' }, 4)).to.equal(true);
  });

  it('supports DTCG tokens', () => {
    expect(checkAndEvaluateMath({ $value: '4 * 7px', $type: 'dimension' }, 4)).to.equal('28px');
  });

  describe('composite type tokens', () => {
    it('supports typography values', () => {
      expect(
        checkAndEvaluateMath(
          {
            value: {
              fontFamily: 'Arial',
              fontWeight: '100 * 3',
              fontSize: '16px * 1.5',
              lineHeight: 1,
            },
            type: 'typography',
          },
          4,
        ),
      ).to.eql({
        fontFamily: 'Arial',
        fontWeight: 300,
        fontSize: '24px',
        lineHeight: 1,
      });
    });

    it('supports shadow values', () => {
      expect(
        checkAndEvaluateMath(
          {
            value: {
              offsetX: '2*2px',
              offsetY: '2*4px',
              blur: '2*8px',
              spread: '2*6px',
              color: '#000',
            },
            type: 'shadow',
          },
          4,
        ),
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
        checkAndEvaluateMath(
          {
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
          },
          4,
        ),
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
        checkAndEvaluateMath(
          {
            value: {
              width: '6px / 4',
              style: 'solid',
              color: '#000',
            },
            type: 'typography',
          },
          4,
        ),
      ).to.eql({
        width: '1.5px',
        style: 'solid',
        color: '#000',
      });
    });

    it('keeps values of type "object" that are not actual objects as is', () => {
      expect(
        checkAndEvaluateMath(
          {
            value: ['0px 4px 12px #000000', '0px 8px 18px #0000008C'],
            type: 'shadow',
          },
          4,
        ),
      ).to.eql(['0px 4px 12px #000000', '0px 8px 18px #0000008C']);
    });
  });

  it('does not transform hex values containing E', () => {
    expect(checkAndEvaluateMath({ value: 'E6', type: 'other' }, 4)).to.equal('E6');
  });
});
