export type LinkedListType = 'singly' | 'doubly' | 'circular' | 'circular-doubly';

export interface LinkedListNode {
  id: string;
  value: string | number;
  next: number | null;
  prev?: number | null;
}

export interface LinkedListStructure {
  nodes: LinkedListNode[];
  head: number | null;
  type: LinkedListType;
}

export const rebuildLinkedList = (values: Array<string | number>, type: LinkedListType): LinkedListStructure => {
  const nodes = values.map((value, index) => ({
    id: `n-${index}-${String(value)}`,
    value,
    next: type.includes('circular') ? (index === values.length - 1 ? (values.length ? 0 : null) : index + 1) : index < values.length - 1 ? index + 1 : null,
    prev: type.includes('doubly') ? (index === 0 ? (type.includes('circular') && values.length ? values.length - 1 : null) : index - 1) : undefined,
  }));
  return { nodes, head: values.length ? 0 : null, type };
};

export const stackPush = (stack: Array<string | number>, value: string | number) => [...stack, value];
export const stackPop = (stack: Array<string | number>) => ({ stack: stack.slice(0, -1), value: stack.at(-1) });
export const stackPeek = (stack: Array<string | number>) => stack.at(-1);

export const queueEnqueue = (queue: Array<string | number>, value: string | number) => [...queue, value];
export const queueDequeue = (queue: Array<string | number>) => ({ queue: queue.slice(1), value: queue[0] });
export const queuePeek = (queue: Array<string | number>) => queue[0];

export const treeTraversalOrder = (tree: { nodes: Array<{ left: number | null; right: number | null; value: any }>; root: number | null }, order: 'inorder' | 'preorder' | 'postorder' | 'levelorder') => {
  const out: number[] = [];
  if (tree.root === null) return out;
  if (order === 'levelorder') {
    const q = [tree.root];
    while (q.length) {
      const i = q.shift()!;
      out.push(i);
      const n = tree.nodes[i];
      if (n?.left !== null) q.push(n.left);
      if (n?.right !== null) q.push(n.right);
    }
    return out;
  }
  const dfs = (idx: number | null) => {
    if (idx === null) return;
    const n = tree.nodes[idx];
    if (!n) return;
    if (order === 'preorder') out.push(idx);
    dfs(n.left);
    if (order === 'inorder') out.push(idx);
    dfs(n.right);
    if (order === 'postorder') out.push(idx);
  };
  dfs(tree.root);
  return out;
};

export const graphAddNode = (graph: any, id: string) => ({ ...graph, nodes: [...graph.nodes, { id, x: 70 + (graph.nodes.length % 4) * 140, y: 70 + Math.floor(graph.nodes.length / 4) * 120 }] });
export const graphRemoveNode = (graph: any, id: string) => ({
  ...graph,
  nodes: graph.nodes.filter((n: any) => n.id !== id),
  edges: graph.edges.filter((e: any) => e.source !== id && e.target !== id),
});
export const graphAddEdge = (graph: any, source: string, target: string, weight = 1) => {
  if (!source || !target || source === target) return graph;
  if (graph.edges.some((e: any) => e.source === source && e.target === target)) return graph;
  return { ...graph, edges: [...graph.edges, { source, target, weight }] };
};
export const graphRemoveEdge = (graph: any, source: string, target: string) => ({
  ...graph,
  edges: graph.edges.filter((e: any) => !(e.source === source && e.target === target)),
});
