import React from 'react';
import { describe, expect, test, beforeAll } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import BFSVisualizer from '../visualizers/BFSVisualizer';
import { VisualizerControls } from '../VisualizerControls';

beforeAll(() => {
  (globalThis as any).localStorage = {
    getItem: () => null,
    setItem: () => undefined,
  };
});

describe('visualizer rendering integration', () => {
  test('graph visualizer markup does not render array-bar fallback', () => {
    const html = renderToStaticMarkup(<BFSVisualizer />);

    expect(html.includes('Graph data not available') || html.includes('<svg')).toBe(true);
    expect(html.includes('No data to visualize')).toBe(false);
  });

  test('play control remains enabled when frames exist', () => {
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
        disableForward={false}
        disableBackward={false}
      />
    );

    expect(html.includes('aria-label="Play animation"')).toBe(true);
    expect(html.includes('disabled=""')).toBe(false);
  });
});
