export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/auth/google/callback',
    },
    sitemap: 'https://agent3.pk/sitemap.xml',
  };
}
