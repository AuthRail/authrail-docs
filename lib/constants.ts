export const AUTHRAIL = {
  name: 'AuthRail',
  description: 'Govern how your organisation uses AI: understand its activity, control actions, review sensitive decisions and connect oversight to compliance requirements.',
  docsOrigin: 'https://docs.authrail.io',
  apiOrigin: 'https://api-staging.authrail.io',
  workspaceOrigin: 'https://app-staging.authrail.io',
  references: {
    openappa: 'https://www.openappa.com/how-it-works',
    openshell: 'https://docs.nvidia.com/openshell/latest/',
    openshellRepository: 'https://github.com/NVIDIA/OpenShell',
  },
  repositories: {
    docs: 'https://github.com/AuthRail/authrail-docs',
    sidecar: 'https://github.com/AuthRail/authrail-sidecar',
    node: 'https://github.com/AuthRail/authrail-sdk-node',
    go: 'https://github.com/AuthRail/authrail-sdk-go',
  },
} as const;
