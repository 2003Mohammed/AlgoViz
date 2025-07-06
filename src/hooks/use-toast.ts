
import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

let memoryState: { toasts: Toast[] } = { toasts };

function dispatch(action: { type: string; toast?: Toast; toastId?: string }) {
  switch (action.type) {
    case 'ADD_TOAST':
      if (action.toast) {
        memoryState.toasts = [action.toast, ...memoryState.toasts];
      }
      break;
    case 'UPDATE_TOAST':
      if (action.toast) {
        memoryState.toasts = memoryState.toasts.map((t) =>
          t.id === action.toast!.id ? { ...t, ...action.toast } : t
        );
      }
      break;
    case 'DISMISS_TOAST':
      if (action.toastId) {
        memoryState.toasts = memoryState.toasts.filter((t) => t.id !== action.toastId);
      }
      break;
    case 'REMOVE_TOAST':
      if (action.toastId) {
        memoryState.toasts = memoryState.toasts.filter((t) => t.id !== action.toastId);
      }
      break;
  }

  listeners.forEach((listener) => {
    listener(memoryState.toasts);
  });
}

function genId() {
  return Math.random().toString(36).substr(2, 9);
}

export function toast(props: Omit<Toast, 'id'>) {
  const id = genId();
  
  const toastWithId = {
    ...props,
    id,
  };

  dispatch({
    type: 'ADD_TOAST',
    toast: toastWithId,
  });

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    dispatch({
      type: 'DISMISS_TOAST',
      toastId: id,
    });
  }, 5000);

  return {
    id,
    dismiss: () => dispatch({ type: 'DISMISS_TOAST', toastId: id }),
    update: (props: Partial<Toast>) =>
      dispatch({ type: 'UPDATE_TOAST', toast: { ...toastWithId, ...props } }),
  };
}

export function useToast() {
  const [state, setState] = useState<{ toasts: Toast[] }>(memoryState);

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const unsubscribe = useCallback(() => {
    listeners = [];
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
    subscribe,
    unsubscribe,
  };
}
