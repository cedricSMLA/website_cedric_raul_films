import { test, expect } from '@playwright/test';

const pages = [
  { url: '/', titre: /Cédric Raúl Films/ },
  { url: '/services', titre: /Services/ },
  { url: '/tarifs-forfaits', titre: /Tarifs/ },
  { url: '/loren', titre: /LOREN/ },
  { url: '/a-propos', titre: /À propos/ },
  { url: '/nos-partenaires', titre: /partenaires/ },
  { url: '/contact', titre: /Contact/ }
];

test.describe('Smoke Tests', () => {
  for (const { url, titre } of pages) {
    test(`${url} se charge avec un titre et un h1`, async ({ page }) => {
      await page.goto(url);
      await expect(page).toHaveTitle(titre);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('footer')).toContainText('contact@cedricraulfilms.fr');
    });
  }

  test("L'accueil présente les films et les deux appels à l'action", async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Films de mariage');
    await expect(page.locator('[data-film-src]').first()).toBeVisible();
    await expect(page.locator('main a[href="/tarifs-forfaits"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/contact#contact"]').first()).toBeVisible();
  });

  test('Le menu principal mène à chaque page', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav[aria-label="Navigation principale"]');
    await nav.locator('a[href="/tarifs-forfaits"]').click();
    await expect(page).toHaveURL(/\/tarifs-forfaits/);
    await nav.locator('a[href="/contact"]').click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('Le menu mobile s\'ouvre et se ferme', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const bouton = page.locator('#menu-btn');
    await expect(bouton).toHaveAttribute('aria-expanded', 'false');
    await bouton.click();
    await expect(bouton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#menu-panel a[href="/loren"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(bouton).toHaveAttribute('aria-expanded', 'false');
  });

  test('Les tarifs affichent les quatre forfaits et leurs prix', async ({ page }) => {
    await page.goto('/tarifs-forfaits');
    for (const id of ['pure', 'ame', 'infinie', 'creation']) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    await expect(page.locator('#pure')).toContainText('1 700€');
    await expect(page.locator('main')).not.toContainText('15%');
  });

  test('La page partenaires ne promet ni réduction ni facture unique', async ({ page }) => {
    await page.goto('/nos-partenaires');
    const contenu = page.locator('main');
    await expect(contenu).not.toContainText('15%');
    await expect(contenu).not.toContainText('une seule facture');
    await expect(contenu).toContainText('son propre devis');
  });

  test('Le formulaire de contact est complet', async ({ page }) => {
    await page.goto('/contact?forfait=ame');
    await expect(page.locator('form#contact-form')).toBeVisible();
    await expect(page.locator('input[name="nom"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="date"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('select[name="forfait"]')).toHaveValue('ame');
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Les balises SEO sont présentes', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /mariage/i);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      /Cédric Raúl Films/
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /.+/);
  });
});
