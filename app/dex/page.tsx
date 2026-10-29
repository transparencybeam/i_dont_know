import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { DexGrid } from "./dex-grid";

export default function DexPage() {
  return (
    <main className="relative flex flex-1 flex-col gap-6 px-6 py-6">
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
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        도감
      </h1>
      <DexGrid />
    </main>
  );
}
