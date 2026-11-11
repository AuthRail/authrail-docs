export const AUTHRAIL = {
  name: 'AuthRail',
  description: 'Govern how your organisation uses AI: understand its activity, control actions, review sensitive decisions and connect oversight to compliance requirements.',
  docsOrigin: 'https://docs.authrail.io',
  mcpEndpoint: 'https://mcp.authrail.io/mcp',
  assistants: {
    chatgpt: 'https://chatgpt.com/',
    claude: 'https://claude.ai/new',
  },
  socialImage: {
    url: '/images/authrail-social-preview.png',
    width: 2940,
    height: 1506,
    alt: 'AuthRail — AI governance for your organisation',
  },
  walkthroughVideo: 'https://res.cloudinary.com/thirtythree/video/upload/v1794339733/export-1794333156372_1_btkllv.mp4',
  references: {
    openappa: 'https://www.openappa.com/how-it-works',
    openshell: 'https://docs.nvidia.com/openshell/v0.1.6/',
    openshellRepository: 'https://github.com/NVIDIA/OpenShell',
  },
  releases: {
    sdkVersion: '0.1.1',
    sidecarVersion: '0.2.0',
    sidecarDownloads: 'https://github.com/AuthRail/authrail-sidecar/releases/download/v0.2.0',
  },
  packages: {
    node: 'https://www.npmjs.com/package/@authrail/sdk-node',
    python: 'https://pypi.org/project/authrail/',
    go: 'https://pkg.go.dev/github.com/AuthRail/authrail-sdk-go',
  },
  repositories: {
    docs: 'https://github.com/AuthRail/authrail-docs',
    mcp: 'https://github.com/AuthRail/authrail-mcp',
    sidecar: 'https://github.com/AuthRail/authrail-sidecar',
    node: 'https://github.com/AuthRail/authrail-sdk-node',
    go: 'https://github.com/AuthRail/authrail-sdk-go',
    python: 'https://github.com/AuthRail/authrail-sdk-python',
  },
} as const;
