import { test, expect } from "@playwright/test";

test.describe("Event registration modal", () => {
  test("event detail page loads", async ({ page }) => {
    await page.goto("/events");
    // If at least one event card exists, navigate to it
    const card = page.getByTestId("event-card").first();
    const count = await card.count();
    if (count === 0) {
      test.skip();
      return;
    }
    await card.click();
    await expect(page).toHaveURL(/\/events\/.+/);
  });

  test("Register Now button opens the registration modal", async ({ page }) => {
    await page.goto("/events");
    const card = page.getByTestId("event-card").first();
    if (await card.count() === 0) { test.skip(); return; }
    await card.click();
    const registerBtn = page.getByRole("button", { name: /register now/i });
    await registerBtn.click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("registration form has required fields", async ({ page }) => {
    await page.goto("/events");
    const card = page.getByTestId("event-card").first();
    if (await card.count() === 0) { test.skip(); return; }
    await card.click();
    await page.getByRole("button", { name: /register now/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByLabel(/full name/i)).toBeVisible();
    await expect(dialog.getByLabel(/email/i)).toBeVisible();
    await expect(dialog.getByLabel(/phone/i)).toBeVisible();
    await expect(dialog.getByLabel(/privacy policy/i)).toBeVisible();
  });

  test("form does not submit without consent checkbox", async ({ page }) => {
    await page.goto("/events");
    const card = page.getByTestId("event-card").first();
    if (await card.count() === 0) { test.skip(); return; }
    await card.click();
    await page.getByRole("button", { name: /register now/i }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel(/full name/i).fill("Test User");
    await dialog.getByLabel(/email/i).fill("test@example.com");
    await dialog.getByLabel(/phone/i).fill("+1234567890");
    // Do NOT check consent
    await dialog.getByRole("button", { name: /submit|register/i }).click();
    // Dialog should still be open
    await expect(dialog).toBeVisible();
  });

  test("successful registration shows confirmation message", async ({ page }) => {
    await page.goto("/events");
    const card = page.getByTestId("event-card").first();
    if (await card.count() === 0) { test.skip(); return; }
    await card.click();
    await page.getByRole("button", { name: /register now/i }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel(/full name/i).fill("Test User");
    await dialog.getByLabel(/email/i).fill("test@example.com");
    await dialog.getByLabel(/phone/i).fill("+1234567890");
    await dialog.getByLabel(/privacy policy/i).check();
    await dialog.getByRole("button", { name: /submit|register/i }).click();
    await expect(page.getByText(/registered successfully|thank you/i)).toBeVisible({ timeout: 5000 });
  });
});
