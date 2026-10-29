export type PointerPosition = { clientX: number; clientY: number };

let last: PointerPosition | null = null;

export function rememberPointer(position: PointerPosition) {
  last = { clientX: position.clientX, clientY: position.clientY };
}

export function getLastPointer(): PointerPosition | null {
  return last;
}
