import { test, expect } from "@playwright/test";

test.describe("Admin registrations management", () => {
  test("unauthenticated access to /admin/registrations redirects to login", async ({ page }) => {
    await page.goto("/admin/registrations");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  // Integration tests below require live Supabase + admin credentials
  test.skip("admin can view registrations list", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL ?? "");
    await page.getByLabel(/password/i).fill(process.env.ADMIN_PASSWORD ?? "");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.goto("/admin/registrations");
    await expect(page.getByRole("table")).toBeVisible();
  });

  test.skip("Export CSV button triggers download", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL ?? "");
    await page.getByLabel(/password/i).fill(process.env.ADMIN_PASSWORD ?? "");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.goto("/admin/registrations");
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /export csv/i }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });
});
