import { describe, expect, test } from 'bun:test';
import { generateVisualizationSteps } from '..';
import { generateRandomArray, generateRandomGraph } from '../../visualizerUtils';

const isConnected = (graph: ReturnType<typeof generateRandomGraph>) => {
  if (graph.nodes.length === 0) return true;
  const adj = new Map<string, string[]>();
  graph.nodes.forEach((node) => adj.set(node.id, []));
  graph.edges.forEach((edge) => {
    adj.get(edge.source)?.push(edge.target);
    adj.get(edge.target)?.push(edge.source);
  });

  const visited = new Set<string>();
  const stack = [graph.nodes[0].id];
  while (stack.length) {
    const id = stack.pop()!;
    if (visited.has(id)) continue;
    visited.add(id);
    for (const n of adj.get(id) ?? []) stack.push(n);
  }
  return visited.size === graph.nodes.length;
};

describe('stability regressions', () => {
  test('merge, quick, heap, linear, binary generate more than two frames', () => {
    const data = generateRandomArray(false, 10);
    expect(generateVisualizationSteps('merge-sort', data).length).toBeGreaterThan(2);
    expect(generateVisualizationSteps('quick-sort', data).length).toBeGreaterThan(2);
    expect(generateVisualizationSteps('heap-sort', data).length).toBeGreaterThan(2);
    expect(generateVisualizationSteps('linear-search', data, { target: '10' }).length).toBeGreaterThan(2);
    expect(generateVisualizationSteps('binary-search', data, { target: '10' }).length).toBeGreaterThan(2);
  });

  test('random graph generator always produces connected graph', () => {
    for (let i = 0; i < 20; i++) {
      const graph = generateRandomGraph(8);
      expect(isConnected(graph)).toBe(true);
    }
  });
});
