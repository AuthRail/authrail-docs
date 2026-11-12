<p align="center">
  <img src="app/icon.png" alt="AuthRail" width="88" />
</p>

# AuthRail

AuthRail helps organisations govern how they use AI. Understand what your AI
systems are doing, control which actions they can take, and bring sensitive
decisions to a human for approval. Connect that oversight to your organisation's
policies and compliance requirements.

**[Read the documentation](https://docs.authrail.io)** ·
**[Getting started](https://docs.authrail.io/docs/getting-started)** ·
**[Watch the demonstration](https://docs.authrail.io/docs/application-example)**

Sign in at **[app.authrail.io](https://app.authrail.io)**. Sidecar setup connects
to **[api.authrail.io](https://api.authrail.io)**; the
[API reference](https://api.authrail.io/docs) describes its endpoints. Connect an
assistant using **[https://mcp.authrail.io/mcp](https://mcp.authrail.io/mcp)** and
the [MCP setup guide](https://docs.authrail.io/docs/mcp).

## Applying your rules to an agent's tools

An assistant helping a finance team may be allowed to read invoices but need
approval before creating an estimate. AuthRail lets the organisation express
those differences through **Rails** and apply them when the application uses
the corresponding functions. The application continues to perform its own
business operations and keep the credentials they need.

A developer connects those functions through an SDK and a customer-side
**sidecar**, which evaluates the published rules. **Observe** shows what the
rules would decide while the application continues; **Enforce** makes permission
a condition of running the connected function. The SDK can also check returned
information before the assistant receives it, for example to remove a credential
field from application settings.

The resulting Action brings together the request, decisions, approvals and
application reports. It lets a reviewer understand why work was stopped or what
the application reported after permission was granted. When the outcome depends
on an external provider, that provider's own record remains a separate source
for establishing whether the effect occurred.

[Building your own application](https://docs.authrail.io/docs/build-your-app)
explains how this fits into an agent loop. The
[quickstart](https://docs.authrail.io/docs/getting-started) then provides a complete
invoice-reader example for Node.js, Go and Python.

## Working with AuthRail through an assistant

[AuthRail MCP](https://docs.authrail.io/docs/mcp) connects an assistant to your
AuthRail workspace using the organisation access you grant. It can inspect
supported records and help prepare configuration for review. Publication,
deployment changes and approval decisions still require an authorised person's
confirmation.

This management connection is separate from integrating the application's
business tools. Those functions still need their SDK and sidecar checks, and
the agent should not have another route to their private credentials. The
connection guide explains registration, sign-in, consent and the supported
workflows using `https://mcp.authrail.io/mcp`.

## Connecting oversight to governance

AuthRail also supports the work of documenting a practice and demonstrating
that it meets the organisation's duties. Policies describe expectations,
Controls explain how teams fulfil them, and Tests and Evidence establish
whether the practices worked over a review period. Frameworks connect that
proof to applicable obligations through reviewed mappings.

Runtime records can contribute when a Control's Test or Evidence requirement
defines how they should be assessed. Readiness follows that proof and its
freshness rather than being created by a log, an allowed request or a signature.
Continue with [Policies and Controls](https://docs.authrail.io/docs/policies-controls)
and [Frameworks](https://docs.authrail.io/docs/frameworks) to explore this workflow.

## Repositories and installation guides

| Repository | Purpose |
| --- | --- |
| [Sidecar](https://github.com/AuthRail/authrail-sidecar) | Local rule evaluation, guided setup and Docker/native distribution. |
| [Node SDK](https://github.com/AuthRail/authrail-sdk-node) | Integration for JavaScript and TypeScript functions. |
| [Go SDK](https://github.com/AuthRail/authrail-sdk-go) | Integration for Go applications using the same decision protocol. |
| [Python SDK](https://github.com/AuthRail/authrail-sdk-python) | Integration for async Python functions. |
| [MCP](https://github.com/AuthRail/authrail-mcp) | Delegated management tools and customer-side connector source. |
| [Documentation](https://github.com/AuthRail/authrail-docs) | This website and its guides. |

Use the published versions listed in the
[compatibility reference](https://docs.authrail.io/docs/compatibility) when
following an installation guide. Repository source includes newer capabilities
that are not all present in those packages. Guided Docker setup uses a prebuilt
artifact, while the optional
[OpenShell example](https://docs.authrail.io/docs/openshell) documents a separate
source integration for customer-operated containment.

The application in the demonstration is a private, local reference example
rather than a hosted service or a general provider connector catalogue.
