import { expect, test } from "vitest";

import { createGame, MAX_CATCH, step, type GameState } from "./engine";

const NO_INPUT = { dirX: 0, dirY: 0, targetX: null, targetY: null };
const rng = () => 0.5;

function fishAtBobber(state: GameState, count: number) {
  for (let i = 0; i < count; i++) {
    state.fish.push({
      id: 100 + i,
      kind: state.fish[0]?.kind ?? { id: "x", name: "x", image: "", zone: 0, speed: 0, length: 1, height: 1 },
      x: state.x,
      y: state.y,
      vx: 0,
      scale: 1,
      caught: false,
    });
  }
}

test("물고기에 부딪히기 전까지는 계속 내려간다", () => {
  const state = createGame();
  step(state, 1, NO_INPUT, rng);
  step(state, 1, NO_INPUT, rng);

  expect(state.phase).toBe("descending");
  expect(state.y).toBeGreaterThan(0);
});

test("처음 부딪히면 상승하고, 수면에 닿으면 끝난다", () => {
  const state = createGame();
  fishAtBobber(state, 1);
  step(state, 0.01, NO_INPUT, rng);

  expect(state.phase).toBe("rising");
  expect(state.caught).toHaveLength(1);

  for (let i = 0; i < 100 && state.phase !== "done"; i++) step(state, 0.5, NO_INPUT, rng);
  expect(state.phase).toBe("done");
  expect(state.y).toBe(0);
});

test("낚시 칸은 7칸을 넘지 않는다", () => {
  const state = createGame();
  fishAtBobber(state, MAX_CATCH + 3);
  step(state, 0.01, NO_INPUT, rng);

  expect(state.caught).toHaveLength(MAX_CATCH);
});

test("깊어질수록 더 깊은 구간의 물고기가 나온다", () => {
  const state = createGame();
  state.cameraY = 3500;
  state.nextSpawnY = 3500;
  step(state, 0.01, NO_INPUT, rng);

  expect(Math.max(...state.fish.map((fish) => fish.kind.zone))).toBe(3);
});

test("7칸이 다 차면 더 빨리 올라온다", () => {
  const full = createGame();
  fishAtBobber(full, MAX_CATCH);
  step(full, 0.01, NO_INPUT, rng);
  const few = createGame();
  fishAtBobber(few, 1);
  step(few, 0.01, NO_INPUT, rng);
  full.cameraY = few.cameraY = 1000;
  step(full, 0.1, NO_INPUT, rng);
  step(few, 0.1, NO_INPUT, rng);

  expect(full.y).toBeLessThan(few.y);
});

test("찌는 위아래로도 움직일 수 있다", () => {
  const state = createGame();
  const before = state.screenY;
  step(state, 0.1, { ...NO_INPUT, dirY: 1 }, rng);
  const down = state.screenY;
  step(state, 0.1, { ...NO_INPUT, dirY: -1 }, rng);

  expect(down).toBeGreaterThan(before);
  expect(state.screenY).toBeLessThan(down);
});

test("같은 깊이에 여러 마리가 겹쳐 나온다", () => {
  const state = createGame();
  step(state, 0.01, NO_INPUT, rng);
  const first = state.fish[0];
  const sameRow = state.fish.filter((fish) => Math.abs(fish.y - first.y) < 30);

  expect(sameRow.length).toBeGreaterThanOrEqual(2);
});

test("같은 종류도 크기가 다르고 클수록 느리다", () => {
  const state = createGame();
  state.cameraY = 2000;
  state.nextSpawnY = 2000;
  for (let i = 0; i < 20; i++) step(state, 0.01, NO_INPUT, Math.random);
  const moving = state.fish.filter((fish) => fish.kind.speed > 0);
  const small = moving.reduce((a, b) => (a.scale < b.scale ? a : b));
  const big = moving.reduce((a, b) => (a.scale > b.scale ? a : b));

  expect(big.scale).toBeGreaterThan(small.scale);
  expect(Math.abs(big.vx) / big.kind.speed).toBeLessThan(
    Math.abs(small.vx) / small.kind.speed
  );
});

test("바위와 해초는 움직이지 않는다", () => {
  const state = createGame();
  state.cameraY = 100;
  state.nextSpawnY = 100;
  for (let i = 0; i < 30; i++) step(state, 0.01, NO_INPUT, Math.random);
  const still = state.fish.filter((fish) => fish.kind.speed === 0);

  expect(still.length).toBeGreaterThan(0);
  expect(still.every((fish) => fish.vx === 0)).toBe(true);
});

test("지정한 위치에서 시작한다", () => {
  const state = createGame({ x: 320, screenY: 400 });

  expect(state.x).toBe(320);
  expect(state.screenY).toBe(400);
  expect(state.y).toBe(0);
  expect(state.cameraY).toBe(-400);
});

test("느린 배율이면 더 느리게 내려가고 물고기도 느리다", () => {
  const slow = createGame({ pace: 0.5 });
  const fast = createGame({ pace: 1 });
  for (const state of [slow, fast]) {
    state.cameraY = 2000;
    state.nextSpawnY = 2000;
    step(state, 0.1, NO_INPUT, rng);
  }

  expect(slow.cameraY).toBeLessThan(fast.cameraY);
  const slowFish = slow.fish.find((fish) => fish.kind.speed > 0);
  const fastFish = fast.fish.find((fish) => fish.kind.speed > 0);
  expect(Math.abs(slowFish!.vx)).toBeLessThan(Math.abs(fastFish!.vx));
});
