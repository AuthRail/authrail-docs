import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { Brand } from '@/components/brand';
import { AUTHRAIL } from '@/lib/constants';
import { source } from '@/lib/source';
export default function DocumentationLayout({ children }: { children: ReactNode }) {
  return <DocsLayout tree={source.getPageTree()} nav={{ title: <Brand />, url: '/' }} links={[
    { text: 'Open AuthRail', url: AUTHRAIL.clientOrigin, external: true },
    { text: 'API reference', url: `${AUTHRAIL.apiOrigin}/docs`, external: true },
    { text: 'MCP setup', url: '/docs/mcp' },
  ]} githubUrl={AUTHRAIL.repositories.docs}>{children}</DocsLayout>;
}
