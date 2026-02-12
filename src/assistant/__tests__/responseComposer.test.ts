import { describe, expect, test } from 'bun:test';
import { classifyIntent } from '../intentClassifier';
import { composeDeterministicResponse } from '../responseComposer';
import { buildAssistantContext } from '../contextBuilder';

describe('response composer', () => {
  test('returns structured deterministic sections', () => {
    const question = 'What is BFS?';
    const context = buildAssistantContext({
      question,
      pathname: '/algorithms/graph/bfs',
      visualizationState: { algorithmId: 'bfs', stepIndex: 0, totalSteps: 0 }
    });

    const response = composeDeterministicResponse(question, classifyIntent(question), context);
    expect(response).toContain('Direct answer:');
    expect(response).toContain('Why it matters:');
    expect(response).toContain('Related insight:');
  });

  test('injects state summary for current-state intent', () => {
    const question = 'Explain current step';
    const context = buildAssistantContext({
      question,
      pathname: '/algorithms/graph/dijkstra',
      visualizationState: {
        algorithmId: 'dijkstra',
        stepIndex: 1,
        totalSteps: 4,
        stepDescription: 'Relaxing edges from B',
        currentNode: 'B'
      }
    });

    const response = composeDeterministicResponse(question, classifyIntent(question), context);
    expect(response).toContain('Step 2 of 4');
    expect(response).toContain('Current node: B');
  });
});
