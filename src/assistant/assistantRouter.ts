import { buildAssistantContext } from './contextBuilder';
import { classifyIntent } from './intentClassifier';
import { queryLlmGateway } from './llmGateway';
import { composeDeterministicResponse } from './responseComposer';
import type { AssistantRequest } from './types';

const genericQuestionHints = [
  /\bit\b/,
  /\bthis\b/,
  /\bits\b/,
  /\bcomplexit(?:y|ies)\b/,
  /how\s+does\s+it\s+work/
];

const shouldScopeToActiveAlgorithm = (question: string, activeAlgorithm?: string | null) => {
  if (!activeAlgorithm) return false;
  const lowered = question.toLowerCase();
  return genericQuestionHints.some((pattern) => pattern.test(lowered));
};

const scopeQuestionToAlgorithm = (question: string, activeAlgorithm?: string | null) => {
  if (!shouldScopeToActiveAlgorithm(question, activeAlgorithm)) {
    return question;
  }

  return `${activeAlgorithm} ${question}`;
};

export const routeAssistantResponse = async (request: AssistantRequest): Promise<string> => {
  const scopedQuestion = scopeQuestionToAlgorithm(request.question, request.activeAlgorithm);
  const intent = classifyIntent(scopedQuestion);
  const context = buildAssistantContext({
    ...request,
    question: scopedQuestion
  });

  const wantsModelReasoning = intent.intents.some((item) =>
    item.intent === 'edge-case-analysis' || item.intent === 'comparison'
  ) && scopedQuestion.toLowerCase().includes('deep');

  const deterministicFallback = () => composeDeterministicResponse(
    scopedQuestion,
    intent,
    context,
    request.previousQuestion
  );

  if (wantsModelReasoning) {
    try {
      const llmResponse = await queryLlmGateway({
        question: scopedQuestion,
        context,
        intent
      });

      if (typeof llmResponse === 'string' && llmResponse.trim().length > 0) {
        return llmResponse;
      }
    } catch {
      // Deterministic fallback guarantee: never surface LLM failures to runtime UX.
    }
  }

  const deterministicResponse = deterministicFallback();
  if (typeof deterministicResponse === 'string' && deterministicResponse.trim().length > 0) {
    return deterministicResponse;
  }

  return 'Direct answer: I can help with this algorithm or data structure once more context is available.\n\nWhy it matters: Deterministic responses must always remain available for reliability.\n\nRelated insight: Try asking about the current step, complexity, or a direct comparison.';
};
