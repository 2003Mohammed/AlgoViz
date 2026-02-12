import type { TutorVisualizationState } from '../context/TutorContext';

export type KnowledgeTopicType = 'algorithm' | 'data-structure';

export interface ComplexityProfile {
  time: string;
  space: string;
}

export interface KnowledgeEntry {
  id: string;
  type: KnowledgeTopicType;
  name: string;
  aliases: string[];
  definition: string;
  intuition: string;
  complexity: ComplexityProfile;
  useCases: string[];
  comparisons: Array<{
    with: string;
    summary: string;
  }>;
  pitfalls: string[];
  implementationNotes: string[];
  optimizationTips: string[];
  edgeCases: string[];
  examples: string[];
}

export type IntentType =
  | 'definition'
  | 'current-state-explanation'
  | 'selection-rule-reasoning'
  | 'comparison'
  | 'complexity'
  | 'implementation-detail'
  | 'optimization-guidance'
  | 'edge-case-analysis'
  | 'navigation-help'
  | 'out-of-context';

export interface IntentScore {
  intent: IntentType;
  score: number;
  evidence: string[];
}

export interface ClassifiedIntent {
  primaryIntent: IntentType;
  secondaryIntent?: IntentType;
  confidenceScore: number;
  rawScores: Record<IntentType, number>;
  intents: IntentScore[];
  conflictNote?: string;
}

export interface AssistantContext {
  routeContext: string;
  algorithmId: string | null;
  topicId: string | null;
  topicName: string;
  summary: string;
  stateDetails: string[];
  hasVisualizationData: boolean;
  visualizationState: TutorVisualizationState;
}

export interface AssistantRequest {
  question: string;
  pathname: string;
  currentRoute?: string;
  activeAlgorithm?: string | null;
  activeDataStructure?: string | null;
  visualizationState: TutorVisualizationState;
  previousQuestion?: string;
}

export interface AssistantResponse {
  directAnswer: string;
  whyItMatters: string;
  relatedInsight: string;
  examples?: string[];
}
