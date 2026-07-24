import { test, expect } from "@playwright/test";

test.describe("Admin inquiries management", () => {
  test("unauthenticated access to /admin/inquiries redirects to login", async ({ page }) => {
    await page.goto("/admin/inquiries");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test.skip("contact form submission appears in admin inquiries", async ({ page }) => {
    // 1. Submit contact form
    await page.goto("/contact");
    await page.getByLabel(/name/i).fill("Test Sender");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/message/i).fill("This is a test inquiry message.");
    await page.getByRole("button", { name: /send/i }).click();
    await expect(page.getByText(/thank you|received/i)).toBeVisible({ timeout: 5000 });

    // 2. Login and check inquiries
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL ?? "");
    await page.getByLabel(/password/i).fill(process.env.ADMIN_PASSWORD ?? "");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.goto("/admin/inquiries");
    await expect(page.getByText("Test Sender")).toBeVisible({ timeout: 5000 });
  });

  test.skip("read/unread toggle updates inquiry state", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL ?? "");
    await page.getByLabel(/password/i).fill(process.env.ADMIN_PASSWORD ?? "");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.goto("/admin/inquiries");
    const toggleBtn = page.getByRole("button", { name: /mark as read/i }).first();
    await toggleBtn.click();
    await expect(page.getByRole("button", { name: /mark as unread/i }).first()).toBeVisible({ timeout: 3000 });
  });
});
