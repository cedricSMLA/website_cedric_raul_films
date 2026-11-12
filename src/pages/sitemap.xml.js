export async function GET({ site }) {
  const staticPages = [
    '',
    '/services',
    '/tarifs-forfaits',
    '/loren',
    '/a-propos',
    '/nos-partenaires',
    '/contact',
    '/confidentialite'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `
  <url>
    <loc>${new URL(page, site).href}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=21600'
    }
  });
}