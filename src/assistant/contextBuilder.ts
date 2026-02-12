import { findKnowledgeEntry } from './knowledgeBase';
import type { AssistantContext, AssistantRequest } from './types';

const routeTopicFallback = (pathname: string): string => {
  if (pathname.startsWith('/algorithms/graph')) return 'graph algorithms';
  if (pathname.startsWith('/algorithms/sorting')) return 'sorting algorithms';
  if (pathname.startsWith('/algorithms/searching')) return 'searching algorithms';
  if (pathname.startsWith('/algorithms')) return 'algorithms';
  if (pathname.startsWith('/data-structures')) return 'data structures';
  return 'AlgoViz';
};

const genericContextHints = [
  /\bits?\b/,
  /\bthis\b/,
  /\bits\b/,
  /\bcomplexit(?:y|ies)\b/,
  /how\s+does\s+it\s+work/
];

const hasGenericQuestionHints = (question: string): boolean => {
  const lowered = question.toLowerCase();
  return genericContextHints.some((pattern) => pattern.test(lowered));
};

const inferTopicId = (request: AssistantRequest): string | null => {
  const { visualizationState, pathname, activeAlgorithm, activeDataStructure } = request;

  if (activeAlgorithm) return activeAlgorithm;
  if (visualizationState.algorithmId) return visualizationState.algorithmId;
  if (activeDataStructure) return activeDataStructure;

  if (pathname.includes('binary-search')) return 'binarySearch';
  if (pathname.includes('linear-search')) return 'linearSearch';
  if (pathname.includes('bubble-sort')) return 'bubbleSort';
  if (pathname.includes('merge-sort')) return 'mergeSort';
  if (pathname.includes('quick-sort')) return 'quickSort';
  if (pathname.includes('a-star') || pathname.includes('astar')) return 'astar';
  if (pathname.includes('dijkstra')) return 'dijkstra';
  if (pathname.includes('/bfs')) return 'bfs';
  if (pathname.includes('/dfs')) return 'dfs';
  if (pathname.includes('/stack')) return 'stack';
  if (pathname.includes('/queue')) return 'queue';
  if (pathname.includes('/linked-list')) return 'linkedList';
  if (pathname.includes('/tree')) return 'tree';
  if (pathname.includes('/array')) return 'array';
  if (pathname.includes('/hash')) return 'hashTable';

  return null;
};

export const buildAssistantContext = (request: AssistantRequest): AssistantContext => {
  const topicId = inferTopicId(request);
  const activeAlgorithm = request.activeAlgorithm || request.visualizationState.algorithmName || null;
  const shouldScopeToAlgorithm = Boolean(activeAlgorithm) && hasGenericQuestionHints(request.question);
  const alreadyScoped = Boolean(activeAlgorithm) && request.question.toLowerCase().includes(String(activeAlgorithm).toLowerCase());
  const scopedQuestion = shouldScopeToAlgorithm && !alreadyScoped ? `${activeAlgorithm}: ${request.question}` : request.question;
  const entry = findKnowledgeEntry(scopedQuestion, topicId);
  const { visualizationState } = request;

  const stateDetails: string[] = [];
  if (visualizationState.stepDescription) stateDetails.push(visualizationState.stepDescription);
  if (visualizationState.currentNode) stateDetails.push(`Current node: ${visualizationState.currentNode}`);
  if (visualizationState.queue?.length) stateDetails.push(`Queue front: ${visualizationState.queue[0]}`);
  if (visualizationState.stack?.length) stateDetails.push(`Stack top: ${visualizationState.stack[visualizationState.stack.length - 1]}`);
  if (visualizationState.path?.length) stateDetails.push(`Path: ${visualizationState.path.join(' → ')}`);

  const hasSteps = visualizationState.totalSteps > 0;
  const summary = hasSteps
    ? `Step ${visualizationState.stepIndex + 1} of ${visualizationState.totalSteps}`
    : 'No active visualization steps yet';

  return {
    routeContext: routeTopicFallback(request.currentRoute || request.pathname),
    algorithmId: visualizationState.algorithmId,
    topicId: entry?.id || topicId,
    topicName: entry?.name || activeAlgorithm || request.activeDataStructure || visualizationState.algorithmName || routeTopicFallback(request.currentRoute || request.pathname),
    summary,
    stateDetails,
    hasVisualizationData: hasSteps,
    visualizationState
  };
};
