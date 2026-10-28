import type { MetadataRoute } from 'next';
import { AUTHRAIL } from '@/lib/constants';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/' }, sitemap: new URL('/sitemap.xml', AUTHRAIL.docsOrigin).href }; }
