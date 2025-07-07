import { expect, test } from '@playwright/test';

test('homepage has title and basic elements', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Todo/);

  // Basic app structure test
  await expect(page.locator('h1')).toBeVisible();
});

test('can navigate between pages', async ({ page }) => {
  await page.goto('/');

  // This is a placeholder test - will be expanded when actual routes are implemented
  await expect(page.locator('body')).toBeVisible();
});
