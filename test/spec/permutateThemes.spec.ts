import { expect } from '@esm-bundle/chai';
import { TokenSetStatus } from '@tokens-studio/types';
import { permutateThemes } from '../../src/permutateThemes.js';

const source = 'source' as TokenSetStatus;
const enabled = 'enabled' as TokenSetStatus;
const disabled = 'disabled' as TokenSetStatus;

describe('transform dimension', () => {
  it('combines multiple dimensions of theming into a single-dimensional theme permutation', () => {
    expect(
      permutateThemes([
        {
          id: '0',
          name: 'light',
          group: 'theme',
          selectedTokenSets: {
            core: source,
            light: enabled,
            theme: enabled,
          },
        },
        {
          id: '1',
          name: 'dark',
          group: 'theme',
          selectedTokenSets: {
            core: source,
            dark: enabled,
            theme: enabled,
          },
        },
        {
          id: '2',
          name: 'foo',
          group: 'thing',
          selectedTokenSets: {
            core: source,
            foo: enabled,
            thing: enabled,
          },
        },
        {
          id: '3',
          name: 'bar',
          group: 'thing',
          selectedTokenSets: {
            core: source,
            bar: enabled,
            thing: enabled,
          },
        },
      ]),
    ).to.eql({
      'dark-bar': ['core', 'dark', 'theme', 'bar', 'thing'],
      'dark-foo': ['core', 'dark', 'theme', 'foo', 'thing'],
      'light-bar': ['core', 'light', 'theme', 'bar', 'thing'],
      'light-foo': ['core', 'light', 'theme', 'foo', 'thing'],
    });
  });

  it('allows passing a separator in the options', () => {
    expect(
      permutateThemes(
        [
          {
            id: '0',
            name: 'light',
            group: 'theme',
            selectedTokenSets: {
              core: source,
              light: enabled,
              theme: enabled,
            },
          },
          {
            id: '1',
            name: 'dark',
            group: 'theme',
            selectedTokenSets: {
              core: source,
              dark: enabled,
              theme: enabled,
            },
          },
          {
            id: '2',
            name: 'foo',
            group: 'thing',
            selectedTokenSets: {
              core: source,
              foo: enabled,
              thing: enabled,
            },
          },
          {
            id: '3',
            name: 'bar',
            group: 'thing',
            selectedTokenSets: {
              core: source,
              bar: enabled,
              thing: enabled,
            },
          },
        ],
        { separator: '_' },
      ),
    ).to.eql({
      dark_bar: ['core', 'dark', 'theme', 'bar', 'thing'],
      dark_foo: ['core', 'dark', 'theme', 'foo', 'thing'],
      light_bar: ['core', 'light', 'theme', 'bar', 'thing'],
      light_foo: ['core', 'light', 'theme', 'foo', 'thing'],
    });
  });

  it('allows only 1 dimension', () => {
    expect(
      permutateThemes([
        {
          id: '0',
          name: 'light',
          group: 'theme',
          selectedTokenSets: {
            core: source,
            light: enabled,
            theme: enabled,
          },
        },
        {
          id: '1',
          name: 'dark',
          group: 'theme',
          selectedTokenSets: {
            core: source,
            dark: enabled,
            theme: enabled,
          },
        },
      ]),
    ).to.eql({
      dark: ['core', 'dark', 'theme'],
      light: ['core', 'light', 'theme'],
    });
  });

  it('orders enabled sets to the bottom compared to source sets', () => {
    expect(
      permutateThemes([
        {
          id: '0',
          name: 'light',
          group: 'theme',
          selectedTokenSets: {
            light: enabled,
            theme: enabled,
            core: source,
          },
        },
        {
          id: '1',
          name: 'dark',
          group: 'theme',
          selectedTokenSets: {
            dark: enabled,
            theme: enabled,
            core: source,
          },
        },
      ]),
    ).to.eql({
      dark: ['core', 'dark', 'theme'],
      light: ['core', 'light', 'theme'],
    });
  });

  it('throws when not all themes have a group property', () => {
    expect(() =>
      permutateThemes([
        {
          id: '0',
          name: 'light',
          selectedTokenSets: {
            core: source,
            light: enabled,
            theme: enabled,
          },
        },
        {
          id: '1',
          name: 'dark',
          group: 'theme',
          selectedTokenSets: {
            core: source,
            dark: enabled,
            theme: enabled,
          },
        },
      ]),
    ).to.throw(
      'Theme light does not have a group property, which is required for multi-dimensional theming.',
    );
  });

  it('gives back the input as the output when no "group" properties are present at all (single-dimensional themes)', () => {
    const singleDimensionalThemes = [
      {
        id: '0',
        name: 'light',
        selectedTokenSets: {
          core: source,
          light: enabled,
          dark: disabled,
          theme: enabled,
        },
      },
      {
        id: '1',
        name: 'dark',
        selectedTokenSets: {
          core: source,
          light: disabled,
          dark: enabled,
          theme: enabled,
        },
      },
    ];

    expect(permutateThemes(singleDimensionalThemes)).to.eql({
      dark: ['core', 'dark', 'theme'],
      light: ['core', 'light', 'theme'],
    });
  });
});
