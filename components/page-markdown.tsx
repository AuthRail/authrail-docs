import { asMarkdown, renderToMarkdown } from 'fumadocs-core/server';
import type { MDXComponents, MDXContent } from 'mdx/types';
import type { ComponentProps, ReactNode } from 'react';
import { AUTHRAIL } from '@/lib/constants';

type DocumentationPage = {
  url: string;
  data: { title: string; description?: string; body: MDXContent };
};

function MarkdownChildren({ children }: { children?: ReactNode }) {
  asMarkdown();
  return children;
}

function MarkdownTab({ value, children }: { value?: string; children?: ReactNode }) {
  asMarkdown();
  return <section>{value && <h3>{value}</h3>}{children}</section>;
}

function MarkdownCommand({ lang, code }: { lang?: string; code: string }) {
  asMarkdown();
  return <pre data-lang={lang}><code>{code}</code></pre>;
}

function MarkdownSummary({ children }: { children?: ReactNode }) {
  asMarkdown();
  return <h3>{children}</h3>;
}

function MarkdownVideo() {
  asMarkdown();
  return <p><a href={AUTHRAIL.walkthroughVideo}>Watch the AuthRail walkthrough recording</a>. <a href={new URL('/captions/authrail-walkthrough.en.vtt', AUTHRAIL.docsOrigin).href}>English automatic captions</a>.</p>;
}

/** Render the document itself so imported constants and code examples resolve as on the page. */
export async function getPageMarkdown(page: DocumentationPage): Promise<string> {
  const canonical = new URL(page.url, AUTHRAIL.docsOrigin);
  const absolute = (href: string) => new URL(href, canonical).href;

  function MarkdownLink({ href, children }: ComponentProps<'a'>) {
    asMarkdown();
    return <a href={href ? absolute(href) : undefined}>{children}</a>;
  }

  function MarkdownScreenshot({ src, alt, caption }: { src: string; alt: string; caption: string }) {
    asMarkdown();
    return <figure><img src={absolute(src)} alt={alt} /><figcaption>{caption}</figcaption></figure>;
  }

  const components = {
    a: MarkdownLink,
    pre: 'pre',
    code: 'code',
    h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
    table: 'table',
    summary: MarkdownSummary,
    Tabs: MarkdownChildren,
    Tab: MarkdownTab,
    CommandBlock: MarkdownCommand,
    ProductShot: MarkdownScreenshot,
    WalkthroughVideo: MarkdownVideo,
  } satisfies MDXComponents;

  const body = await renderToMarkdown(page.data.body({ components }));
  return `# ${page.data.title}\n\n${page.data.description ? `${page.data.description}\n\n` : ''}Source: ${canonical.href}\n\n${body}\n`;
}
