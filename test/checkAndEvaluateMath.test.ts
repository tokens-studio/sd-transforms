import { expect } from '@esm-bundle/chai';
import { checkAndEvaluateMath } from '../src/checkAndEvaluateMath';

describe('check and evaluate math', () => {
  it('checks and evaluates math expressions', () => {
    expect(checkAndEvaluateMath('4px')).to.equal('4px');
    expect(checkAndEvaluateMath('4 * 7')).to.equal('28');
    expect(checkAndEvaluateMath('4 * 7px')).to.equal('28px');
    expect(checkAndEvaluateMath('(15 + 20 - 17 * 8 / 3) * 7px')).to.equal('-72.333px');
  });

  it('cannot evaluate math expressions where more than one token has a unit', () => {
    expect(checkAndEvaluateMath('4px * 7px')).to.equal('4px * 7px');
    expect(checkAndEvaluateMath('4 * 7px * 8px')).to.equal('4 * 7px * 8px');
  });

  it('supports multi-value expressions with math expressions', () => {
    expect(checkAndEvaluateMath('8 / 4 * 7px 8 * 5px 2 * 4px')).to.equal('14px 40px 8px');
    expect(checkAndEvaluateMath('5px + 4px + 10px 3 * 2px')).to.equal('19px 6px');
    expect(checkAndEvaluateMath('5px 3 * 2px')).to.equal('5px 6px');
    expect(checkAndEvaluateMath('3 * 2px 5px')).to.equal('6px 5px');
  });
});
