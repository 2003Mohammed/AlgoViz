import { describe, expect, test } from 'bun:test';
import { buildAssistantContext } from '../contextBuilder';

describe('context builder', () => {
  test('extracts graph state details from visualization state', () => {
    const context = buildAssistantContext({
      question: 'Explain current step',
      pathname: '/algorithms/graph/bfs',
      visualizationState: {
        algorithmId: 'bfs',
        algorithmName: 'Breadth-First Search',
        stepIndex: 2,
        totalSteps: 5,
        stepDescription: 'Visited node C',
        currentNode: 'C',
        queue: ['D', 'E']
      }
    });

    expect(context.topicId).toBe('bfs');
    expect(context.summary).toContain('Step 3 of 5');
    expect(context.stateDetails.join(' ')).toContain('Current node: C');
  });

  test('returns fallback summary when no steps exist', () => {
    const context = buildAssistantContext({
      question: 'What is stack?',
      pathname: '/data-structures/stack',
      visualizationState: {
        algorithmId: null,
        stepIndex: 0,
        totalSteps: 0
      }
    });

    expect(context.hasVisualizationData).toBe(false);
    expect(context.summary).toBe('No active visualization steps yet');
  });
});
