import { createSplash, TILE_PRESETS } from 'even-toolkit/splash';

/**
 * Workout splash renderer — dumbbell icon + app name.
 * Single tile (200x100), top-center on display.
 * "LOADING..." is shown as text in the menu container below.
 * Reusable: used for both G2 glasses splash and web hero canvas.
 */
export function renderWorkoutSplash(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const fg = '#e0e0e0';
  const cx = w / 2;

  // Scale factor (designed for 200x200 canvas, only top 100px is used for the tile)
  const s = Math.min(w / 200, h / 200);

  const midY = 40 * s; // vertical center of dumbbell area

  // Horizontal bar
  ctx.fillStyle = fg;
  const barW = 60 * s;
  const barH = 6 * s;
  ctx.fillRect(cx - barW / 2, midY - barH / 2, barW, barH);

  // Weight plates (left side)
  ctx.fillStyle = '#404040';
  ctx.strokeStyle = fg;
  ctx.lineWidth = 2 * s;

  const plateW = 10 * s;
  const outerH = 36 * s;
  const innerH = 28 * s;
  const leftEdge = cx - barW / 2;

  ctx.fillRect(leftEdge - plateW * 2, midY - outerH / 2, plateW, outerH);
  ctx.strokeRect(leftEdge - plateW * 2, midY - outerH / 2, plateW, outerH);

  ctx.fillRect(leftEdge - plateW, midY - innerH / 2, plateW, innerH);
  ctx.strokeRect(leftEdge - plateW, midY - innerH / 2, plateW, innerH);

  // Weight plates (right side)
  const rightEdge = cx + barW / 2;

  ctx.fillRect(rightEdge, midY - innerH / 2, plateW, innerH);
  ctx.strokeRect(rightEdge, midY - innerH / 2, plateW, innerH);

  ctx.fillRect(rightEdge + plateW, midY - outerH / 2, plateW, outerH);
  ctx.strokeRect(rightEdge + plateW, midY - outerH / 2, plateW, outerH);

  // Bar end caps
  ctx.fillStyle = fg;
  const capW = 4 * s;
  const capH = 10 * s;
  ctx.fillRect(leftEdge - plateW * 2 - capW, midY - capH / 2, capW, capH);
  ctx.fillRect(rightEdge + plateW * 2, midY - capH / 2, capW, capH);

  // App name
  ctx.fillStyle = fg;
  ctx.font = `bold ${14 * s}px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('EVENWORKOUT', cx, 88 * s);

  ctx.textAlign = 'left';
}

/**
 * G2 glasses splash — 1 image tile (dumbbell + name) top-center,
 * "LOADING..." as centered text in the menu container below.
 */
export const workoutSplash = createSplash({
  tiles: 1,
  tileLayout: 'vertical',
  tilePositions: TILE_PRESETS.topCenter1,
  canvasSize: { w: 200, h: 200 },
  minTimeMs: 2500,
  maxTimeMs: 5000,
  menuText: '\n\n' + ' '.repeat(48) + 'LOADING...',
  render: renderWorkoutSplash,
});
