import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap { const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'); return ['', '/care-options', '/care-costs', '/assessment', '/about'].map(path => ({ url: `${baseUrl}${path}`, lastModified: new Date() })); }
