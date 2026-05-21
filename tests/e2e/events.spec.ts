import { test, expect } from "@playwright/test";

test.describe("Events listing page", () => {
  test("page loads at /events", async ({ page }) => {
    await page.goto("/events");
    await expect(page).toHaveURL("/events");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("shows Upcoming tab by default", async ({ page }) => {
    await page.goto("/events");
    const upcomingTab = page.getByRole("tab", { name: /upcoming/i });
    await expect(upcomingTab).toBeVisible();
    await expect(upcomingTab).toHaveAttribute("data-state", "active");
  });

  test("Past tab is present and switchable", async ({ page }) => {
    await page.goto("/events");
    const pastTab = page.getByRole("tab", { name: /past/i });
    await expect(pastTab).toBeVisible();
    await pastTab.click();
    await expect(pastTab).toHaveAttribute("data-state", "active");
  });

  test("shows empty state when no upcoming events", async ({ page }) => {
    await page.goto("/events");
    // If there are no events, the empty state message is displayed
    const grid = page.getByTestId("events-grid");
    const cards = grid.locator("[data-testid='event-card']");
    const count = await cards.count();
    if (count === 0) {
      await expect(page.getByText(/no upcoming events/i)).toBeVisible();
    }
  });

  test("type filter renders without error", async ({ page }) => {
    await page.goto("/events");
    const typeFilter = page.getByRole("combobox", { name: /type/i });
    await expect(typeFilter).toBeVisible();
  });

  test("category filter renders without error", async ({ page }) => {
    await page.goto("/events");
    const categoryFilter = page.getByRole("combobox", { name: /category/i });
    await expect(categoryFilter).toBeVisible();
  });
});
