"use client";

import { useEffect } from "react";

import { rememberPointer } from "@/lib/pointer";

/** 페이지를 옮겨 다녀도 마지막 포인터 위치를 알 수 있게 전역에서 기록한다. */
export function PointerTracker() {
  useEffect(() => {
    window.addEventListener("pointermove", rememberPointer);
    window.addEventListener("pointerdown", rememberPointer);
    return () => {
      window.removeEventListener("pointermove", rememberPointer);
      window.removeEventListener("pointerdown", rememberPointer);
    };
  }, []);

  return null;
}
