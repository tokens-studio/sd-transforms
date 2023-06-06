import { expect } from '@esm-bundle/chai';
import { mapDescriptionToComment } from '../../src/mapDescriptionToComment.js';

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

    expect(
      mapDescriptionToComment({
        type: 'dimension',
        value: '10px',
        description:
          'This is the first line.\nThis is the second line.\rThis is the third line.\r\nThis is the fourth line.',
      }),
    ).to.eql({
      type: 'dimension',
      value: '10px',
      description:
        'This is the first line.\nThis is the second line.\rThis is the third line.\r\nThis is the fourth line.',
      comment:
        'This is the first line. This is the second line. This is the third line. This is the fourth line.',
    });
  });
});
