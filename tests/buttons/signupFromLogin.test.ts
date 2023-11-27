import { test, expect } from '@playwright/test';

test('test signup button from login', async ({ page }) => {
  // Navigate to the landing page
  await page.goto('http://localhost:3000/login');

  // Click on the login button
  await page.getByText('Signup').click();

  // Check if the URL has changed
  await expect(page).toHaveURL(/.*\/signup/); 
});