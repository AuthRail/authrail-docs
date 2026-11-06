# AuthRail documentation design brief

This brief records the founder's agreed direction for the public documentation.
The lead owns the docs pass, with independent reviews for clarity and
setup accuracy. Node, Go and Python installation guides use the verified
published SDK versions. Passing a build does not substitute for founder review.

## Reference and visual direction

Inspect the actual Authlier landing and documentation at
https://authlier.vercel.app/ and the local source at
/Users/macbook/Codes/Projects/consumel/authlier/website. Study both the landing
and getting-started pages before proposing the AuthRail design. Follow their
clear hierarchy, direct product explanation, grouped sidebar, useful icons,
readable code blocks and straightforward setup. Use AuthRail's own real logo,
mark, favicon and blue identity. Do not invent another text-only logo or generic
favicon. Use Phosphor icons throughout authored docs UI; do not use Lucide. Import the current `SomethingIcon` exports, not deprecated
aliases; use the same names in page icon metadata.
Verify responsive layouts, accessibility, light/dark themes, keyboard
navigation, search and on-page contents in the browser.
Default to dark mode for a first visit. Keep the theme switch and respect a
visitor's saved choice.

## Typography

Use Oxanium semibold for the landing heading, with a smaller 64px desktop cap.
Use IBM Plex Sans for paragraphs, navigation, brand text and documentation.
Keep the brand text compact (20px desktop, 19px mobile). The landing retains its
approved composition; typography must remain readable at narrow widths.

## Landing page: one direct introduction

Follow Authlier's actual simple landing: compact logo/navigation, one factual
heading, one short product paragraph and a small documentation entry area.
No refund card, feature grids, audience chooser, screenshots, product-story
sections or slogans on the landing. Use AuthRail blue and a dark lower entry
area with generous spacing. The landing states what AuthRail does; the docs
pages explain why and how. Do not add a fake install command for the whole
product, a fabricated GitHub star count or a link to the private reference app.

## Navigation and learning order

The November 2 founder direction supersedes the earlier Framework-first order.
Lead with what AuthRail does for agent authority and behaviour, then a useful
first result. The primary path is:

1. A short introduction to AuthRail, coverage and the meaning of its records.
2. A quickstart using verified released setup artifacts and a safe example.
3. MCP/agent setup: sign-in, permissions, preparing configuration and exact
   human confirmation, alongside how the real business tool is protected.
4. Runtime, Rails, Observe/Enforce, usable Guards, Data sources and contextual AI.
5. Approvals/resume, records, diagnostics, recovery and useful operating insights.
6. Connected governance: Policies, Controls, Frameworks, Tests/Evidence, readiness
   and remediation, with their exact proof semantics intact.
7. Detailed SDK, deployment, compatibility, security and configuration references.

Readers should not have to learn Framework scope or create a compliance programme
before trying one Runtime action. Keep governance fully explained in its own
path; do not make an audience chooser the substitute for a clear main journey.
The compact landing composition, approved typography/brand and visual rules stay
in place. Its copy should explain control of agent actions and understanding
outcomes plainly, without implying complete coverage of every company activity.

## Quickstart and first useful result

The acceptance target is a measured fifteen-minute first result on a documented
clean environment. Record prerequisites and time the actual steps before making
that public promise. Use a verified prebuilt sidecar image and supported SDK;
the normal Docker guide must not require Go or building source. Present only a
real released installer/command. The approved entry is `authrail-sidecar setup`
in the existing Go executable. Browser connection and key registration alone do
not establish the full installer; validate private credential provisioning,
startup and recovery before presenting it as the normal public setup path.

The first task should connect one safe operation and show its decision and
record. A complete walkthrough then shows allow, deny, saved human review/resume
and result checking. Make the developer's remaining job explicit: wrap the real
function and bind trusted caller/resource/credential context. Guided setup can
handle mechanical key/credential/configuration work, but cannot automatically
secure arbitrary uninstrumented tools or network bypasses.

Explain hosted MCP management and customer tool enforcement separately and show
how they join. Connecting AuthRail MCP does not wrap another assistant's Stripe,
browser or shell tool. One-time sign-in/consent and exact human confirmation
remain necessary even when users work through their assistant.

Every introduction should explain one concept and familiar example before the
instructions, while letting the quickstart reach a result before deep internals.
No refund/approval feature card, slogan, internal architecture tour or public
progress/status commentary belongs on the landing or beginner entry.

Public integration guides use the supported Node, Go and Python adapters. Do not publish
a DIY HTTP implementation guide or present a custom adapter as an equivalent
customer path. The underlying wire contract stays with the source implementation.
Do not claim a latency figure without a representative measurement. Explain the
parts of response time and how a customer can measure its own deployment.

## Introduce every guide before its instructions

Every page begins with what the concept does, why the reader would use it and
one familiar example. Walk through one task in reader order and show the
expected result. Define terms where they first become necessary. Do not make
beginners decode contracts, cryptographic digests, namespaces, version bindings
or recovery internals before understanding the task.

Keep required setup complete. Put advanced explanations and uncommon failure
cases in clearly named, keyboard-accessible details sections. Essential safety
instructions remain visible where the action occurs. This is a structural
writing rule, not permission to replace instructions with links or remove
necessary identity, retention and execution boundaries.

## Teaching and evidence

The GitHub README introduces AuthRail and links the public sidecar, SDK and docs
repositories. It is a product entry point, not a contributor setup page.
Introduce contextual AI explicitly as an AuthRail feature. Define health,
telemetry and any other technical term before using it; state who supplies each
setup value, where to obtain it and where any data is sent. Remove internal
progress/acceptance commentary from public guides. Major concept pages need
relevant genuine screenshots, including Policies, Controls and contextual AI.

Each guide defines the concept, why it exists, who uses it, and how to complete
a real task. Explain prerequisites, commands, expected results and recovery in
order. Write inviting SDK, sidecar and reference-app READMEs for new users.
Use real screenshots of the tenant dashboard, Actions and decisions, approvals,
Runtime logs, reference application and Framework/Control/Test/Evidence journey.
Existing screenshots are in public/screenshots; assess framing, accuracy and
sensitive information before reuse. Show examples and visual evidence rather
than long pages of abstract text. Do not invent successful product states.

Explain Contextual AI as an AuthRail-operated service enabled on the Rail that
needs interpretation. The user describes the business rule; AuthRail prepares
the assessment. The published version fixes its question, permitted fields and
typed answer. The SDK selects those fields after required local processing and
sends them through the sidecar to AuthRail. AuthRail returns a signed bounded
finding, and the local deterministic sidecar applies the rule. Interpretation
is not permission.

Do not name the private provider/model, ask customers for model credentials,
expose prompts/settings hashes or publish a provider catalogue for this flow.
AuthRail receives selected contextual material; do not repeat the old claim that
raw text stays out of AuthRail. Explain transient processing, retained bounded
findings, uncertainty and the disclosure review. Required local filtering must
happen before sending text; a later check cannot undo disclosure. A Rail with
Contextual AI off causes no contextual request. Missing identities, failed
lookups and expired approvals keep their ordinary failure handling.

## Teach usable contextual AI, Guards and Data Rails

Use the detailed product contract in AUTHRAIL_PRODUCT_STORY.md rather than
maintaining another catalogue of promised provider support in this file.
The docs must let a beginner answer:

- Contextual AI: where do I enable it on a Rail, describe the intended rule,
  review the prepared assessment and permitted material, test uncertain/missing
  answers and inspect the decision? Show code/diff and document examples as
  well as business text. MCP prepares the same draft under actual permissions;
  exact publication remains a person's decision. No separate model setup.
- Guard Rails: which ready-made protection can I select, what boundary does it
  check, what does it block/change and how can I test its limits? A literal demo
  marker or custom callback is not a general credential or injection detector.
- Data Rails: which supported source/value can I select, which account/resource
  supplies it, how fresh is it and what happens if the lookup fails? The SDK
  should handle the supported reader once the customer binds trusted identity
  and credentials. A collection Connection does not automatically grant Runtime
  source or business-write access.

Use one joined example where local disclosure filtering runs before the model,
a trusted lookup supplies a value and a deterministic rule evaluates the facts.
Never claim that a model can prevent disclosure of text already sent to it.
Unknown/unsupported providers or detectors, low confidence, malformed values,
timeouts, stale facts and missing capabilities do not become successful checks.
Explain actual data recipients and retained metadata, without promising the
entire control-plane ledger is customer-hosted or that every source stays local.

## URLs, metadata and repositories

Use one constants module for public URLs and links. The first slice replaced lib/site.ts's
AUTHRAIL_DOCS_URL environment-variable/localhost fallback; do not introduce
public endpoint env configuration. The docs origin is https://docs.authrail.io;
other public origins must be verified against the approved deployed targets.
The November 2 direction moves deployment workflows to main and removes staging
as the deployment branch. Do not retain staging API/workspace links as unlabeled
public setup defaults. Do not invent replacement production hosts or treat a
branch change as proof they exist. Secrets belong in private storage/Secrets
Manager, never constants or public examples. Hosted MCP/server runtime deployment
configuration still uses environment settings/koanf as requested; this is separate
from the documentation website's constants module.

Add proper title/description metadata, canonical URLs, Open Graph/social tags,
real favicon and robots/sitemap behavior. Link verified public SDK/sidecar and
other appropriate repositories. Check repository visibility; the reference
application was private at the engineering handoff. Do not call a private repo
public or change visibility without authorization.

The reference app is clone-and-run only, using its local SQLite storage. There
will be no hosted reference-app version. Its README must explain full local
setup, dependencies, AuthRail connection, safe scenarios and troubleshooting.

## Workflow

The founder approved the simple Authlier-style landing and asked work to begin.
Implement and inspect that first slice before expanding the documentation. Update this brief and canonical root MD files with the
agreed decisions. Then implement and visually inspect the site slice by slice.
The Python adapter is released alongside Node and Go. Shared implementation
tasks use persistent Node.js, Go and Python tabs with working SDK examples;
UI-only governance tasks keep their screenshots and steps. Do not deploy or publish the
rejected draft merely because its source is committed on main.

## First-class MCP documentation

The founder prioritised the public Go AuthRail MCP service before the chat-first
reference-app revamp. Give supported MCP workflows dedicated introduction and
connection guides alongside the SDK integrations, with practical examples of
sign-in/consent, organisation permissions, available tools, governance work,
Runtime management, human confirmations, saved work, failures and troubleshooting.

Explain that the hosted MCP calls AuthRail server APIs on behalf of the user.
The server retains its domain checks and history. Customer tools still need
the protected SDK/sidecar boundary; connecting MCP alone does not install that
protection. Public instructions follow implemented tools and a verified hosted
endpoint; repository preparation alone does not justify live setup instructions.

The retained MCP work packages and the new setup/usable-Rails priority sequence
are in the workspace's plan.md. Write
usable documentation alongside each implemented slice, then complete the full
MCP onboarding and workflow review in the retained documentation package. The final documentation slice
does not defer setup or permission explanations needed to use earlier slices.
Use real supported-client examples and screenshots. Teach how a person signs
in, chooses an organisation, grants/revokes access, reviews an exact proposed
change and handles a failed or interrupted request. Keep secrets and private
continuations out of model-visible examples and results.
