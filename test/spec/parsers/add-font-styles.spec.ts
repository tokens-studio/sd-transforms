import { expect } from '@esm-bundle/chai';
import { DeepKeyTokenMap } from '@tokens-studio/types';
import { addFontStyles } from '../../../src/parsers/add-font-styles.js';

const tokensInput = {
  foo: {
    value: {
      fontFamily: 'Arial',
      fontWeight: 'Bold Italic',
      lineHeight: '1.25',
      fontSize: '26',
    },
    type: 'typography',
  },
  ref: {
    value: '{foo}',
    type: 'typography',
  },
};

const tokensOutput = {
  foo: {
    value: {
      fontFamily: 'Arial',
      fontWeight: 'Bold',
      fontStyle: 'italic',
      lineHeight: '1.25',
      fontSize: '26',
    },
    type: 'typography',
  },
  ref: {
    value: {
      fontFamily: 'Arial',
      fontWeight: 'Bold',
      fontStyle: 'italic',
      lineHeight: '1.25',
      fontSize: '26',
    },
    type: 'typography',
  },
};

describe('add font style', () => {
  it.only(`should expand composition tokens by default`, () => {
    expect(addFontStyles(tokensInput as DeepKeyTokenMap<false>)).to.eql(tokensOutput);
  });
});
