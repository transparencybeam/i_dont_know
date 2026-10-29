"use client";

import Image from "next/image";

import { FISH, useCaughtFishIds } from "@/lib/fish";

export function DexGrid() {
  const caught = useCaughtFishIds();

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {FISH.filter((fish) => caught.includes(fish.id)).length} / {FISH.length}
      </p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {FISH.map((fish) => {
          const isCaught = caught.includes(fish.id);
          return (
            <li
              key={fish.id}
              className="flex flex-col items-center gap-2 rounded-lg bg-muted p-4"
            >
              <div className="relative flex size-20 items-center justify-center">
                {isCaught ? (
                  <Image src={fish.image} alt={fish.name} fill sizes="80px" className="object-contain" />
                ) : (
                  <span
                    aria-label="아직 낚지 못한 물고기"
                    className="text-5xl font-semibold text-muted-foreground"
                  >
                    ?
                  </span>
                )}
              </div>
              <span className="text-sm">{isCaught ? fish.name : "???"}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
