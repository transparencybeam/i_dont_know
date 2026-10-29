import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import Home from "@/app/page";

test("시작 페이지는 이름, 시작하기 두 버전, 도감 진입점을 보여준다", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", { level: 1, name: "물고기 낚시" })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "시작하기 (느림)" })).toHaveAttribute(
    "href",
    "/game?mode=slow"
  );
  expect(screen.getByRole("link", { name: "시작하기 (빠름)" })).toHaveAttribute(
    "href",
    "/game?mode=fast"
  );
  expect(screen.getByRole("link", { name: "도감" })).toHaveAttribute(
    "href",
    "/dex"
  );
});
