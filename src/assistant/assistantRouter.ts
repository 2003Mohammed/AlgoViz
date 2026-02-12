import { buildAssistantContext } from './contextBuilder';
import { classifyIntent } from './intentClassifier';
import { queryLlmGateway } from './llmGateway';
import { composeDeterministicResponse } from './responseComposer';
import type { AssistantRequest } from './types';

export const routeAssistantResponse = async (request: AssistantRequest): Promise<string> => {
  const intent = classifyIntent(request.question);
  const context = buildAssistantContext(request);

  const wantsModelReasoning = intent.intents.some((item) =>
    item.intent === 'edge-case-analysis' || item.intent === 'comparison'
  ) && request.question.toLowerCase().includes('deep');

  const deterministicFallback = () => composeDeterministicResponse(
    request.question,
    intent,
    context,
    request.previousQuestion
  );

  if (wantsModelReasoning) {
    try {
      const llmResponse = await queryLlmGateway({
        question: request.question,
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
