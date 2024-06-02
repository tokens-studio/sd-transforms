import { expect } from '@esm-bundle/chai';
import { DeepKeyTokenMap } from '@tokens-studio/types';
import { alignTypes } from '../../../src/preprocessors/align-types.js';

const tokenObj = {
  foo: {
    core: {
      color: {
        value: '#fff',
        type: 'color',
      },
      weight: {
        value: 400,
        type: 'fontWeights',
      },
    },
    semantic: {
      sizings: {
        lg: {
          value: '30px',
          type: 'sizing',
        },
      },
    },
  },
  bar: {
    button: {
      shadow: {
        value: [
          {
            x: '5px',
            y: '0',
            blur: '10px',
            spread: '5px',
            color: '#000000',
            type: 'innerShadow',
          },
        ],
        type: 'boxShadow',
      },
      shadowSingle: {
        value: {
          x: '5px',
          y: '0',
          blur: '10px',
          spread: '5px',
          color: '#000000',
          type: 'innerShadow',
        },
        type: 'boxShadow',
      },
    },
  },
} as DeepKeyTokenMap<false>;

const tokenObjAligned = {
  foo: {
    core: {
      color: {
        value: '#fff',
        type: 'color',
      },
      weight: {
        value: 400,
        type: 'fontWeight',
      },
    },
    semantic: {
      sizings: {
        lg: {
          value: '30px',
          type: 'dimension',
        },
      },
    },
  },
  bar: {
    button: {
      shadow: {
        value: [
          {
            offsetX: '5px',
            offsetY: '0',
            blur: '10px',
            spread: '5px',
            color: '#000000',
            type: 'innerShadow',
          },
        ],
        type: 'shadow',
      },
      shadowSingle: {
        value: {
          offsetX: '5px',
          offsetY: '0',
          blur: '10px',
          spread: '5px',
          color: '#000000',
          type: 'innerShadow',
        },
        type: 'shadow',
      },
    },
  },
};

const tokenObjDTCG = {
  foo: {
    core: {
      color: {
        $value: '#fff',
        $type: 'color',
      },
      weight: {
        $value: 400,
        $type: 'fontWeights',
      },
    },
    semantic: {
      sizings: {
        lg: {
          $value: '30px',
          $type: 'sizing',
        },
      },
    },
  },
  bar: {
    button: {
      shadow: {
        $value: [
          {
            x: '5px',
            y: '0',
            blur: '10px',
            spread: '5px',
            color: '#000000',
            type: 'innerShadow',
          },
        ],
        $type: 'boxShadow',
      },
      shadowSingle: {
        $value: {
          x: '5px',
          y: '0',
          blur: '10px',
          spread: '5px',
          color: '#000000',
          type: 'innerShadow',
        },
        $type: 'boxShadow',
      },
    },
  },
} as DeepKeyTokenMap<false>;

const tokenObjAlignedDTCG = {
  foo: {
    core: {
      color: {
        $value: '#fff',
        $type: 'color',
      },
      weight: {
        $value: 400,
        $type: 'fontWeight',
      },
    },
    semantic: {
      sizings: {
        lg: {
          $value: '30px',
          $type: 'dimension',
        },
      },
    },
  },
  bar: {
    button: {
      shadow: {
        $value: [
          {
            offsetX: '5px',
            offsetY: '0',
            blur: '10px',
            spread: '5px',
            color: '#000000',
            type: 'innerShadow',
          },
        ],
        $type: 'shadow',
      },
      shadowSingle: {
        $value: {
          offsetX: '5px',
          offsetY: '0',
          blur: '10px',
          spread: '5px',
          color: '#000000',
          type: 'innerShadow',
        },
        $type: 'shadow',
      },
    },
  },
};

describe('align types', () => {
  it('should align types from Tokens Studio to DTCG understood types', () => {
    expect(alignTypes(tokenObj)).to.eql(tokenObjAligned);
  });

  it('should align types from Tokens Studio DTCG formatted tokens to DTCG understood types', () => {
    expect(alignTypes(tokenObjDTCG)).to.eql(tokenObjAlignedDTCG);
  });
});
