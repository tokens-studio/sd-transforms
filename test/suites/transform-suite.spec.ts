import { expect } from '@esm-bundle/chai';
import { DesignToken } from 'style-dictionary/types';

export function runTransformSuite(transform: (value: unknown) => unknown, token?: DesignToken) {
  describe('Test Suite: Transforms', () => {
    it('returns undefined if a token value is undefined, which can happen when there are broken references in token values', () => {
      // Most transforms only are passed the token value, but in some transforms, the full token object is passed
      if (token) {
        expect(transform({ ...token, value: undefined })).to.equal(undefined);
      } else {
        expect(transform(undefined)).to.equal(undefined);
      }
    });
  });
}
