import { GraphData, GraphNode, GraphEdge } from '../types/visualizer';

export const generateRandomGraph = (): GraphData => {
  const graphTypes = ['social', 'transport', 'network'];
  const graphType = graphTypes[Math.floor(Math.random() * graphTypes.length)];
  
  switch (graphType) {
    case 'social':
      return generateSocialNetworkGraph();
    case 'transport':
      return generateTransportGraph();
    case 'network':
      return generateDeviceNetworkGraph();
    default:
      return generateSocialNetworkGraph();
  }
};

const generateSocialNetworkGraph = (): GraphData => {
  const people = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank'];
  const shuffled = [...people].sort(() => Math.random() - 0.5);
  const selectedPeople = shuffled.slice(0, 4 + Math.floor(Math.random() * 3));
  
  const nodes: GraphNode[] = selectedPeople.map((person, index) => ({
    id: person,
    x: 100 + (index % 3) * 150,
    y: 80 + Math.floor(index / 3) * 120,
    status: 'default'
  }));
  
  const edges: GraphEdge[] = [];
  const numEdges = Math.max(selectedPeople.length - 1, Math.floor(selectedPeople.length * 1.5));
  
  // Ensure connected graph
  for (let i = 0; i < selectedPeople.length - 1; i++) {
    edges.push({
      source: selectedPeople[i],
      target: selectedPeople[i + 1],
      weight: Math.floor(Math.random() * 5) + 1,
      status: 'default'
    });
  }
  
  // Add random additional connections
  while (edges.length < numEdges) {
    const source = selectedPeople[Math.floor(Math.random() * selectedPeople.length)];
    const target = selectedPeople[Math.floor(Math.random() * selectedPeople.length)];
    
    if (source !== target && !edges.some(e => 
      (e.source === source && e.target === target) || 
      (e.source === target && e.target === source)
    )) {
      edges.push({
        source,
        target,
        weight: Math.floor(Math.random() * 5) + 1,
        status: 'default'
      });
    }
  }
  
  return { nodes, edges };
};

const generateTransportGraph = (): GraphData => {
  const cities = ['NYC', 'LA', 'Chicago', 'Houston', 'Phoenix', 'Miami'];
  const shuffled = [...cities].sort(() => Math.random() - 0.5);
  const selectedCities = shuffled.slice(0, 4 + Math.floor(Math.random() * 3));
  
  const nodes: GraphNode[] = selectedCities.map((city, index) => ({
    id: city,
    x: 80 + (index % 3) * 160,
    y: 70 + Math.floor(index / 3) * 130,
    status: 'default'
  }));
  
  const edges: GraphEdge[] = [];
  const numEdges = Math.max(selectedCities.length - 1, Math.floor(selectedCities.length * 1.3));
  
  // Create connected routes
  for (let i = 0; i < selectedCities.length - 1; i++) {
    edges.push({
      source: selectedCities[i],
      target: selectedCities[i + 1],
      weight: Math.floor(Math.random() * 500) + 100, // Distance in miles
      status: 'default'
    });
  }
  
  // Add additional routes
  while (edges.length < numEdges) {
    const source = selectedCities[Math.floor(Math.random() * selectedCities.length)];
    const target = selectedCities[Math.floor(Math.random() * selectedCities.length)];
    
    if (source !== target && !edges.some(e => 
      (e.source === source && e.target === target) || 
      (e.source === target && e.target === source)
    )) {
      edges.push({
        source,
        target,
        weight: Math.floor(Math.random() * 500) + 100,
        status: 'default'
      });
    }
  }
  
  return { nodes, edges };
};

const generateDeviceNetworkGraph = (): GraphData => {
  const devices = ['Router', 'Server', 'PC1', 'PC2', 'Laptop', 'Printer'];
  const shuffled = [...devices].sort(() => Math.random() - 0.5);
  const selectedDevices = shuffled.slice(0, 4 + Math.floor(Math.random() * 3));
  
  const nodes: GraphNode[] = selectedDevices.map((device, index) => ({
    id: device,
    x: 90 + (index % 3) * 140,
    y: 75 + Math.floor(index / 3) * 125,
    status: 'default'
  }));
  
  const edges: GraphEdge[] = [];
  const numEdges = Math.max(selectedDevices.length - 1, Math.floor(selectedDevices.length * 1.4));
  
  // Ensure network connectivity
  for (let i = 0; i < selectedDevices.length - 1; i++) {
    edges.push({
      source: selectedDevices[i],
      target: selectedDevices[i + 1],
      weight: Math.floor(Math.random() * 10) + 1, // Latency in ms
      status: 'default'
    });
  }
  
  // Add network connections
  while (edges.length < numEdges) {
    const source = selectedDevices[Math.floor(Math.random() * selectedDevices.length)];
    const target = selectedDevices[Math.floor(Math.random() * selectedDevices.length)];
    
    if (source !== target && !edges.some(e => 
      (e.source === source && e.target === target) || 
      (e.source === target && e.target === source)
    )) {
      edges.push({
        source,
        target,
        weight: Math.floor(Math.random() * 10) + 1,
        status: 'default'
      });
    }
  }
  
  return { nodes, edges };
};

// Graph traversal algorithms
export const generateBFSSteps = (graph: GraphData, startNodeId: string): any[] => {
  const steps: any[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];
  
  steps.push({
    nodes: graph.nodes.map(n => ({ 
      ...n, 
      status: n.id === startNodeId ? 'current' : 'default' 
    })),
    edges: graph.edges.map(e => ({ ...e, status: 'default' })),
    description: `Starting BFS from ${startNodeId}`
  });
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    visited.add(currentId);
    
    // Find neighbors
    const neighbors = graph.edges
      .filter(e => e.source === currentId || e.target === currentId)
      .map(e => e.source === currentId ? e.target : e.source)
      .filter(nodeId => !visited.has(nodeId) && !queue.includes(nodeId));
    
    // Add neighbors to queue
    neighbors.forEach(neighborId => {
      if (!queue.includes(neighborId)) {
        queue.push(neighborId);
      }
    });
    
    steps.push({
      nodes: graph.nodes.map(n => ({ 
        ...n, 
        status: n.id === currentId ? 'completed' : 
                visited.has(n.id) ? 'visited' : 
                queue.includes(n.id) ? 'processing' : 'default'
      })),
      edges: graph.edges.map(e => ({
        ...e,
        status: (e.source === currentId || e.target === currentId) && 
                (visited.has(e.source) || visited.has(e.target)) ? 'visited' : 'default'
      })),
      description: `Visited ${currentId}, exploring neighbors: ${neighbors.join(', ')}`
    });
  }
  
  return steps;
};

export const generateDFSSteps = (graph: GraphData, startNodeId: string): any[] => {
  const steps: any[] = [];
  const visited = new Set<string>();
  
  const dfsHelper = (nodeId: string) => {
    visited.add(nodeId);
    
    steps.push({
      nodes: graph.nodes.map(n => ({ 
        ...n, 
        status: n.id === nodeId ? 'completed' : 
                visited.has(n.id) ? 'visited' : 'default'
      })),
      edges: graph.edges.map(e => ({
        ...e,
        status: (visited.has(e.source) && visited.has(e.target)) ? 'visited' : 'default'
      })),
      description: `Visited ${nodeId} using DFS`
    });
    
    // Find unvisited neighbors
    const neighbors = graph.edges
      .filter(e => (e.source === nodeId || e.target === nodeId))
      .map(e => e.source === nodeId ? e.target : e.source)
      .filter(neighborId => !visited.has(neighborId));
    
    // Recursively visit neighbors
    neighbors.forEach(neighborId => {
      if (!visited.has(neighborId)) {
        dfsHelper(neighborId);
      }
    });
  };
  
  steps.push({
    nodes: graph.nodes.map(n => ({ 
      ...n, 
      status: n.id === startNodeId ? 'current' : 'default' 
    })),
    edges: graph.edges.map(e => ({ ...e, status: 'default' })),
    description: `Starting DFS from ${startNodeId}`
  });
  
  dfsHelper(startNodeId);
  
  return steps;
};