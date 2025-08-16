export async function GET({ site }) {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${site}sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin paths (if any in future)
Disallow: /admin/
Disallow: /_assets/
Disallow: /api/`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=21600'
    }
  });
}