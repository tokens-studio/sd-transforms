import { expect } from '@esm-bundle/chai';
import { DeepKeyTokenMap } from '@tokens-studio/types';
import { excludeParentKeys } from '../../../src/parsers/exclude-parent-keys.js';

const tokenObj = {
  foo: {
    core: {
      color: {
        value: '#FFFFFF',
        type: 'color',
      },
    },
    semantic: {
      color: {
        value: '{core.color}',
        type: 'color',
      },
    },
  },
  bar: {
    button: {
      color: {
        value: '{semantic.color}',
        type: 'color',
      },
    },
  },
} as DeepKeyTokenMap<false>;

describe('exclude parent keys', () => {
  it('should not exclude parent keys by default', () => {
    expect(excludeParentKeys(tokenObj)).to.eql(tokenObj);
    expect(excludeParentKeys(tokenObj, { excludeParentKeys: false })).to.eql(tokenObj);
  });

  it('should exclude parent keys if the option is passed', () => {
    expect(excludeParentKeys(tokenObj, { excludeParentKeys: true })).to.eql({
      core: {
        color: {
          value: '#FFFFFF',
          type: 'color',
        },
      },
      semantic: {
        color: {
          value: '{core.color}',
          type: 'color',
        },
      },
      button: {
        color: {
          value: '{semantic.color}',
          type: 'color',
        },
      },
    });
  });
});
