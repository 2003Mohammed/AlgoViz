
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onPlayPause?: () => void;
  onReset?: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  onSpeedUp?: () => void;
  onSpeedDown?: () => void;
}

export const useKeyboardShortcuts = ({
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedUp,
  onSpeedDown
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          onPlayPause?.();
          break;
        case 'r':
          event.preventDefault();
          onReset?.();
          break;
        case 'arrowright':
          event.preventDefault();
          onStepForward?.();
          break;
        case 'arrowleft':
          event.preventDefault();
          onStepBackward?.();
          break;
        case 'arrowup':
          event.preventDefault();
          onSpeedUp?.();
          break;
        case 'arrowdown':
          event.preventDefault();
          onSpeedDown?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayPause, onReset, onStepForward, onStepBackward, onSpeedUp, onSpeedDown]);
};
