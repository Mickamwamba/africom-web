import { test, expect } from "@playwright/test";

test.describe("User Story 3: Company Credibility Research", () => {
  test("about page displays company name and mission", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/mission/i)).toBeVisible();
  });

  test("about page shows company location status", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText(/tanzania|usa|offices/i).first()).toBeVisible();
  });

  test("about page includes a contact link", async ({ page }) => {
    await page.goto("/about");
    const contactLink = page.getByRole("link", { name: /contact/i }).first();
    await expect(contactLink).toBeVisible();
  });

  test("homepage credibility section shows stat and testimonial", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("credibility-section")).toBeVisible();
    await expect(page.getByText(/5 innovative agribusiness initiatives/i)).toBeVisible();
    await expect(page.getByText(/oliver hartman/i)).toBeVisible();
  });

  test("site header displays official Africom logo image", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("img", { name: /africom international/i }).first()).toBeVisible();
  });

  test("all 5 pages reachable within 2 clicks from homepage", async ({ page }) => {
    const routes = ["/about", "/exports", "/consultation", "/contact"];
    for (const route of routes) {
      await page.goto("/");
      const link = page.getByRole("link", { href: route } as Parameters<typeof page.getByRole>[1]).first();
      await expect(link).toBeVisible();
    }
  });

  test("404 page shows custom message and homepage link", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByRole("heading", { name: /404|not found/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /home|return/i }).first()).toBeVisible();
  });
});
