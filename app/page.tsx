import Image from "next/image";
import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HOW_TO_PLAY = [
  "마우스(터치, 방향키)로 찌를 움직여 물고기를 피하며 깊이 내려갑니다.",
  "물고기에 닿으면 올라오기 시작합니다.",
  "올라오는 동안 닿은 것도 모두 잡히며, 최대 7마리까지 잡을 수 있습니다.",
  "깊이 내려갈수록 새로운 물고기가 나옵니다. 바위와 해초도 잡힙니다.",
];

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24">
      <Link
        href="/dex"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute top-4 right-4"
        )}
      >
        <BookOpenIcon data-icon="inline-start" />
        도감
      </Link>
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/fish/fish_orange.png"
          alt="주황색 물고기"
          width={128}
          height={128}
          priority
        />
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          물고기 낚시
        </h1>
      </div>
      <div className="flex gap-3">
        <Link href="/game?mode=slow" className={buttonVariants({ size: "lg" })}>
          시작하기 (느림)
        </Link>
        <Link href="/game?mode=fast" className={buttonVariants({ size: "lg" })}>
          시작하기 (빠름)
        </Link>
      </div>
      <section aria-labelledby="how-to-play" className="flex max-w-sm flex-col gap-2">
        <h2 id="how-to-play" className="text-sm font-medium">
          게임 방법
        </h2>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
          {HOW_TO_PLAY.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
