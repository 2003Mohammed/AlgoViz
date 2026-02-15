import { describe, expect, test } from 'bun:test';
import { visualizeBubbleSort } from '../sort-visualizations';
import { visualizeBFS } from '../graph-visualizations';
import { getTraversalResult, TreeNode } from '../../treeTraversalUtils';
import { visualizeArrayOperation } from '../array-visualizations';

describe('frame generation', () => {
  test('bubble sort generates deterministic frames and sorted final state', () => {
    const frames = visualizeBubbleSort([5, 1, 4, 2]);
    expect(frames.length).toBeGreaterThan(1);

    const final = frames[frames.length - 1].array.map((item) => item.value);
    expect(final).toEqual([1, 2, 4, 5]);
  });

  test('bfs generates traversal frames and visits start node first', () => {
    const graph = {
      nodes: [{ id: 'A', x: 0, y: 0 }, { id: 'B', x: 1, y: 1 }, { id: 'C', x: 2, y: 2 }],
      edges: [{ source: 'A', target: 'B' }, { source: 'B', target: 'C' }],
    };

    const frames = visualizeBFS(graph as any, 'A');
    expect(frames.length).toBeGreaterThan(1);
    expect(frames[0].description).toContain('Starting BFS');
    expect(frames.some((f) => f.description?.includes('Visiting node A'))).toBe(true);
  });

  test('tree traversal returns correct inorder sequence', () => {
    const tree: TreeNode = {
      id: '1',
      value: 2,
      left: { id: '2', value: 1 },
      right: { id: '3', value: 3 },
    };

    const result = getTraversalResult(tree, 'inorder');
    expect(result).toEqual([1, 2, 3]);
  });

  test('array operation frames produce expected add/remove/search states', () => {
    const addFrames = visualizeArrayOperation([10, 20], 'add', 30);
    expect(addFrames.length).toBeGreaterThanOrEqual(2);
    expect(addFrames[addFrames.length - 1].array.map((a) => a.value)).toEqual([10, 20, 30]);

    const removeFrames = visualizeArrayOperation([10, 20], 'remove');
    expect(removeFrames[removeFrames.length - 1].array.map((a) => a.value)).toEqual([10]);

    const searchFrames = visualizeArrayOperation([10, 20, 30], 'search', 20);
    expect(searchFrames.some((s) => s.description?.includes('Found 20'))).toBe(true);
  });
});
