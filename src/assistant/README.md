# AlgoViz Assistant Architecture

## Overview
The assistant is organized as deterministic-first modules so existing behavior remains stable while future LLM integration can be added without changing UI contracts.

- `knowledgeBase.ts`: structured algorithm/data-structure entries + dev-only validation.
- `intentClassifier.ts`: weighted, multi-intent scoring.
- `contextBuilder.ts`: extracts route + visualization state context.
- `responseComposer.ts`: deterministic structured response formatting.
- `assistantRouter.ts`: orchestration and deterministic/LLM routing decision.
- `llmGateway.ts`: stubbed integration contract for future model calls.

## Flow diagram (text)
```
User Question
   │
   ├─> intentClassifier (primary + secondary + confidence + raw scores)
   │
   ├─> contextBuilder (route + visualization state + inferred topic)
   │
   └─> assistantRouter
         ├─ if LLM condition met -> llmGateway (try/catch)
         │      └─ on error/null/blank -> deterministic fallback
         └─ deterministic responseComposer (always available)
                    └─ returns Direct answer / Why it matters / Related insight
```

## Deterministic-first routing
Routing remains deterministic by default. The LLM path is optional and only attempted under the existing threshold logic. If model output is unavailable, deterministic composition is used automatically.

## Confidence scoring
`classifyIntent` returns:
- `primaryIntent` (unchanged selection behavior)
- `secondaryIntent` (if present)
- `confidenceScore` in `0..1`, computed as `highestScore / totalScore`
- `rawScores` keyed by each `IntentType`

This is additive and backward compatible with existing `intents` and `conflictNote` fields.

## Fallback guarantee
`assistantRouter` now guards LLM calls with `try/catch` and checks for null/undefined/blank responses. If any issue occurs, deterministic responses are returned so runtime UX never gets a blank answer.

## Development-only knowledge validation
`validateKnowledgeBase(knowledgeBase)` runs once at module initialization.
- Checks required fields per entry.
- Emits `console.warn` only in development-like environments.
- Never throws.
- Never blocks startup.
- Does not run in production mode.

## Adding new algorithm/data structure support
1. Add a new `KnowledgeEntry` in `knowledgeBase.ts`.
2. Include aliases and complete metadata fields.
3. No classifier/router/composer changes are required.

## Future LLM integration
1. Implement `queryLlmGateway` in `llmGateway.ts`.
2. Pass `question`, `context`, `intent`, and knowledge snapshot to model prompt builder.
3. Keep deterministic fallback in `assistantRouter.ts` when model is unavailable.

## Test isolation
Assistant tests live in `src/assistant/__tests__/` and are development-only.
They are excluded from app build inputs via TypeScript config and are not imported by runtime modules, so production bundles do not contain test code.
