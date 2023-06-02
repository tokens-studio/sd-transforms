import { expect } from '@esm-bundle/chai';
import { DeepKeyTokenMap, SingleToken } from '@tokens-studio/types';
import { expandComposites } from '../../../src/parsers/expand-composites.js';
import { expandablesAsStringsArr } from '../../../src/TransformOptions.js';

const tokensInput = {
  composition: {
    foo: {
      value: {
        fontFamilies: '24px',
        fontSizes: '96',
        fontWeights: '500',
      },
      type: 'composition',
    },
  },
  typography: {
    foo: {
      value: {
        fontFamily: 'Arial',
        fontWeight: '500',
        lineHeight: '1.25',
        fontSize: '26',
      },
      type: 'typography',
    },
    ref: {
      value: '{typography.foo}',
      type: 'typography',
    },
  },
  border: {
    foo: {
      value: {
        color: '#FFFF00',
        strokeStyle: 'solid',
        borderWidth: '4',
      },
      type: 'border',
    },
  },
  shadow: {
    single: {
      value: {
        x: '0',
        y: '4',
        blur: '10',
        spread: '0',
        color: 'rgba(0,0,0,0.4)',
        type: 'innerShadow',
      },
      type: 'boxShadow',
    },
    double: {
      value: [
        {
          x: '0',
          y: '4',
          blur: '10',
          spread: '0',
          color: 'rgba(0,0,0,0.4)',
          type: 'innerShadow',
        },
        {
          x: '0',
          y: '8',
          blur: '12',
          spread: '5',
          color: 'rgba(0,0,0,0.4)',
        },
      ],
      type: 'boxShadow',
    },
  },
};

const tokensOutput = {
  composition: {
    foo: {
      fontFamilies: {
        value: '24px',
        type: 'fontFamilies',
      },
      fontSizes: {
        value: '96',
        type: 'fontSizes',
      },
      fontWeights: {
        value: '500',
        type: 'fontWeights',
      },
    },
  },
  typography: {
    foo: {
      fontFamily: {
        value: 'Arial',
        type: 'fontFamilies',
      },
      fontWeight: {
        value: '500',
        type: 'fontWeights',
      },
      lineHeight: {
        value: '1.25',
        type: 'lineHeights',
      },
      fontSize: {
        value: '26',
        type: 'fontSizes',
      },
    },
    ref: {
      fontFamily: {
        value: 'Arial',
        type: 'fontFamilies',
      },
      fontWeight: {
        value: '500',
        type: 'fontWeights',
      },
      lineHeight: {
        value: '1.25',
        type: 'lineHeights',
      },
      fontSize: {
        value: '26',
        type: 'fontSizes',
      },
    },
  },
  border: {
    foo: {
      color: {
        value: '#FFFF00',
        type: 'color',
      },
      strokeStyle: {
        value: 'solid',
        type: 'strokeStyle',
      },
      borderWidth: {
        value: '4',
        type: 'borderWidth',
      },
    },
  },
  shadow: {
    single: {
      x: {
        value: '0',
        type: 'dimension',
      },
      y: {
        value: '4',
        type: 'dimension',
      },
      blur: {
        value: '10',
        type: 'dimension',
      },
      spread: {
        value: '0',
        type: 'dimension',
      },
      color: {
        value: 'rgba(0,0,0,0.4)',
        type: 'color',
      },
      type: {
        value: 'innerShadow',
        type: 'other',
      },
    },
    double: {
      1: {
        x: {
          value: '0',
          type: 'dimension',
        },
        y: {
          value: '4',
          type: 'dimension',
        },
        blur: {
          value: '10',
          type: 'dimension',
        },
        spread: {
          value: '0',
          type: 'dimension',
        },
        color: {
          value: 'rgba(0,0,0,0.4)',
          type: 'color',
        },
        type: {
          value: 'innerShadow',
          type: 'other',
        },
      },
      2: {
        x: {
          value: '0',
          type: 'dimension',
        },
        y: {
          value: '8',
          type: 'dimension',
        },
        blur: {
          value: '12',
          type: 'dimension',
        },
        spread: {
          value: '5',
          type: 'dimension',
        },
        color: {
          value: 'rgba(0,0,0,0.4)',
          type: 'color',
        },
      },
    },
  },
};

describe('expand', () => {
  expandablesAsStringsArr.forEach(type => {
    type = type === 'boxShadow' ? 'shadow' : type;
    describe(`expand ${type}`, () => {
      it(`should expand ${type} tokens`, () => {
        expect(
          expandComposites({ [type]: tokensInput[type] }, 'foo/bar.json', {
            expand: { typography: true, border: true, shadow: true },
          }),
        ).to.eql({ [type]: tokensOutput[type] });
      });

      it(`should expand composition tokens by default`, () => {
        const output = type === 'composition' ? tokensOutput[type] : tokensInput[type];
        expect(expandComposites({ [type]: tokensInput[type] }, 'foo/bar.json')).to.eql({
          [type]: output,
        });
      });

      it('should not expand composition tokens when options dictate it should not', () => {
        expect(
          expandComposites({ [type]: tokensInput[type] }, 'foo/bar.json', {
            expand: { composition: false },
          }),
        ).to.eql({ [type]: tokensInput[type] });

        const filter = (_: SingleToken, filePath: string) => !filePath.startsWith('foo');

        expect(
          expandComposites({ [type]: tokensInput[type] }, 'foo/bar.json', {
            expand: { composition: filter, typography: filter, border: filter, shadow: filter },
          }),
        ).to.eql({ [type]: tokensInput[type] });
      });

      it('should expand composition tokens recursing multiple levels deep', () => {
        expect(
          expandComposites({ foo: { bar: { qux: tokensInput[type] } } }, 'foo/bar.json', {
            expand: { typography: true, border: true, shadow: true },
          }),
        ).to.eql({ foo: { bar: { qux: tokensOutput[type] } } });
      });
    });
  });

  it(`should allow a filter condition function for expanding tokens`, () => {
    expect(
      expandComposites(
        { typography: tokensInput.typography } as DeepKeyTokenMap<false>,
        'foo/bar.json',
        {
          expand: {
            typography: (_, filePath) => filePath === 'foo/bar.json',
          },
        },
      ),
    ).to.eql({ typography: tokensOutput.typography });

    expect(
      expandComposites(
        { typography: tokensInput.typography } as DeepKeyTokenMap<false>,
        'foo/bar.json',
        {
          expand: {
            typography: (_, filePath) => filePath === 'foo/qux.json',
          },
        },
      ),
    ).to.eql({ typography: tokensInput.typography });
  });

  it(`should handle when a token reference in a composite cannot be resolved`, () => {
    expect(
      expandComposites(
        {
          ref: {
            value: '{typography.foo}',
            type: 'typography',
          },
        } as DeepKeyTokenMap<false>,
        'foo/bar.json',
        {
          expand: {
            typography: true,
          },
        },
      ),
    ).to.eql({
      ref: {
        value: '{typography.foo}',
        type: 'typography',
      },
    });
  });
});
