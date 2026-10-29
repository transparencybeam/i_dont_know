"use client";

import { useEffect, useRef } from "react";

import {
  createGame,
  step,
  VIEW_HEIGHT,
  WORLD_WIDTH,
  type GameState,
  type Input,
} from "./engine";
import { getLastPointer } from "@/lib/pointer";

import { drawScene, loadFishImages } from "./render";

const LEFT_KEYS = ["ArrowLeft", "a", "A"];
const RIGHT_KEYS = ["ArrowRight", "d", "D"];
const UP_KEYS = ["ArrowUp", "w", "W"];
const DOWN_KEYS = ["ArrowDown", "s", "S"];
const MOVE_KEYS = [...LEFT_KEYS, ...RIGHT_KEYS, ...UP_KEYS, ...DOWN_KEYS];

export function GameCanvas({
  pace,
  onFinish,
}: {
  pace: number;
  onFinish: (state: GameState) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = WORLD_WIDTH * dpr;
    canvas.height = VIEW_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    const toWorld = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) * WORLD_WIDTH) / rect.width,
        y: ((clientY - rect.top) * VIEW_HEIGHT) / rect.height,
      };
    };
    const startPointer = getLastPointer();
    const startPosition = startPointer
      ? toWorld(startPointer.clientX, startPointer.clientY)
      : null;
    const state = createGame({ x: startPosition?.x, screenY: startPosition?.y, pace });
    const images = loadFishImages();
    const input: Input = { dirX: 0, dirY: 0, targetX: null, targetY: null };
    const held = new Set<string>();

    const updateDir = () => {
      const pressed = (keys: string[]) => (keys.some((key) => held.has(key)) ? 1 : 0);
      input.dirX = pressed(RIGHT_KEYS) - pressed(LEFT_KEYS);
      input.dirY = pressed(DOWN_KEYS) - pressed(UP_KEYS);
      if (input.dirX !== 0 || input.dirY !== 0) {
        input.targetX = null;
        input.targetY = null;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!MOVE_KEYS.includes(event.key)) return;
      event.preventDefault();
      held.add(event.key);
      updateDir();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      held.delete(event.key);
      updateDir();
    };
    const onPointerMove = (event: PointerEvent) => {
      const position = toWorld(event.clientX, event.clientY);
      input.targetX = position.x;
      input.targetY = position.y;
    };
    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      input.targetX = null;
      input.targetY = null;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("pointerdown", onPointerMove);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerEnd);
    window.addEventListener("pointercancel", onPointerEnd);

    let last = performance.now();
    let frameId = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(state, dt, input);
      drawScene(ctx, state, images);
      if (state.phase === "done") {
        onFinish(state);
        return;
      }
      frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
    };
  }, [onFinish, pace]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="낚시 게임 화면"
      className="aspect-[400/560] w-full max-w-sm touch-none rounded-lg"
    />
  );
}
