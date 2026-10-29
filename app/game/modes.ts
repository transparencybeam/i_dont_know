export const MODES = {
  slow: { label: "느린 버전", pace: 0.8 },
  fast: { label: "빠른 버전", pace: 1.3 },
} as const;

export type ModeId = keyof typeof MODES;

export function parseMode(value: string | string[] | undefined): ModeId {
  const id = Array.isArray(value) ? value[0] : value;
  return id === "slow" ? "slow" : "fast";
}
