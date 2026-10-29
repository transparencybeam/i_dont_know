import { expect, test } from "@playwright/test";

test("시작, 게임, 도감 페이지를 오갈 수 있다", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("물고기 낚시");

  await page.getByRole("link", { name: "시작하기 (빠름)" }).click();
  await expect(page).toHaveURL("/game?mode=fast");
  await page.getByRole("link", { name: "끝내기" }).click();
  await expect(page).toHaveURL("/");

  await page.getByRole("link", { name: "시작하기 (빠름)" }).click();
  await page.getByRole("link", { name: "뒤로가기" }).click();
  await expect(page).toHaveURL("/");

  await page.getByRole("link", { name: "도감" }).click();
  await expect(page).toHaveURL("/dex");
  await page.getByRole("link", { name: "뒤로가기" }).click();
  await expect(page).toHaveURL("/");
});
