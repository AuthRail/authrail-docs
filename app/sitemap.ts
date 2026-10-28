import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { AUTHRAIL } from '@/lib/constants';
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: AUTHRAIL.docsOrigin }, ...source.getPages().map(page => ({ url: new URL(page.url, AUTHRAIL.docsOrigin).href }))]; }
