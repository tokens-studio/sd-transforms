import { expect } from '@esm-bundle/chai';
import { mapDescriptionToComment } from '../src/mapDescriptionToComment';

describe('map description to comment', () => {
  it('maps the token description to a style dictionary comment attribute', () => {
    expect(
      mapDescriptionToComment({
        type: 'dimension',
        value: '10px',
        description: 'Some description about the token',
      }),
    ).to.eql({
      type: 'dimension',
      value: '10px',
      description: 'Some description about the token',
      comment: 'Some description about the token',
    });
  });
});
