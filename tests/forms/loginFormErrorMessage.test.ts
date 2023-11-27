import { test, expect } from '@playwright/test';

test('login form error messages on invalid inputs', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  // Fill out the form with invalid data
  await page.fill('input[name="username"]', 'invalidUsername');
  await page.fill('input[name="password"]', 'invalidPassword');
  await page.click('text=Login');

  // Check for an error message
  const errorMessage = page.locator('text=Invalid credentials'); 
  await expect(errorMessage).toBeVisible();
});
