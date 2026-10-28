import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { Brand } from '@/components/brand';
import { AUTHRAIL } from '@/lib/constants';
import { source } from '@/lib/source';
export default function DocumentationLayout({ children }: { children: ReactNode }) {
  return <DocsLayout tree={source.getPageTree()} nav={{ title: <Brand />, url: '/' }} githubUrl={AUTHRAIL.repositories.docs}>{children}</DocsLayout>;
}
