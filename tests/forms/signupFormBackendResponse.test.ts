import { test, expect } from '@playwright/test';

test('signup form submission with valid inputs', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');

  // Intercept the network request
  const [response] = await Promise.all([
    page.waitForResponse(response => response.url().includes('/signup') && response.status() === 200),
    // Fill out and submit the form
    page.fill('input[name="name"]', 'Test Name'),
    page.fill('input[name="email"]', 'test@example.com'),
    page.fill('input[name="password"]', 'password123'),
    page.fill('input[name="confirmPassword"]', 'password123'),
    page.click('text=Submit')
  ]);

  // Check if the response is as expected
  const responseBody = await response.json();
  // Replace 
  expect(responseBody).toHaveProperty('success', true);
});
