import { FISH } from "@/lib/fish";

import {
  BOBBER_RADIUS,
  MAX_CATCH,
  VIEW_HEIGHT,
  WORLD_WIDTH,
  type GameState,
} from "./engine";

const FISH_DRAW_WIDTH = 88;
const CAUGHT_DRAW_WIDTH = 40;
// 밝은 곳 -> 어둡지만 보이는 곳 -> 찌 주변만 보이는 곳
const DIM_START_DEPTH = 500;
const DARK_START_DEPTH = 2200;
const PITCH_BLACK_DEPTH = 3200;
const DIM_DARKNESS = 0.6;
const DIM_LIGHT: [number, number] = [60, 170];
const BLACK_LIGHT: [number, number] = [20, 80];
const SKY_COLOR = "#cfeaff";
const SHALLOW: [number, number, number] = [79, 179, 232];
const DEEP: [number, number, number] = [10, 31, 68];
const DEEPEST_DEPTH = 4000;

export type FishImages = Map<string, HTMLImageElement>;

export function loadFishImages(): FishImages {
  const images: FishImages = new Map();
  for (const fish of FISH) {
    const image = new Image();
    image.src = fish.image;
    images.set(fish.id, image);
  }
  return images;
}

function waterColor(depth: number) {
  const t = Math.max(0, Math.min(1, depth / DEEPEST_DEPTH));
  const [r, g, b] = SHALLOW.map((from, i) => Math.round(from + (DEEP[i] - from) * t));
  return `rgb(${r}, ${g}, ${b})`;
}

function drawFish(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  x: number,
  y: number,
  width: number,
  facingLeft: boolean
) {
  if (!image || !image.complete || image.naturalWidth === 0) return;
  const height = (width * image.naturalHeight) / image.naturalWidth;
  ctx.save();
  ctx.translate(x, y);
  if (facingLeft) ctx.scale(-1, 1);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function drawDarkness(ctx: CanvasRenderingContext2D, depth: number, lightX: number, lightY: number) {
  const dim = Math.max(0, Math.min(1, (depth - DIM_START_DEPTH) / (DARK_START_DEPTH - DIM_START_DEPTH)));
  if (dim <= 0) return;
  const black = Math.max(0, Math.min(1, (depth - DARK_START_DEPTH) / (PITCH_BLACK_DEPTH - DARK_START_DEPTH)));
  const alpha = lerp(0, DIM_DARKNESS, dim) + (1 - DIM_DARKNESS) * black;
  const inner = lerp(DIM_LIGHT[0], BLACK_LIGHT[0], black);
  const outer = lerp(DIM_LIGHT[1], BLACK_LIGHT[1], black);
  const light = ctx.createRadialGradient(lightX, lightY, inner, lightX, lightY, outer);
  light.addColorStop(0, "rgba(2, 8, 20, 0)");
  light.addColorStop(1, `rgba(2, 8, 20, ${alpha})`);
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, WORLD_WIDTH, VIEW_HEIGHT);
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  images: FishImages
) {
  const cameraY = state.cameraY;
  const surfaceY = -cameraY;

  ctx.fillStyle = SKY_COLOR;
  ctx.fillRect(0, 0, WORLD_WIDTH, VIEW_HEIGHT);
  ctx.fillStyle = waterColor(state.y);
  ctx.fillRect(0, Math.max(0, surfaceY), WORLD_WIDTH, VIEW_HEIGHT);

  for (const fish of state.fish) {
    if (fish.caught) continue;
    const screenY = fish.y - cameraY;
    if (screenY < -30 || screenY > VIEW_HEIGHT + 30) continue;
    drawFish(ctx, images.get(fish.kind.id), fish.x, screenY, FISH_DRAW_WIDTH * fish.kind.length * fish.scale, fish.vx < 0);
  }

  drawDarkness(ctx, state.y, state.x, state.screenY);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(state.x, Math.max(0, surfaceY));
  ctx.lineTo(state.x, state.screenY);
  ctx.stroke();

  state.caught.forEach((fish, i) => {
    const offsetX = (i - (MAX_CATCH - 1) / 2) * 22;
    const offsetY = 22 + (i % 2) * 14;
    drawFish(ctx, images.get(fish.id), state.x + offsetX, state.screenY + offsetY, CAUGHT_DRAW_WIDTH * fish.length, false);
  });

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(state.x, state.screenY, BOBBER_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e5484d";
  ctx.beginPath();
  ctx.arc(state.x, state.screenY, BOBBER_RADIUS, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 14px sans-serif";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(`수심 ${Math.floor(state.y / 10)}m`, 12, 12);
  ctx.textAlign = "right";
  ctx.fillText(`${state.caught.length} / ${MAX_CATCH}`, WORLD_WIDTH - 12, 12);
}
