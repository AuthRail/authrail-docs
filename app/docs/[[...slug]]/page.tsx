import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { source } from '@/lib/source';
import { AUTHRAIL } from '@/lib/constants';
export default async function DocumentationPage({ params }: PageProps<'/docs/[[...slug]]'>) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  const Content = page.data.body;
  return <DocsPage toc={page.data.toc}><DocsTitle>{page.data.title}</DocsTitle><DocsDescription>{page.data.description}</DocsDescription><DocsBody><Content components={getMDXComponents()} /></DocsBody></DocsPage>;
}
export function generateStaticParams() { return source.generateParams(); }
export async function generateMetadata({ params }: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  return { title: page.data.title, description: page.data.description, alternates: { canonical: page.url }, openGraph: { title: page.data.title, description: page.data.description, url: page.url, type: 'article', images: [AUTHRAIL.socialImage] }, twitter: { card: 'summary_large_image', title: page.data.title, description: page.data.description, images: [AUTHRAIL.socialImage] } };
}
