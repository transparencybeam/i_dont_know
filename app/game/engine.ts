import { FISH, type Fish } from "@/lib/fish";

export const WORLD_WIDTH = 400;
export const VIEW_HEIGHT = 560;
export const START_SCREEN_Y = 180;
export const SCREEN_MARGIN = 50;
export const MAX_CATCH = 7;
export const ZONE_DEPTH = 1000;

const DESCENT_SPEED = 190;
const ASCENT_SPEED = 260;
const FULL_ASCENT_SPEED = 780;
const KEY_SPEED = 320;
const POINTER_SPEED = 900;
export const BOBBER_RADIUS = 8;
export const FISH_HALF_WIDTH = 41;
export const FISH_HALF_HEIGHT = 22;
const FIRST_FISH_DEPTH = 360;
const MIN_SCALE = 0.7;
const MAX_SCALE = 1.5;
const MAX_LONG_SCALE = 1.15;

export type Phase = "descending" | "rising" | "done";

export type SwimmingFish = {
  id: number;
  kind: Fish;
  x: number;
  y: number;
  vx: number;
  /** 같은 종류 안에서의 크기 배율. 클수록 크고 느리다. */
  scale: number;
  caught: boolean;
};

export type GameState = {
  phase: Phase;
  /** 화면이 내려가고 올라오는 속도와 물고기 속도의 배율. */
  pace: number;
  /** 화면 위쪽 가장자리의 수심. 단계에 따라 자동으로 내려가거나 올라간다. */
  cameraY: number;
  x: number;
  /** 찌가 화면에서 놓인 높이. 플레이어가 조종한다. */
  screenY: number;
  /** 찌의 수심(cameraY + screenY). */
  y: number;
  maxDepth: number;
  fish: SwimmingFish[];
  caught: Fish[];
  nextSpawnY: number;
  nextFishId: number;
};

export type Input = {
  /** -1(왼쪽) ~ 1(오른쪽) */
  dirX: number;
  /** -1(위) ~ 1(아래) */
  dirY: number;
  /** 포인터로 가리킨 좌표. 없으면 null */
  targetX: number | null;
  targetY: number | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function createGame(
  start: { x?: number; screenY?: number; pace?: number } = {}
): GameState {
  const screenY = clamp(start.screenY ?? START_SCREEN_Y, SCREEN_MARGIN, VIEW_HEIGHT - SCREEN_MARGIN);
  return {
    phase: "descending",
    pace: start.pace ?? 1,
    cameraY: -screenY,
    x: clamp(start.x ?? WORLD_WIDTH / 2, BOBBER_RADIUS, WORLD_WIDTH - BOBBER_RADIUS),
    screenY,
    y: 0,
    maxDepth: 0,
    fish: [],
    caught: [],
    nextSpawnY: FIRST_FISH_DEPTH,
    nextFishId: 0,
  };
}

export function zoneAt(depth: number): number {
  const maxZone = Math.max(...FISH.map((fish) => fish.zone));
  return Math.min(maxZone, Math.floor(depth / ZONE_DEPTH));
}

function halfWidthOf(fish: SwimmingFish) {
  return FISH_HALF_WIDTH * fish.kind.length * fish.scale;
}

function halfHeightOf(fish: SwimmingFish) {
  return FISH_HALF_HEIGHT * fish.kind.height * fish.scale;
}

function spawnRow(state: GameState, rng: () => number) {
  const candidates = FISH.filter((fish) => fish.zone === zoneAt(state.nextSpawnY));
  const count = 1 + (rng() < 0.7 ? 1 : 0) + (rng() < 0.3 ? 1 : 0);
  const slotWidth = WORLD_WIDTH / count;
  for (let i = 0; i < count; i++) {
    const kind = candidates[Math.floor(rng() * candidates.length)];
    const maxScale = kind.length > 1 ? MAX_LONG_SCALE : MAX_SCALE;
    const scale = MIN_SCALE + rng() * (maxScale - MIN_SCALE);
    const direction = rng() < 0.5 ? -1 : 1;
    const fish: SwimmingFish = {
      id: state.nextFishId++,
      kind,
      x: 0,
      y: state.nextSpawnY + (rng() - 0.5) * 50,
      vx: (direction * kind.speed * state.pace * (0.9 + rng() * 0.2)) / scale,
      scale,
      caught: false,
    };
    const half = halfWidthOf(fish);
    fish.x = Math.max(half, Math.min(WORLD_WIDTH - half, (i + rng()) * slotWidth));
    state.fish.push(fish);
  }
  const gap = Math.max(90, 170 - state.nextSpawnY * 0.012);
  state.nextSpawnY += gap * (0.8 + rng() * 0.4);
}

function moveAxis(value: number, target: number | null, dir: number, dt: number) {
  if (target === null) return value + dir * KEY_SPEED * dt;
  const maxMove = POINTER_SPEED * dt;
  return value + Math.max(-maxMove, Math.min(maxMove, target - value));
}

export function step(
  state: GameState,
  dt: number,
  input: Input,
  rng: () => number = Math.random
) {
  if (state.phase === "done") return;

  state.x = Math.max(
    BOBBER_RADIUS,
    Math.min(WORLD_WIDTH - BOBBER_RADIUS, moveAxis(state.x, input.targetX, input.dirX, dt))
  );
  state.screenY = Math.max(
    SCREEN_MARGIN,
    Math.min(VIEW_HEIGHT - SCREEN_MARGIN, moveAxis(state.screenY, input.targetY, input.dirY, dt))
  );

  const ascentSpeed =
    (state.caught.length >= MAX_CATCH ? FULL_ASCENT_SPEED : ASCENT_SPEED) * state.pace;
  state.cameraY += (state.phase === "descending" ? DESCENT_SPEED * state.pace : -ascentSpeed) * dt;
  state.y = state.cameraY + state.screenY;
  state.maxDepth = Math.max(state.maxDepth, state.y);

  for (const fish of state.fish) {
    fish.x += fish.vx * dt;
    const half = halfWidthOf(fish);
    if (fish.x < half || fish.x > WORLD_WIDTH - half) {
      fish.vx = -fish.vx;
      fish.x = Math.max(half, Math.min(WORLD_WIDTH - half, fish.x));
    }
  }

  if (state.phase === "descending") {
    while (state.nextSpawnY < state.cameraY + VIEW_HEIGHT) spawnRow(state, rng);
  }

  for (const fish of state.fish) {
    if (fish.caught) continue;
    const hit =
      Math.abs(fish.x - state.x) < halfWidthOf(fish) + BOBBER_RADIUS &&
      Math.abs(fish.y - state.y) < halfHeightOf(fish) + BOBBER_RADIUS;
    if (!hit) continue;
    state.phase = "rising";
    if (state.caught.length < MAX_CATCH) {
      fish.caught = true;
      state.caught.push(fish.kind);
    }
  }

  if (state.phase === "rising" && state.y <= 0) {
    state.cameraY -= state.y;
    state.y = 0;
    state.phase = "done";
  }
}
