import type {} from 'jest';
import { PALETTES } from '../palettes';

describe('palettes', () => {
  const reference = Object.keys(PALETTES.aurora.light).sort();

  it.each(Object.entries(PALETTES))('%s defines every colour role in light and dark', (_name, set) => {
    expect(Object.keys(set.light).sort()).toEqual(reference);
    expect(Object.keys(set.dark).sort()).toEqual(reference);
  });

  it('gives every gradient at least two stops', () => {
    Object.values(PALETTES).forEach(set => {
      expect(set.light.gradient.length).toBeGreaterThanOrEqual(2);
      expect(set.dark.gradient.length).toBeGreaterThanOrEqual(2);
    });
  });
});
