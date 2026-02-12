import { describe, expect, test } from 'bun:test';
import { classifyIntent } from '../intentClassifier';

describe('intent classifier', () => {
  test('detects multi-intent questions and prioritizes highest score', () => {
    const result = classifyIntent('Compare BFS vs DFS and include complexity details.');
    expect(result.primaryIntent).toBe('comparison');
    expect(result.intents.some((item) => item.intent === 'complexity')).toBe(true);
  });

  test('flags conflicting intents when scores are close', () => {
    const result = classifyIntent('What if we compare BFS and DFS?');
    expect(result.conflictNote).toBeDefined();
  });

  test('routes non-DSA topics to out-of-context', () => {
    const result = classifyIntent('What is the weather tomorrow?');
    expect(result.primaryIntent).toBe('out-of-context');
  });

  test('returns confidence score in 0..1 range', () => {
    const result = classifyIntent('Explain current step status');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(1);
  });

  test('high-signal query produces higher confidence than ambiguous query', () => {
    const highSignal = classifyIntent('What is the weather forecast and weather update?');
    const ambiguous = classifyIntent('compare and explain and optimize and implement and what if');
    expect(highSignal.confidenceScore).toBeGreaterThan(ambiguous.confidenceScore);
  });

  test('includes additive intent metadata without breaking original fields', () => {
    const result = classifyIntent('Compare BFS vs DFS');
    expect(result.primaryIntent).toBe('comparison');
    expect(typeof result.rawScores.comparison).toBe('number');
    expect('secondaryIntent' in result).toBe(true);
  });
});
