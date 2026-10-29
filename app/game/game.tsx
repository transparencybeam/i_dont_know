"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { recordCatch, type Fish } from "@/lib/fish";

import type { GameState } from "./engine";
import { GameCanvas } from "./game-canvas";
import { MODES, type ModeId } from "./modes";

type Result = { caught: Fish[]; depth: number };

export function Game({ mode }: { mode: ModeId }) {
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const handleFinish = useCallback((state: GameState) => {
    recordCatch(state.caught.map((fish) => fish.id));
    setResult({ caught: [...state.caught], depth: state.maxDepth });
  }, []);

  const restart = () => {
    setResult(null);
    setRound((value) => value + 1);
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div className="relative flex w-full justify-center">
        <GameCanvas key={round} pace={MODES[mode].pace} onFinish={handleFinish} />
      {result && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-lg bg-background/90 p-6">
          <h2 className="font-heading text-xl font-semibold">낚시 끝!</h2>
          <p className="text-xs text-muted-foreground">{MODES[mode].label}</p>
          <p className="text-sm text-muted-foreground">
            최고 수심 {Math.floor(result.depth / 10)}m
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {result.caught.map((fish, i) => (
              <li key={i} className="flex flex-col items-center gap-1 text-xs">
                <Image src={fish.image} alt={fish.name} width={48 * fish.length} height={48} />
                {fish.name}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={restart}>다시하기</Button>
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              시작 페이지로
            </Link>
            <Link href="/dex" className={buttonVariants({ variant: "outline" })}>
              도감보기
            </Link>
          </div>
        </div>
      )}
      </div>
      {!result && (
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          끝내기
        </Link>
      )}
    </div>
  );
}
