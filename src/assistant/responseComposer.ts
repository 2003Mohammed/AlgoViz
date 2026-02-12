import { findKnowledgeEntry } from './knowledgeBase';
import type { AssistantContext, AssistantResponse, ClassifiedIntent } from './types';

const formatResponse = (response: AssistantResponse): string => {
  const chunks = [
    `Direct answer: ${response.directAnswer}`,
    `Why it matters: ${response.whyItMatters}`,
    `Related insight: ${response.relatedInsight}`
  ];

  if (response.examples?.length) {
    chunks.push(`Examples:\n- ${response.examples.join('\n- ')}`);
  }

  return chunks.join('\n\n');
};

const selectionReason = (topicId: string | null): string => {
  switch (topicId) {
    case 'bfs':
      return 'BFS selects the earliest discovered pending node in the queue.';
    case 'dfs':
      return 'DFS selects the most recently discovered pending node from the stack.';
    case 'dijkstra':
      return 'Dijkstra selects the unvisited node with the minimum tentative distance.';
    case 'astar':
      return 'A* selects the node with the lowest f = g + h score.';
    default:
      return 'The current visualizer applies its deterministic selection rule step-by-step.';
  }
};

export const composeDeterministicResponse = (
  question: string,
  intent: ClassifiedIntent,
  context: AssistantContext,
  previousQuestion?: string
): string => {
  const entry = findKnowledgeEntry(question, context.topicId);
  const repeated = previousQuestion && previousQuestion.toLowerCase() === question.toLowerCase();

  if (intent.primaryIntent === 'out-of-context') {
    return formatResponse({
      directAnswer: 'I can only help with AlgoViz algorithms, data structures, and visualizer behavior in this assistant.',
      whyItMatters: 'Keeping scope focused avoids misleading answers while you are learning from deterministic visual states.',
      relatedInsight: 'Try prompts like “Explain current step”, “Compare BFS vs DFS”, or “What is the complexity?”'
    });
  }

  if (intent.primaryIntent === 'navigation-help') {
    return formatResponse({
      directAnswer: `Use the Play/Pause, Step, Speed, and preset controls to inspect ${context.topicName}.`,
      whyItMatters: 'Controlling playback speed and stepping helps you map each animation frame to one algorithmic decision.',
      relatedInsight: 'After stepping once, ask for a state explanation to connect controls to logic.'
    });
  }

  if (!entry) {
    return formatResponse({
      directAnswer: `I do not have enough context for a precise explanation yet for ${context.routeContext}.`,
      whyItMatters: 'Deterministic assistance requires a known topic and state to avoid generic or incorrect guidance.',
      relatedInsight: 'Mention an algorithm/data structure directly, or run the visualization and ask about the current step.'
    });
  }

  switch (intent.primaryIntent) {
    case 'current-state-explanation':
      return formatResponse({
        directAnswer: context.hasVisualizationData
          ? `${context.summary}${context.stateDetails.length ? ` • ${context.stateDetails.join(' • ')}` : ''}`
          : 'No visualization steps are active yet. Start or load a scenario to generate state.',
        whyItMatters: 'State-aware explanations connect algorithm theory to each concrete visual transition.',
        relatedInsight: 'Ask “why this selection?” to tie the current state to the algorithm rule.'
      });
    case 'selection-rule-reasoning':
      return formatResponse({
        directAnswer: selectionReason(entry.id),
        whyItMatters: 'Understanding the selection rule lets you predict future steps instead of memorizing outcomes.',
        relatedInsight: repeated
          ? `Current context: ${context.summary}`
          : `Pitfall to avoid: ${entry.pitfalls[0] || 'Verify assumptions before each step.'}`
      });
    case 'comparison':
      return formatResponse({
        directAnswer: entry.comparisons[0]?.summary || `${entry.name} differs from related topics based on tradeoffs in complexity and behavior.`,
        whyItMatters: 'Choosing the right algorithm/data structure depends on realistic constraints, not just correctness.',
        relatedInsight: `Try comparing with: ${entry.comparisons.map((c) => c.with).join(', ') || 'related structures'}.`
      });
    case 'complexity':
      return formatResponse({
        directAnswer: `${entry.name} complexity: time ${entry.complexity.time}, space ${entry.complexity.space}.`,
        whyItMatters: 'Complexity informs scalability and performance expectations as input size grows.',
        relatedInsight: `Use-case guidance: ${entry.useCases[0] || 'Use where tradeoffs align with your constraints.'}`
      });
    case 'implementation-detail':
      return formatResponse({
        directAnswer: entry.implementationNotes[0] || `Implement ${entry.name} using its canonical data-flow steps.`,
        whyItMatters: 'Implementation details prevent subtle logic bugs and keep visual output deterministic.',
        relatedInsight: `Best practice: ${entry.implementationNotes[1] || entry.optimizationTips[0] || 'Keep state transitions explicit.'}`,
        examples: entry.examples.slice(0, 2)
      });
    case 'optimization-guidance':
      return formatResponse({
        directAnswer: entry.optimizationTips[0] || `Profile ${entry.name} and optimize bottlenecks around core operations.`,
        whyItMatters: 'Optimization keeps animations smooth without changing algorithm correctness.',
        relatedInsight: `Common pitfall: ${entry.pitfalls[0] || 'Avoid over-optimizing without profiling.'}`
      });
    case 'edge-case-analysis':
      return formatResponse({
        directAnswer: entry.edgeCases[0] || `Test ${entry.name} against empty/minimal and adversarial inputs.`,
        whyItMatters: 'Edge cases validate robustness and prevent regressions in deterministic visualizers.',
        relatedInsight: `Additional case: ${entry.edgeCases[1] || 'Check duplicate and boundary values.'}`
      });
    case 'definition':
    default:
      return formatResponse({
        directAnswer: `${entry.definition} ${entry.intuition}`,
        whyItMatters: entry.useCases[0] || 'Core understanding improves transfer to related problems.',
        relatedInsight: repeated
          ? `Complexity recap: ${entry.complexity.time} time, ${entry.complexity.space} space.`
          : `Best practice: ${entry.pitfalls[0] || 'Test assumptions against current state.'}`
      });
  }
};
