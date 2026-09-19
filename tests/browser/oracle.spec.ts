import { expect, test } from "@playwright/test";

test("consults the oracle without sending the offering elsewhere", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const foreignRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:4173") foreignRequests.push(request.url());
  });

  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("cootieoracle");
  await page.getByLabel("phrase / name / allegation").fill("cootie oracle");
  await page.getByRole("button", { name: "fold my fate" }).click();

  const result = page.locator("#result-panel");
  await expect(result).toBeVisible();
  await expect(result.getByRole("heading", { name: "zone 5" })).toBeVisible();
  await expect(page.locator("#result-value")).toHaveText("AQ / 229");
  await expect(page.locator("#result-arcana")).toHaveText("the lovers");
  await expect(page.locator("#result-passage")).toHaveText("first return · reversed");
  await expect(page.locator("#result-fortune")).toContainText("escape the labyrinth");
  await expect(page.locator("#machine-status")).toHaveText("flap lifted / receipt issued");
  await expect(result).toBeFocused();

  const storedKeys = await page.evaluate(() => ({
    local: Object.keys(window.localStorage),
    session: Object.keys(window.sessionStorage),
  }));
  expect(storedKeys).toEqual({ local: [], session: [] });
  expect(foreignRequests).toEqual([]);

  await page.screenshot({ path: testInfo.outputPath("desktop-revealed.png"), fullPage: true });
});

test("keeps the reduced-motion phone path usable", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  await page.getByLabel("phrase / name / allegation").fill("a");
  await page.getByRole("radio", { name: /^02 Ordinal/ }).check();
  await page.getByLabel("phrase / name / allegation").press("Enter");

  await expect(page.locator("#result-panel")).toBeVisible();
  await expect(page.locator("#result-value")).toHaveText("Ordinal / 1");
  await expect(page.locator("#result-passage")).toHaveText("first passage · upright");
  await expect(page.locator("#fold-count")).toHaveText("fold 1 / 1");
  await page.screenshot({ path: testInfo.outputPath("mobile-revealed.png"), fullPage: true });
});

test("keeps the fold control and performance together on a short laptop", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("./");
  await page.getByLabel("phrase / name / allegation").fill("cootie oracle");

  const button = page.getByRole("button", { name: "fold my fate" });
  const buttonBox = await button.boundingBox();
  expect(buttonBox).not.toBeNull();
  expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(768);

  await button.click();
  await page.waitForTimeout(900);

  const catcherBox = await page.locator("#catcher-shell").boundingBox();
  expect(catcherBox).not.toBeNull();
  expect(catcherBox!.y).toBeGreaterThanOrEqual(0);
  expect(catcherBox!.y + catcherBox!.height).toBeLessThanOrEqual(768);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("laptop-folding.png") });
});

test("refuses zero without fabricating an address", async ({ page }) => {
  await page.goto("./");
  await page.getByLabel("phrase / name / allegation").fill("0");
  await page.getByRole("button", { name: "fold my fate" }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "zero has no hinge. add another mapped character and try again.",
  );
  await expect(page.locator("#result-panel")).toBeHidden();
});

test("prints and downloads the authored field sheet", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1100, height: 1200 });
  await page.goto("./");

  const printable = page.locator("#print-sheet");
  await expect(printable).toContainText("AQ");
  await expect(printable).toContainText("Ordinal");
  await expect(printable).toContainText("QWER");
  await expect(printable).toContainText("nQWER");
  await expect(printable.locator(".fortune")).toHaveCount(8);
  await expect(printable.locator(".fortune").nth(7)).toContainText("mansion");
  await expect(printable.locator(".fortune").nth(7)).toContainText("minivan");

  const downloadPromise = page.waitForEvent("download");
  await page.getByLabel("phrase / name / allegation").fill("a");
  await page.getByRole("button", { name: "fold my fate" }).click();
  await expect(page.locator("#result-panel")).toBeVisible();
  await page.getByRole("button", { name: "download svg" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("cootie-oracle-field-01.svg");

  await page.emulateMedia({ media: "print" });
  await printable.screenshot({ path: testInfo.outputPath("print-sheet.png") });
});
