import { expect } from '@esm-bundle/chai';
import { DeepKeyTokenMap } from '@tokens-studio/types';
import { addFontStyles } from '../../../src/parsers/add-font-styles.js';

const tokensInput = {
  italic: {
    value: {
      fontWeight: 'Bold Italic',
    },
    type: 'typography',
  },
  normal: {
    value: {
      fontWeight: 'Bold Normal',
    },
    type: 'typography',
  },
  oblique: {
    value: {
      fontWeight: 'Bold Oblique',
    },
    type: 'typography',
  },
  ref: {
    value: '{italic}',
    type: 'typography',
  },
};

const tokensOutput = {
  italic: {
    value: {
      fontWeight: 'Bold',
      fontStyle: 'italic',
    },
    type: 'typography',
  },
  normal: {
    value: {
      fontWeight: 'Bold',
      fontStyle: 'normal',
    },
    type: 'typography',
  },
  oblique: {
    value: {
      fontWeight: 'Bold',
      fontStyle: 'oblique',
    },
    type: 'typography',
  },
  ref: {
    value: {
      fontWeight: 'Bold',
      fontStyle: 'italic',
    },
    type: 'typography',
  },
};

describe('add font style', () => {
  it(`should expand composition tokens by default`, () => {
    expect(addFontStyles(tokensInput as DeepKeyTokenMap<false>)).to.eql(tokensOutput);
  });
});
