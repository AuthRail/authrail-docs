import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { ProductShot } from '@/components/product-shot';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
export function getMDXComponents(components?: MDXComponents) {
  return { ...defaultComponents, ProductShot, Tabs, Tab, CommandBlock: ServerCodeBlock, ...components } satisfies MDXComponents;
}
export const useMDXComponents = getMDXComponents;
declare global { type MDXProvidedComponents = ReturnType<typeof getMDXComponents>; }
