import { describe, expect, mock, test } from 'bun:test';
import { findKnowledgeEntry, knowledgeBase, validateKnowledgeBase } from '../knowledgeBase';

describe('knowledge base', () => {
  test('core entries expose required structured fields', () => {
    const targets = ['bfs', 'dfs', 'dijkstra', 'astar', 'array', 'linkedList', 'queue', 'stack', 'tree', 'hashTable'];

    for (const key of targets) {
      const entry = knowledgeBase[key];
      expect(entry).toBeDefined();
      expect(entry.definition.length).toBeGreaterThan(0);
      expect(entry.intuition.length).toBeGreaterThan(0);
      expect(entry.complexity.time.length).toBeGreaterThan(0);
      expect(entry.complexity.space.length).toBeGreaterThan(0);
      expect(entry.useCases.length).toBeGreaterThan(0);
      expect(entry.comparisons.length).toBeGreaterThan(0);
      expect(entry.pitfalls.length).toBeGreaterThan(0);
    }
  });

  test('newly inserted entries are discoverable without module changes', () => {
    knowledgeBase.dummyAlgo = {
      id: 'dummyAlgo',
      type: 'algorithm',
      name: 'Dummy Algo',
      aliases: ['dummy algo'],
      definition: 'Test definition',
      intuition: 'Test intuition',
      complexity: { time: 'O(1)', space: 'O(1)' },
      useCases: ['testing'],
      comparisons: [{ with: 'bfs', summary: 'dummy comparison' }],
      pitfalls: ['none'],
      implementationNotes: ['note'],
      optimizationTips: ['tip'],
      edgeCases: ['edge'],
      examples: ['example']
    };

    const found = findKnowledgeEntry('explain dummy algo');
    expect(found?.id).toBe('dummyAlgo');

    delete knowledgeBase.dummyAlgo;
  });

  test('valid entries produce no warnings in development-like environments', () => {
    const warnSpy = mock(() => undefined);
    const originalWarn = console.warn;
    console.warn = warnSpy;

    validateKnowledgeBase({
      sample: {
        id: 'sample',
        type: 'algorithm',
        name: 'Sample',
        aliases: ['sample'],
        definition: 'd',
        intuition: 'i',
        complexity: { time: 'O(1)', space: 'O(1)' },
        useCases: ['u'],
        comparisons: [{ with: 'x', summary: 's' }],
        pitfalls: ['p'],
        implementationNotes: ['n'],
        optimizationTips: ['o'],
        edgeCases: ['e'],
        examples: ['ex']
      }
    });

    expect(warnSpy).toHaveBeenCalledTimes(0);
    console.warn = originalWarn;
  });

  test('missing required fields trigger warnings and never throw', () => {
    const warnSpy = mock(() => undefined);
    const originalWarn = console.warn;
    console.warn = warnSpy;

    expect(() =>
      validateKnowledgeBase({
        broken: {
          id: 'broken',
          type: 'algorithm',
          name: 'Broken',
          aliases: ['broken'],
          definition: '',
          intuition: '',
          complexity: { time: '', space: '' },
          useCases: [],
          comparisons: [],
          pitfalls: [],
          implementationNotes: [],
          optimizationTips: ['o'],
          edgeCases: [],
          examples: []
        }
      })
    ).not.toThrow();

    expect(warnSpy).toHaveBeenCalledTimes(1);
    console.warn = originalWarn;
  });
});
