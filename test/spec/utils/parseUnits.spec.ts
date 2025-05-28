import { expect } from 'chai';
import { parseUnits } from '../../../src/utils/parseUnits.js';

describe('parse units', () => {
  it('parses unit out of expression', () => {
    expect(parseUnits('4px + 4em +4').units).to.deep.equal(new Set(['px', 'em', '']));
    expect(parseUnits('1 +4').units).to.deep.equal(new Set(['']));
    expect(parseUnits('1*4rem').units).to.deep.equal(new Set(['rem', '']));
    expect(parseUnits('(2+4)').units).to.deep.equal(new Set(['']));
  });
});
