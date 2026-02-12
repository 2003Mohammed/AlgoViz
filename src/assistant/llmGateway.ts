import type { AssistantContext, ClassifiedIntent } from './types';
import { knowledgeBase } from './knowledgeBase';

export interface LlmGatewayInput {
  question: string;
  context: AssistantContext;
  intent: ClassifiedIntent;
}

/**
 * Stub for future LLM integration.
 * Intended contract: receives structured context + intent + knowledge snapshot,
 * returns formatted assistant text while preserving deterministic fallbacks.
 */
export const queryLlmGateway = async (_input: LlmGatewayInput): Promise<string | null> => {
  void knowledgeBase;
  return null;
};
