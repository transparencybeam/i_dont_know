import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Game } from "./game";
import { parseMode } from "./modes";

export default async function GamePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[] }>;
}) {
  const { mode } = await searchParams;
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute top-4 right-4"
        )}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        뒤로가기
      </Link>
      <Game mode={parseMode(mode)} />
    </main>
  );
}
