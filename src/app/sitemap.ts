import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { return ['', '/care-options', '/care-costs', '/assessment', '/about'].map(path => ({ url: `https://gabesllc.com${path}`, lastModified: new Date() })); }
