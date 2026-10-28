import { createMDX } from 'fumadocs-mdx/next';
const withMDX = createMDX();
export default withMDX({
  reactStrictMode: true,
  agentRules: false,
  async redirects() {
    return [{ source: '/docs/http', destination: '/docs/getting-started', permanent: true }];
  },
});
