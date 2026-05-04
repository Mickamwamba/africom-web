import { test, expect } from "@playwright/test";

test.describe("User Story 1: Export Client Discovery", () => {
  test("homepage shows export CTA linking to /exports", async ({ page }) => {
    await page.goto("/");
    const exportLink = page.getByRole("link", { name: /export/i }).first();
    await expect(exportLink).toBeVisible();
    await exportLink.click();
    await expect(page).toHaveURL(/\/exports/);
  });

  test("exports page lists product categories with required details", async ({
    page,
  }) => {
    await page.goto("/exports");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // At least one product card must show name, origin, and characteristics
    const cards = page.getByTestId("product-card");
    await expect(cards.first()).toBeVisible();
    await expect(cards.first().getByTestId("product-origin")).toBeVisible();
    await expect(cards.first().getByTestId("product-characteristics")).toBeVisible();
  });

  test("exports page has a CTA linking to contact page", async ({ page }) => {
    await page.goto("/exports");
    const contactLink = page.getByRole("link", { name: /contact|get in touch|enquire/i });
    await expect(contactLink).toBeVisible();
    await contactLink.click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("contact form submits successfully with export inquiry", async ({
    page,
  }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.getByLabel(/name/i).fill("Jane Smith");
    await page.getByLabel(/organisation|organization/i).fill("Global Grains Ltd");
    await page.getByLabel(/email/i).fill("jane@globalgrains.com");
    await page.getByLabel(/service of interest/i).selectOption("export");
    await page.getByLabel(/message/i).fill("Interested in sourcing cashew nuts for European distribution.");

    await page.getByRole("button", { name: /send|submit/i }).click();
    await expect(page.getByTestId("form-success")).toBeVisible({ timeout: 10000 });
  });

  test("contact form shows validation errors for empty required fields", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /send|submit/i }).click();
    await expect(page.getByTestId("error-name")).toBeVisible();
    await expect(page.getByTestId("error-email")).toBeVisible();
    await expect(page.getByTestId("error-message")).toBeVisible();
  });

  test("about section shows US registration status", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText(/registered/i)).toBeVisible();
    await expect(page.getByText(/united states|usa|us-registered/i)).toBeVisible();
  });
});
