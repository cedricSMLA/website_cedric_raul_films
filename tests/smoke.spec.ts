import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Cédric Raúl Films/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Votre mariage');
    
    // Check navigation
    await expect(page.locator('nav a[href="/portfolio"]')).toBeVisible();
    await expect(page.locator('nav a[href="/loren"]')).toBeVisible();
    await expect(page.locator('nav a[href="/contact"]')).toBeVisible();
    
    // Check CTA buttons
    await expect(page.locator('a[href="/contact"]').first()).toBeVisible();
  });

  test('Contact page loads correctly', async ({ page }) => {
    await page.goto('/contact');
    
    // Check title
    await expect(page).toHaveTitle(/Contact/);
    
    // Check form elements
    await expect(page.locator('form#contact-form')).toBeVisible();
    await expect(page.locator('input[name="nom"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="date"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    
    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Portfolio page loads correctly', async ({ page }) => {
    await page.goto('/portfolio');
    
    // Check title
    await expect(page).toHaveTitle(/Portfolio/);
    
    // Check filter buttons
    await expect(page.locator('button[data-filter="all"]')).toBeVisible();
    
    // Check portfolio grid
    await expect(page.locator('#portfolio-grid')).toBeVisible();
  });

  test('LOREN page loads correctly', async ({ page }) => {
    await page.goto('/loren');
    
    // Check title
    await expect(page).toHaveTitle(/LOREN/);
    
    // Check price badge
    await expect(page.locator('text=2900€ TTC')).toBeVisible();
    
    // Check CTA button
    await expect(page.locator('a[href="/contact"]')).toBeVisible();
  });

  test('Navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to portfolio
    await page.click('nav a[href="/portfolio"]');
    await expect(page).toHaveURL(/\/portfolio/);
    
    // Test navigation to contact
    await page.click('nav a[href="/contact"]');
    await expect(page).toHaveURL(/\/contact/);
    
    // Test navigation back to home
    await page.click('nav a[href="/"]');
    await expect(page).toHaveURL(/\/$/);
  });

  test('Mobile menu works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile menu button is visible
    await expect(page.locator('#mobile-menu-btn')).toBeVisible();
    
    // Check mobile menu is initially hidden
    await expect(page.locator('#mobile-menu')).toHaveClass(/hidden/);
    
    // Click mobile menu button
    await page.click('#mobile-menu-btn');
    
    // Check mobile menu is now visible
    await expect(page.locator('#mobile-menu')).not.toHaveClass(/hidden/);
    
    // Check mobile menu links
    await expect(page.locator('#mobile-menu a[href="/portfolio"]')).toBeVisible();
  });

  test('SEO meta tags are present', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /vidéaste/i);
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /Cédric Raúl Films/);
    
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /.+/);
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
  });
});