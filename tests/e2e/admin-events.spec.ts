import { test, expect } from "@playwright/test";

test.describe("Admin event management", () => {
  test("unauthenticated access to /admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("admin login page renders", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /admin login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("invalid credentials shows error message", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 5000 });
  });

  // The following tests require a live Supabase connection and seeded admin user.
  // They are marked to skip in CI without credentials.
  test.skip("admin can create and publish event", async ({ page }) => {
    // Requires: ADMIN_EMAIL and ADMIN_PASSWORD environment variables
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL ?? "");
    await page.getByLabel(/password/i).fill(process.env.ADMIN_PASSWORD ?? "");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL("/admin", { timeout: 5000 });
    await page.getByRole("link", { name: /events/i }).click();
    await page.getByRole("link", { name: /new event/i }).click();
    await page.getByLabel(/title/i).fill("E2E Test Event");
    // ... fill remaining fields and submit
    await page.getByRole("button", { name: /publish/i }).click();
    await expect(page.getByText("E2E Test Event")).toBeVisible();
  });
});
