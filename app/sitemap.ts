import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { siteURL } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: siteURL.href }, ...source.getPages().map(page => ({ url: new URL(page.url, siteURL).href }))]; }
