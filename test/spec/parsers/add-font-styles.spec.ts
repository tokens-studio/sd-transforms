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
  italicOnly: {
    value: {
      fontWeight: 'Italic',
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
  fwRef: {
    value: 'SemiBold Italic',
    type: 'fontWeights',
  },
  usesFwRef: {
    value: {
      fontWeight: '{fwRef}',
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
  italicOnly: {
    value: {
      fontWeight: 'Regular',
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
  fwRef: {
    value: 'SemiBold Italic',
    type: 'fontWeights',
  },
  // since we are referencing a fontWeights token that has fontStyle,
  // we can resolve the reference and create the fontStyle prop
  usesFwRef: {
    value: {
      fontWeight: 'SemiBold',
      fontStyle: 'italic',
    },
    type: 'typography',
  },
  // Keep full typo reference "as is", the referred token will be transformed as needed
  ref: {
    value: '{italic}',
    type: 'typography',
  },
};

describe('add font style', () => {
  it(`should expand composition tokens by default`, () => {
    expect(addFontStyles(tokensInput as DeepKeyTokenMap<false>)).to.eql(tokensOutput);
  });

  it(`should ignore broken fontWeight reference`, () => {
    const inputTokens = {
      usesFwRef: {
        value: {
          fontWeight: '{fwRef}',
        },
        type: 'typography',
      },
    };

    expect(addFontStyles(inputTokens as DeepKeyTokenMap<false>)).to.eql(inputTokens);
  });

  it(`allows always adding a default fontStyle`, () => {
    expect(
      addFontStyles(
        {
          foo: {
            value: {
              fontWeight: 'Bold',
            },
            type: 'typography',
          },
        } as DeepKeyTokenMap<false>,
        { alwaysAddFontStyle: true },
      ),
    ).to.eql({
      foo: {
        value: {
          fontWeight: 'Bold',
          fontStyle: 'normal',
        },
        type: 'typography',
      },
    });
  });
});
