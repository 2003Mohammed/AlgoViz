import { describe, expect, test } from 'bun:test';
import { canStepBackward, canStepForward, getAnimationIntervalMs } from '../useUnifiedAnimationController';

describe('useUnifiedAnimationController helpers', () => {
  test('calculates speed-based interval with lower bound', () => {
    expect(getAnimationIntervalMs(1)).toBe(1000);
    expect(getAnimationIntervalMs(2)).toBe(500);
    expect(getAnimationIntervalMs(10)).toBe(100);
  });

  test('validates forward/backward step navigation', () => {
    expect(canStepForward(0, 5)).toBe(true);
    expect(canStepForward(4, 5)).toBe(false);
    expect(canStepBackward(1)).toBe(true);
    expect(canStepBackward(0)).toBe(false);
  });
});
