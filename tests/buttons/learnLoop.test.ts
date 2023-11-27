import { test, expect } from '@playwright/test';

test('test learn loop button from login', async ({ page }) => {
  // Navigate to the landing page
  await page.goto('http://localhost:3000/login');


  await expect(page.getByRole('img',{name:'Learnloop'})).toBeVisible();
  await page.getByRole('img',{name:'Learnloop'}).click();
  // Now check if the URL is correct
  await expect(page).toHaveURL('http://localhost:3000');
});
