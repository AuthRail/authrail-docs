import { defineConfig } from 'fumadocs-mdx/config';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';

export default defineConfig({
  mdxOptions: {
    // Retain fenced-code language names when pages are copied as Markdown.
    rehypeCodeOptions: { ...rehypeCodeDefaultOptions, addLanguageClass: true },
  },
});
