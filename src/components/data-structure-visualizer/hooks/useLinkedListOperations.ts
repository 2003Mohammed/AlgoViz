
export const useLinkedListOperations = (
  structure: any,
  customInput: string,
  setStructure: React.Dispatch<React.SetStateAction<any>>,
  addLogEntry: (message: string) => void,
  setOperationResult: React.Dispatch<React.SetStateAction<any>>,
  setCustomInput: React.Dispatch<React.SetStateAction<string>>
) => {
  const handleAdd = () => {
    if (!customInput) {
      addLogEntry("Please enter a value to add");
      return null;
    }
    
    const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
    const newNode = { value, next: null };
    const newNodes = [...structure.nodes];
    let newStructure;
    
    if (newNodes.length === 0) {
      newNodes.push(newNode);
      newStructure = { nodes: newNodes, head: 0 };
    } else {
      const lastNodeIndex = newNodes.length - 1;
      newNodes[lastNodeIndex].next = newNodes.length;
      newNodes.push(newNode);
      newStructure = { ...structure, nodes: newNodes };
    }
    
    addLogEntry(`Added ${value} to the linked list`);
    setStructure(newStructure);
    setOperationResult(null);
    setCustomInput('');
    
    return newStructure;
  };
  
  const handleRemove = () => {
    const { nodes, head } = structure;
    if (nodes.length === 0 || head === null) {
      addLogEntry("Linked list is empty");
      return null;
    }
    
    const newNodes = [...nodes];
    const result = newNodes[head].value;
    let newStructure;
    
    if (newNodes[head].next === null) {
      newStructure = { nodes: [], head: null };
    } else {
      newStructure = { nodes: newNodes, head: newNodes[head].next };
    }
    
    addLogEntry(`Removed ${result} from the linked list`);
    setStructure(newStructure);
    setOperationResult(result);
    setCustomInput('');
    
    return newStructure;
  };
  
  const handleSearch = () => {
    if (!customInput) {
      addLogEntry("Please enter a value to search");
      return null;
    }
    
    const value = isNaN(Number(customInput)) ? customInput : Number(customInput);
    const { nodes, head } = structure;
    let found = false;
    let current = head;
    let index = 0;
    
    while (current !== null) {
      if (nodes[current].value === value) {
        found = true;
        break;
      }
      current = nodes[current].next;
      index++;
    }
    
    addLogEntry(`Search result: ${found ? `Found at position ${index}` : 'Not found'}`);
    setOperationResult(found ? index : -1);
    setCustomInput('');
    
    return structure;
  };
  
  return { handleAdd, handleRemove, handleSearch };
};
