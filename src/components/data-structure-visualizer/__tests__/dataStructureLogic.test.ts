import { describe, expect, test } from 'bun:test';
import {
  graphAddEdge,
  graphAddNode,
  graphRemoveEdge,
  graphRemoveNode,
  queueDequeue,
  queueEnqueue,
  rebuildLinkedList,
  stackPop,
  stackPush,
  treeTraversalOrder,
} from '../dataStructureLogic';

describe('data structure logic', () => {
  test('stack follows LIFO', () => {
    const pushed = stackPush([1, 2], 3);
    expect(pushed).toEqual([1, 2, 3]);
    const popped = stackPop(pushed);
    expect(popped.value).toBe(3);
    expect(popped.stack).toEqual([1, 2]);
  });

  test('queue follows FIFO', () => {
    const enq = queueEnqueue([1, 2], 3);
    const deq = queueDequeue(enq);
    expect(deq.value).toBe(1);
    expect(deq.queue).toEqual([2, 3]);
  });

  test('linked list rebuild keeps pointer integrity for doubly circular', () => {
    const list = rebuildLinkedList([10, 20, 30], 'circular-doubly');
    expect(list.nodes[0].next).toBe(1);
    expect(list.nodes[2].next).toBe(0);
    expect(list.nodes[0].prev).toBe(2);
    expect(list.nodes[1].prev).toBe(0);
  });

  test('tree traversal order correctness', () => {
    const tree = {
      nodes: [
        { value: 'A', left: 1, right: 2 },
        { value: 'B', left: null, right: null },
        { value: 'C', left: null, right: null },
      ],
      root: 0,
    };
    expect(treeTraversalOrder(tree, 'preorder')).toEqual([0, 1, 2]);
    expect(treeTraversalOrder(tree, 'inorder')).toEqual([1, 0, 2]);
    expect(treeTraversalOrder(tree, 'postorder')).toEqual([1, 2, 0]);
    expect(treeTraversalOrder(tree, 'levelorder')).toEqual([0, 1, 2]);
  });

  test('graph add/remove keeps integrity', () => {
    let graph: any = { nodes: [{ id: 'A' }, { id: 'B' }], edges: [] };
    graph = graphAddNode(graph, 'C');
    graph = graphAddEdge(graph, 'A', 'C', 2);
    expect(graph.edges.length).toBe(1);
    graph = graphRemoveEdge(graph, 'A', 'C');
    expect(graph.edges.length).toBe(0);
    graph = graphAddEdge(graph, 'A', 'B', 1);
    graph = graphRemoveNode(graph, 'B');
    expect(graph.nodes.some((n: any) => n.id === 'B')).toBe(false);
    expect(graph.edges.length).toBe(0);
  });
});
