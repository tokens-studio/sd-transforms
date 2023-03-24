import { expect } from '@esm-bundle/chai';
import { DesignToken } from 'style-dictionary';

export function runTransformSuite(transformer: (value: unknown) => unknown, token?: DesignToken) {
  describe('Test Suite: Transforms', () => {
    it('returns undefined if a token value is undefined, which can happen when there are broken references in token values', () => {
      // Most transformers only are passed the token value, but in some transformers, the full token object is passed
      if (token) {
        expect(transformer({ ...token, value: undefined })).to.equal(undefined);
      } else {
        expect(transformer(undefined)).to.equal(undefined);
      }
    });
  });
}
