import { test, expect } from "@playwright/test";

test.describe("User Story 2: Development Partner Discovery", () => {
  test("homepage shows consultation CTA linking to /consultation", async ({
    page,
  }) => {
    await page.goto("/");
    const consultLink = page.getByRole("link", { name: /consultation/i }).first();
    await expect(consultLink).toBeVisible();
    await consultLink.click();
    await expect(page).toHaveURL(/\/consultation/);
  });

  test("consultation page lists services with target audience and topics", async ({
    page,
  }) => {
    await page.goto("/consultation");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const cards = page.getByTestId("service-card");
    await expect(cards.first()).toBeVisible();
    await expect(cards.first().getByTestId("service-audience")).toBeVisible();
    await expect(cards.first().getByTestId("service-topics")).toBeVisible();
  });

  test("consultation services are visually distinct from export products", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("service-export-block")).toBeVisible();
    await expect(page.getByTestId("service-consultation-block")).toBeVisible();
  });

  test("consultation page has a CTA linking to contact form", async ({ page }) => {
    await page.goto("/consultation");
    const contactLink = page.getByRole("link", { name: /contact|get in touch|enquire/i });
    await expect(contactLink).toBeVisible();
    await contactLink.click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("contact form accepts consultation inquiry type", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel(/name/i).fill("Amina Osei");
    await page.getByLabel(/email/i).fill("amina@agridevelopment.org");
    await page.getByLabel(/service of interest/i).selectOption("consultation");
    await page.getByLabel(/message/i).fill("We are designing a value chain programme in Tanzania and need a local partner.");
    await page.getByRole("button", { name: /send|submit/i }).click();
    await expect(page.getByTestId("form-success")).toBeVisible({ timeout: 10000 });
  });
});
