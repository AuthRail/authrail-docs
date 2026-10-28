import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
export default function DocumentationLayout({ children }: { children: ReactNode }) {
  return <DocsLayout tree={source.getPageTree()} nav={{ title: <span className="wordmark">Auth<span>Rail</span></span>, url: '/' }}>{children}</DocsLayout>;
}
