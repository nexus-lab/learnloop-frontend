import { test, expect } from '@playwright/test';

test('test login button from root', async ({ page }) => {
  // Navigate to the landing page
  await page.goto('http://localhost:3000/');

  // Click on the login button
  await page.click('text=Login'); 

  // Check if the URL has changed
  await expect(page).toHaveURL(/.*\/login/); 
});