import { getPageMarkdown } from '@/components/page-markdown';
import { source } from '@/lib/source';
import { AUTHRAIL } from '@/lib/constants';

export async function GET(_request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) return new Response('Documentation page not found.\n', {
    status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  });
  return new Response(await getPageMarkdown(page), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Link': `<${new URL(page.url, AUTHRAIL.docsOrigin).href}>; rel="canonical"`,
    },
  });
}
