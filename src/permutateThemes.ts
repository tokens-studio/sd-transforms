import { ThemeObject, TokenSetStatus } from '@tokens-studio/types';

declare interface Options {
  separator?: string;
}

function mapThemesToSetsObject(themes: ThemeObject[]) {
  return Object.fromEntries(
    themes.map(theme => [theme.name, filterTokenSets(theme.selectedTokenSets)]),
  );
}

export function permutateThemes(themes: ThemeObject[], { separator = '-' } = {} as Options) {
  if (themes.some(theme => theme.group)) {
    // Sort themes by groups
    const groups = {};
    themes.forEach(theme => {
      if (theme.group) {
        groups[theme.group] = [...(groups[theme.group] ?? []), theme];
      } else {
        throw new Error(
          `Theme ${theme.name} does not have a group property, which is required for multi-dimensional theming.`,
        );
      }
    });

    if (Object.keys(groups).length <= 1) {
      return mapThemesToSetsObject(themes);
    }

    // Create theme permutations
    const permutations = cartesian(Object.values(groups)) as Array<ThemeObject[]>;

    return Object.fromEntries(
      permutations.map(perm => {
        // 1) concat the names of the theme groups to create the permutation theme name
        // 2) merge the selectedTokenSets together from the different theme group parts
        const reduced = perm.reduce(
          (acc, curr) => [
            `${acc[0]}${acc[0] ? separator : ''}${curr.name}`,
            [...acc[1], ...filterTokenSets(curr.selectedTokenSets)],
          ],
          ['', [] as string[]],
        );

        // Dedupe the tokensets, return as entries [name, sets]
        return [reduced[0], [...new Set(reduced[1])]];
      }),
    );
  } else {
    return mapThemesToSetsObject(themes);
  }
}

function filterTokenSets(tokensets: Record<string, TokenSetStatus>) {
  return (
    Object.entries(tokensets)
      .filter(([, val]) => val !== 'disabled')
      // ensure source type sets are always ordered before enabled type sets
      .sort((a, b) => {
        if (a[1] === 'source' && b[1] === 'enabled') {
          return -1;
        } else if (a[1] === 'enabled' && b[1] === 'source') {
          return 1;
        }
        return 0;
      })
      .map(entry => entry[0])
  );
}

// cartesian permutations: [[1,2], [3,4]] -> [[1,3], [1,4], [2,3], [2,4]]
function cartesian(a: Array<unknown[]>) {
  return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
}
