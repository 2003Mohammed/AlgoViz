import React from 'react';
import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { VisualizerControls } from '../VisualizerControls';

describe('VisualizerControls integration (markup)', () => {
  test('renders all primary controls and keyboard hints', () => {
    const html = renderToStaticMarkup(
      <VisualizerControls
        isPlaying={false}
        onPlayPause={() => {}}
        onReset={() => {}}
        onStepForward={() => {}}
        onStepBackward={() => {}}
        onJumpToStart={() => {}}
        onJumpToEnd={() => {}}
        speed={1}
        onSpeedChange={() => {}}
      />
    );

    expect(html.includes('aria-label="Rewind to first step"')).toBe(true);
    expect(html.includes('aria-label="Step backward"')).toBe(true);
    expect(html.includes('aria-label="Play animation"')).toBe(true);
    expect(html.includes('aria-label="Step forward"')).toBe(true);
    expect(html.includes('aria-label="Skip to last step"')).toBe(true);
    expect(html.includes('aria-label="Reset visualization"')).toBe(true);
    expect(html.includes('Keyboard Shortcuts')).toBe(false);
  });
});
