
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStart?: () => void;
  onJumpToEnd?: () => void;
  onSpeedUp?: () => void;
  onSpeedDown?: () => void;
}

export function useKeyboardShortcuts({
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  onJumpToStart,
  onJumpToEnd,
  onSpeedUp,
  onSpeedDown
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          onPlayPause();
          break;
        case 'KeyR':
          event.preventDefault();
          onReset();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onStepForward();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onStepBackward();
          break;
        case 'Home':
          if (onJumpToStart) {
            event.preventDefault();
            onJumpToStart();
          }
          break;
        case 'End':
          if (onJumpToEnd) {
            event.preventDefault();
            onJumpToEnd();
          }
          break;
        case 'ArrowUp':
          if (onSpeedUp) {
            event.preventDefault();
            onSpeedUp();
          }
          break;
        case 'ArrowDown':
          if (onSpeedDown) {
            event.preventDefault();
            onSpeedDown();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onPlayPause, onReset, onStepForward, onStepBackward, onJumpToStart, onJumpToEnd, onSpeedUp, onSpeedDown]);
}
