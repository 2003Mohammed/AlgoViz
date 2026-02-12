import type { ClassifiedIntent, IntentScore, IntentType } from './types';

const weightedSignals: Record<IntentType, Array<{ term: string; weight: number }>> = {
  definition: [
    { term: 'what is', weight: 4 },
    { term: 'define', weight: 4 },
    { term: 'explain', weight: 2 },
    { term: 'intuition', weight: 2 }
  ],
  'current-state-explanation': [
    { term: 'current step', weight: 5 },
    { term: 'what is happening', weight: 5 },
    { term: 'status', weight: 4 },
    { term: 'right now', weight: 3 },
    { term: 'state', weight: 2 }
  ],
  'selection-rule-reasoning': [
    { term: 'why this', weight: 5 },
    { term: 'why did', weight: 4 },
    { term: 'why chosen', weight: 4 },
    { term: 'selection rule', weight: 5 },
    { term: 'reason', weight: 2 }
  ],
  comparison: [
    { term: 'vs', weight: 5 },
    { term: 'compare', weight: 5 },
    { term: 'difference', weight: 4 },
    { term: 'better than', weight: 4 }
  ],
  complexity: [
    { term: 'complexity', weight: 5 },
    { term: 'big o', weight: 5 },
    { term: 'time', weight: 2 },
    { term: 'space', weight: 2 }
  ],
  'implementation-detail': [
    { term: 'implement', weight: 5 },
    { term: 'code', weight: 5 },
    { term: 'pseudo', weight: 4 },
    { term: 'steps', weight: 2 },
    { term: 'logic', weight: 2 }
  ],
  'optimization-guidance': [
    { term: 'optimize', weight: 5 },
    { term: 'performance', weight: 5 },
    { term: 'faster', weight: 4 },
    { term: 'improve', weight: 3 }
  ],
  'edge-case-analysis': [
    { term: 'edge case', weight: 5 },
    { term: 'what if', weight: 5 },
    { term: 'if', weight: 1 },
    { term: 'corner case', weight: 4 },
    { term: 'when', weight: 1 }
  ],
  'navigation-help': [
    { term: 'how do i use', weight: 5 },
    { term: 'controls', weight: 4 },
    { term: 'play', weight: 3 },
    { term: 'pause', weight: 3 },
    { term: 'navigate', weight: 4 }
  ],
  'out-of-context': [
    { term: 'weather', weight: 5 },
    { term: 'stock', weight: 5 },
    { term: 'movie', weight: 4 },
    { term: 'recipe', weight: 4 },
    { term: 'politics', weight: 5 }
  ]
};

const minimumIntentScore = 2;

const buildRawScores = (normalizedQuestion: string): Record<IntentType, number> => {
  const intents = Object.keys(weightedSignals) as IntentType[];
  return intents.reduce((acc, intent) => {
    acc[intent] = weightedSignals[intent].reduce((total, signal) => {
      if (normalizedQuestion.includes(signal.term)) {
        return total + signal.weight;
      }
      return total;
    }, 0);
    return acc;
  }, {} as Record<IntentType, number>);
};

export const classifyIntent = (question: string): ClassifiedIntent => {
  const normalized = question.toLowerCase().trim();
  const rawScores = buildRawScores(normalized);

  const intents = (Object.keys(weightedSignals) as IntentType[])
    .map((intent) => {
      const evidence: string[] = [];
      weightedSignals[intent].forEach((signal) => {
        if (normalized.includes(signal.term)) {
          evidence.push(signal.term);
        }
      });

      return { intent, score: rawScores[intent], evidence } as IntentScore;
    })
    .filter((item) => item.score >= minimumIntentScore)
    .sort((a, b) => b.score - a.score);

  const totalScore = Object.values(rawScores).reduce((sum, value) => sum + value, 0);

  if (intents.length === 0) {
    return {
      primaryIntent: 'definition',
      secondaryIntent: undefined,
      confidenceScore: 1,
      rawScores,
      intents: [{ intent: 'definition', score: 1, evidence: ['default'] }]
    };
  }

  const top = intents[0];
  const second = intents[1];
  const confidenceScore = totalScore > 0 ? top.score / totalScore : 1;
  const conflictNote = second && Math.abs(top.score - second.score) <= 1
    ? `Ambiguous request detected between "${top.intent}" and "${second.intent}". Prioritizing ${top.intent}.`
    : undefined;

  return {
    primaryIntent: top.intent,
    secondaryIntent: second?.intent,
    confidenceScore,
    rawScores,
    intents,
    conflictNote
  };
};
