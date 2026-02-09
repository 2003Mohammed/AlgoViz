import React, { createContext, useContext, useMemo, useState } from 'react';

export type TutorAlgorithmId = 'bfs' | 'dfs' | 'dijkstra' | 'astar' | null;

export interface TutorVisualizationState {
  algorithmId: TutorAlgorithmId;
  algorithmName?: string;
  stepIndex: number;
  totalSteps: number;
  stepDescription?: string;
  currentNode?: string;
  queue?: string[];
  stack?: string[];
  openSet?: string[];
  closedSet?: string[];
  path?: string[];
  distances?: Record<string, number>;
}

interface TutorContextValue {
  visualizationState: TutorVisualizationState;
  updateVisualizationState: (updates: Partial<TutorVisualizationState>) => void;
  resetVisualizationState: () => void;
}

const initialState: TutorVisualizationState = {
  algorithmId: null,
  stepIndex: 0,
  totalSteps: 0
};

const TutorContext = createContext<TutorContextValue | undefined>(undefined);

export const TutorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visualizationState, setVisualizationState] = useState<TutorVisualizationState>(initialState);

  const updateVisualizationState = (updates: Partial<TutorVisualizationState>) => {
    setVisualizationState((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const resetVisualizationState = () => {
    setVisualizationState(initialState);
  };

  const value = useMemo(
    () => ({
      visualizationState,
      updateVisualizationState,
      resetVisualizationState
    }),
    [visualizationState]
  );

  return <TutorContext.Provider value={value}>{children}</TutorContext.Provider>;
};

export const useTutorContext = () => {
  const context = useContext(TutorContext);
  if (!context) {
    throw new Error('useTutorContext must be used within TutorProvider');
  }
  return context;
};
