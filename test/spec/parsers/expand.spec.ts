import { expect } from '@esm-bundle/chai';
import { stubMethod, restore } from 'hanbi';
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
      meta: 'foo-comp',
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
      meta: 'foo-typo',
    },
    ref: {
      value: '{typography.foo}',
      type: 'typography',
      meta: 'foo-typo-ref',
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
      meta: 'foo-border',
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
      meta: 'foo-shadow',
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
      meta: 'foo-shadow-double',
    },
    ref: {
      value: '{shadow.double}',
      type: 'boxShadow',
      meta: 'foo-shadow-ref',
    },
  },
};

const tokensOutput = {
  composition: {
    foo: {
      fontFamilies: {
        value: '24px',
        type: 'fontFamilies',
        meta: 'foo-comp',
      },
      fontSizes: {
        value: '96',
        type: 'fontSizes',
        meta: 'foo-comp',
      },
      fontWeights: {
        value: '500',
        type: 'fontWeights',
        meta: 'foo-comp',
      },
    },
  },
  typography: {
    foo: {
      fontFamily: {
        value: 'Arial',
        type: 'fontFamilies',
        meta: 'foo-typo',
      },
      fontWeight: {
        value: '500',
        type: 'fontWeights',
        meta: 'foo-typo',
      },
      lineHeight: {
        value: '1.25',
        type: 'lineHeights',
        meta: 'foo-typo',
      },
      fontSize: {
        value: '26',
        type: 'fontSizes',
        meta: 'foo-typo',
      },
    },
    ref: {
      fontFamily: {
        value: 'Arial',
        type: 'fontFamilies',
        meta: 'foo-typo-ref',
      },
      fontWeight: {
        value: '500',
        type: 'fontWeights',
        meta: 'foo-typo-ref',
      },
      lineHeight: {
        value: '1.25',
        type: 'lineHeights',
        meta: 'foo-typo-ref',
      },
      fontSize: {
        value: '26',
        type: 'fontSizes',
        meta: 'foo-typo-ref',
      },
    },
  },
  border: {
    foo: {
      color: {
        value: '#FFFF00',
        type: 'color',
        meta: 'foo-border',
      },
      strokeStyle: {
        value: 'solid',
        type: 'strokeStyle',
        meta: 'foo-border',
      },
      borderWidth: {
        value: '4',
        type: 'borderWidth',
        meta: 'foo-border',
      },
    },
  },
  shadow: {
    single: {
      x: {
        value: '0',
        type: 'dimension',
        meta: 'foo-shadow',
      },
      y: {
        value: '4',
        type: 'dimension',
        meta: 'foo-shadow',
      },
      blur: {
        value: '10',
        type: 'dimension',
        meta: 'foo-shadow',
      },
      spread: {
        value: '0',
        type: 'dimension',
        meta: 'foo-shadow',
      },
      color: {
        value: 'rgba(0,0,0,0.4)',
        type: 'color',
        meta: 'foo-shadow',
      },
      type: {
        value: 'innerShadow',
        type: 'other',
        meta: 'foo-shadow',
      },
    },
    double: {
      1: {
        x: {
          value: '0',
          type: 'dimension',
          meta: 'foo-shadow-double',
        },
        y: {
          value: '4',
          type: 'dimension',
          meta: 'foo-shadow-double',
        },
        blur: {
          value: '10',
          type: 'dimension',
          meta: 'foo-shadow-double',
        },
        spread: {
          value: '0',
          type: 'dimension',
          meta: 'foo-shadow-double',
        },
        color: {
          value: 'rgba(0,0,0,0.4)',
          type: 'color',
          meta: 'foo-shadow-double',
        },
        type: {
          value: 'innerShadow',
          type: 'other',
          meta: 'foo-shadow-double',
        },
      },
      2: {
        x: {
          value: '0',
          type: 'dimension',
          meta: 'foo-shadow-double',
        },
        y: {
          value: '8',
          type: 'dimension',
          meta: 'foo-shadow-double',
        },
        blur: {
          value: '12',
          type: 'dimension',
          meta: 'foo-shadow-double',
        },
        spread: {
          value: '5',
          type: 'dimension',
          meta: 'foo-shadow-double',
        },
        color: {
          value: 'rgba(0,0,0,0.4)',
          type: 'color',
          meta: 'foo-shadow-double',
        },
      },
    },
    ref: {
      1: {
        x: {
          value: '0',
          type: 'dimension',
          meta: 'foo-shadow-ref',
        },
        y: {
          value: '4',
          type: 'dimension',
          meta: 'foo-shadow-ref',
        },
        blur: {
          value: '10',
          type: 'dimension',
          meta: 'foo-shadow-ref',
        },
        spread: {
          value: '0',
          type: 'dimension',
          meta: 'foo-shadow-ref',
        },
        color: {
          value: 'rgba(0,0,0,0.4)',
          type: 'color',
          meta: 'foo-shadow-ref',
        },
        type: {
          value: 'innerShadow',
          type: 'other',
          meta: 'foo-shadow-ref',
        },
      },
      2: {
        x: {
          value: '0',
          type: 'dimension',
          meta: 'foo-shadow-ref',
        },
        y: {
          value: '8',
          type: 'dimension',
          meta: 'foo-shadow-ref',
        },
        blur: {
          value: '12',
          type: 'dimension',
          meta: 'foo-shadow-ref',
        },
        spread: {
          value: '5',
          type: 'dimension',
          meta: 'foo-shadow-ref',
        },
        color: {
          value: 'rgba(0,0,0,0.4)',
          type: 'color',
          meta: 'foo-shadow-ref',
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
          expandComposites(
            { [type]: tokensInput[type] },
            {
              expand: { typography: true, border: true, shadow: true },
            },
          ),
        ).to.eql({ [type]: tokensOutput[type] });
      });

      it(`should expand composition tokens by default`, () => {
        const output = type === 'composition' ? tokensOutput[type] : tokensInput[type];
        expect(expandComposites({ [type]: tokensInput[type] })).to.eql({
          [type]: output,
        });
      });

      it('should not expand composition tokens when options dictate it should not', () => {
        expect(
          expandComposites(
            { [type]: tokensInput[type] },
            {
              expand: { composition: false },
            },
          ),
        ).to.eql({ [type]: tokensInput[type] });

        const filter = (_: SingleToken, filePath?: string) => {
          return !filePath?.startsWith('foo');
        };

        const output = expandComposites(
          { [type]: tokensInput[type] },
          {
            expand: { composition: filter, typography: filter, border: filter, shadow: filter },
          },
          'foo/bar.json',
        );

        expect(output).to.eql({ [type]: tokensInput[type] });
      });
    });
  });

  it('should expand composition tokens recursing multiple levels deep', () => {
    const input = {
      foo: {
        bar: {
          qux: {
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
                value: '{foo.bar.qux.typography.foo}',
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
              ref: {
                value: '{foo.bar.qux.shadow.double}',
                type: 'boxShadow',
              },
            },
          },
        },
      },
    } as DeepKeyTokenMap<false>;

    const output = {
      foo: {
        bar: {
          qux: {
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
              ref: {
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
          },
        },
      },
      // casting to unknown because strokeStyle is not a recognized type by Tokens Studio, we create this type by expanding border tokens
    } as unknown as DeepKeyTokenMap<false>;

    expect(
      expandComposites(
        input,
        {
          expand: { typography: true, border: true, shadow: true },
        },
        'foo/bar.json',
      ),
    ).to.eql(output);
  });

  it(`should allow a filter condition function for expanding tokens`, () => {
    expect(
      expandComposites(
        { typography: tokensInput.typography } as DeepKeyTokenMap<false>,
        {
          expand: {
            typography: (_, filePath) => filePath === 'foo/bar.json',
          },
        },
        'foo/bar.json',
      ),
    ).to.eql({ typography: tokensOutput.typography });

    expect(
      expandComposites(
        { typography: tokensInput.typography } as DeepKeyTokenMap<false>,
        {
          expand: {
            typography: (_, filePath) => filePath === 'foo/qux.json',
          },
        },
        'foo/bar.json',
      ),
    ).to.eql({ typography: tokensInput.typography });
  });

  it(`should throw when token reference in a composite cannot be resolved`, () => {
    const stub = stubMethod(console, 'error');
    expandComposites(
      {
        ref: {
          value: '{typography.foo}',
          type: 'typography',
        },
      } as DeepKeyTokenMap<false>,
      {
        expand: {
          typography: true,
        },
      },
      'foo/bar.json',
    );

    restore();

    expect(stub.calls.size).to.equal(1);
    expect(stub.firstCall?.args[0].message).to.equal(
      `tries to reference typography.foo, which is not defined.`,
    );
  });

  it('should not trip up when the recursed token contains a primitive value', () => {
    expect(
      expandComposites(
        {
          value: '#ffffff',
          type: 'color',
          comment: null,
        } as SingleToken<false>,
        { expand: { typography: true } },
        'foo/bar.json',
      ),
    );
  });

  it('should support w3c syntax and expand into w3c syntax if it encounters this', () => {
    expect(
      expandComposites(
        {
          foo: {
            $value: {
              fontFamily: 'Arial',
              fontWeight: '500',
              lineHeight: '1.25',
              fontSize: '26',
            },
            $type: 'typography',
          },
          ref: {
            $value: '{foo}',
            $type: 'typography',
          },
          shadow: {
            $value: [
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
            $type: 'boxShadow',
          },
          shadowRef: {
            $value: '{shadow}',
            $type: 'boxShadow',
          },
        } as DeepKeyTokenMap<false>,
        { expand: { typography: true, shadow: true } },
      ),
    ).to.eql({
      foo: {
        fontFamily: {
          $value: 'Arial',
          $type: 'fontFamilies',
        },
        fontWeight: {
          $value: '500',
          $type: 'fontWeights',
        },
        lineHeight: {
          $value: '1.25',
          $type: 'lineHeights',
        },
        fontSize: {
          $value: '26',
          $type: 'fontSizes',
        },
      },
      ref: {
        fontFamily: {
          $value: 'Arial',
          $type: 'fontFamilies',
        },
        fontWeight: {
          $value: '500',
          $type: 'fontWeights',
        },
        lineHeight: {
          $value: '1.25',
          $type: 'lineHeights',
        },
        fontSize: {
          $value: '26',
          $type: 'fontSizes',
        },
      },
      shadow: {
        '1': {
          blur: {
            $value: '10',
            $type: 'dimension',
          },
          color: {
            $value: 'rgba(0,0,0,0.4)',
            $type: 'color',
          },
          spread: {
            $value: '0',
            $type: 'dimension',
          },
          type: {
            $value: 'innerShadow',
            $type: 'other',
          },
          x: {
            $value: '0',
            $type: 'dimension',
          },
          y: {
            $value: '4',
            $type: 'dimension',
          },
        },
        '2': {
          blur: {
            $value: '12',
            $type: 'dimension',
          },
          color: {
            $value: 'rgba(0,0,0,0.4)',
            $type: 'color',
          },
          spread: {
            $value: '5',
            $type: 'dimension',
          },
          x: {
            $value: '0',
            $type: 'dimension',
          },
          y: {
            $value: '8',
            $type: 'dimension',
          },
        },
      },
      shadowRef: {
        '1': {
          blur: {
            $value: '10',
            $type: 'dimension',
          },
          color: {
            $value: 'rgba(0,0,0,0.4)',
            $type: 'color',
          },
          spread: {
            $value: '0',
            $type: 'dimension',
          },
          type: {
            $value: 'innerShadow',
            $type: 'other',
          },
          x: {
            $value: '0',
            $type: 'dimension',
          },
          y: {
            $value: '4',
            $type: 'dimension',
          },
        },
        '2': {
          blur: {
            $value: '12',
            $type: 'dimension',
          },
          color: {
            $value: 'rgba(0,0,0,0.4)',
            $type: 'color',
          },
          spread: {
            $value: '5',
            $type: 'dimension',
          },
          x: {
            $value: '0',
            $type: 'dimension',
          },
          y: {
            $value: '8',
            $type: 'dimension',
          },
        },
      },
    });
  });
});
