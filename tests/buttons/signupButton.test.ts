import { test, expect } from '@playwright/test';

test('test signup button from root', async ({ page }) => {
  // Navigate to the landing page
  await page.goto('http://localhost:3000/');

  // Click on the login button
  await page.click('text=Get Started'); 

  // Check if the URL has changed
  await expect(page).toHaveURL(/.*\/signup/); 
});