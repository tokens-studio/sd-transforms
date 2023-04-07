import { expect } from '@esm-bundle/chai';
import { SingleToken } from '@tokens-studio/types';
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
        fontFamilies: 'Arial',
        fontWeights: '500',
        lineHeights: '1.25',
        fontSizes: '26',
      },
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
      fontFamilies: {
        value: 'Arial',
        type: 'fontFamilies',
      },
      fontWeights: {
        value: '500',
        type: 'fontWeights',
      },
      lineHeights: {
        value: '1.25',
        type: 'lineHeights',
      },
      fontSizes: {
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
          expandComposites(tokensInput[type], 'foo/bar.json', {
            expand: { typography: true, border: true, shadow: true },
          }),
        ).to.eql(tokensOutput[type]);
      });

      it('should not expand composition tokens when options dictate it should not', () => {
        expect(
          expandComposites(tokensInput[type], 'foo/bar.json', {
            expand: { composition: false },
          }),
        ).to.eql(tokensInput[type]);

        const filter = (_: SingleToken, filePath: string) => !filePath.startsWith('foo');

        expect(
          expandComposites(tokensInput[type], 'foo/bar.json', {
            expand: { composition: filter, typography: filter, border: filter, shadow: filter },
          }),
        ).to.eql(tokensInput[type]);
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
});
