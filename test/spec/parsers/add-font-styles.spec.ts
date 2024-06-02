import { expect } from '@esm-bundle/chai';
import { stubMethod, restore } from 'hanbi';
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
  it(`should expand fontweight properties inside typography tokens by default`, () => {
    expect(addFontStyles(tokensInput as DeepKeyTokenMap<false>)).to.eql(tokensOutput);
  });

  it(`should expand fontweight tokens by default`, () => {
    expect(
      addFontStyles({
        // @ts-expect-error fontWeight (singular vs plural) doesn't exist on the type
        // but we assume it's already preprocessed and aligned here
        fw: { value: 'SemiBold Italic', type: 'fontWeight' },
      }),
    ).to.eql({
      fw: { value: 'SemiBold', type: 'fontWeight' },
      fontStyle: { value: 'italic', type: 'fontStyle' },
    });
  });

  it(`throw when encountering a broken fontWeight reference`, () => {
    const stub = stubMethod(console, 'error');
    const inputTokens = {
      usesFwRef: {
        value: {
          fontWeight: '{fwRef}',
        },
        type: 'typography',
      },
    };

    addFontStyles(inputTokens as DeepKeyTokenMap<false>);
    restore();

    expect(stub.calls.size).to.equal(1);
    expect(stub.firstCall?.args[0].message).to.equal(
      `tries to reference fwRef, which is not defined.`,
    );
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

  it('does not error on value property equaling null', () => {
    expect(
      addFontStyles({
        foo: {
          value: {
            fontWeight: 'Bold',
            type: null,
          },
          type: 'typography',
        },
      } as DeepKeyTokenMap<false>),
    ).to.eql({
      foo: {
        value: {
          fontWeight: 'Bold',
          type: null,
        },
        type: 'typography',
      },
    });
  });
});
