import { ProductShot } from '@/components/product-shot';
import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
export function getMDXComponents(components?: MDXComponents) {
  return { ...defaultComponents, ProductShot, ...components } satisfies MDXComponents;
}
export const useMDXComponents = getMDXComponents;
declare global { type MDXProvidedComponents = ReturnType<typeof getMDXComponents>; }
