import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap { const baseUrl = 'https://www.nexthavenwa.com'; return ['', '/care-options', '/care-costs', '/assessment', '/about'].map(path => ({ url: `${baseUrl}${path}`, lastModified: new Date() })); }
