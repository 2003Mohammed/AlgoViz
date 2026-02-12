import { describe, expect, test } from 'bun:test';
import { SORTING_SCENARIOS, getScenarioById } from './exampleScenarios';

const isSortedAsc = (arr: number[]) => arr.every((value, index) => index === 0 || arr[index - 1] <= value);

describe('sorting scenario generators', () => {
  test('reverse sorted scenario returns descending values', () => {
    const values = getScenarioById(SORTING_SCENARIOS, 'reverse-sorted').generate();
    const reversedAscending = [...values].sort((a, b) => a - b).reverse();
    expect(values).toEqual(reversedAscending);
  });

  test('nearly sorted scenario has a low inversion count', () => {
    const values = getScenarioById(SORTING_SCENARIOS, 'nearly-sorted').generate();
    let inversions = 0;
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        if (values[i] > values[j]) inversions++;
      }
    }
    expect(inversions).toBeGreaterThan(0);
    expect(inversions).toBeLessThanOrEqual(3);
  });

  test('few unique scenario enforces distinct count guardrail', () => {
    const values = getScenarioById(SORTING_SCENARIOS, 'few-unique').generate();
    expect(new Set(values).size).toBeLessThanOrEqual(4);
    expect(values.length).toBeGreaterThan(0);
  });

  test('already sorted scenario is monotonic ascending', () => {
    const values = getScenarioById(SORTING_SCENARIOS, 'already-sorted').generate();
    expect(isSortedAsc(values)).toBe(true);
  });
});
