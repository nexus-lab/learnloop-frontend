import { test, expect } from '@playwright/test';

test('login form submission with valid inputs', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  // Intercept the network request
  const [response] = await Promise.all([
    page.waitForResponse(response => response.url().includes('/login') && response.status() === 200),
    // Fill out and submit the form
    page.fill('input[name="username"]', 'validUsername'),
    page.fill('input[name="password"]', 'validPassword'),
    page.click('text=Login')
  ]);

  // Check if the response is as expected
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('success', true); 
});
