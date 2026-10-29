import { beforeEach, expect, test } from "vitest";

import { recordCatch } from "./collection";

beforeEach(() => localStorage.clear());

test("낚은 물고기는 중복 없이 저장된다", () => {
  recordCatch(["orange", "orange", "pink"]);
  recordCatch(["pink", "blue"]);

  expect(JSON.parse(localStorage.getItem("fishing-game:caught")!)).toEqual([
    "orange",
    "pink",
    "blue",
  ]);
});
