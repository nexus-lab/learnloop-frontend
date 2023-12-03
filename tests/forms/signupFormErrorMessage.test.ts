import { test, expect } from '@playwright/test';

test('signup form error messages on invalid inputs', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
  
    // Fill out the form with invalid data
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('text=Submit');
  
    // Check for an error message related to invalid email
    const emailErrorMessage = page.locator('text=Invalid email address'); // Adjust the text to match your app's error message
    await expect(emailErrorMessage).toBeVisible();
  });
  