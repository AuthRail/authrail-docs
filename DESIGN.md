# AuthRail documentation design brief

This brief records the founder's agreed direction for the public documentation.
The current lead owns the docs pass, with independent reviews for clarity and
setup accuracy. Python follows documentation, then coordinated SDK release
planning. Passing a build does not substitute for founder review.

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

Start with Introduction. Teach Governance through dedicated Frameworks,
Policies and Controls, Tests and Evidence, and Readiness pages. Then explain
Runtime, Rails, modes, contextual facts, approvals and records. Only after those
foundations introduce Connect your first application, identity and installation,
the Node/Go adapters and NVIDIA OpenShell. Operation/recovery and detailed references follow.
The introduction links into this sequence, rather than sending a beginner
straight to installation. Use concrete examples and cross-links for defined
terms; avoid a dense glossary squeezed into one introduction.

The landing paragraph explains the purpose: AuthRail helps organisations govern
AI use, understand activity, control actions, review sensitive decisions and
connect that oversight to organisational policies and compliance requirements.
Keep feature names for their proper explanations inside the docs.

## Docs pages: explain the product before installation

Begin with the AI governance problem in plain language: organisations need to
understand AI activity, set boundaries, review decisions and retain useful proof.
Explain what AuthRail is and how it helps. Introduce Frameworks, Policies and
Controls before Runtime. Explain how they relate without a large GRC glossary.
Then teach Runtime visibility and protection at the customer's actual tool and
result boundaries, with concrete examples and expected outcomes.

Do not lead with the rejected refund/approval demo card, slogans such as
"Set the boundaries. Keep the proof.", an audience chooser, internal architecture
jargon or a public "Current delivery status" section. The introductory docs pages must make the product understandable to someone
who has never used AuthRail.

Public integration guides use the supported Node and Go adapters. Do not publish
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

Explain contextual AI explicitly: current extractors send selected source text
to the configured model; typed facts/provenance are sent to AuthRail. Source
text staying behind the executor does not mean it is withheld from that model.
Do not promise generic pre-provider redaction/minimisation that is not
implemented. Keep configured models, contextual fact-reading models and actual
agent execution identity distinct. Permission, reported execution, independently
verified effects and Framework-qualified proof have different meanings.

## URLs, metadata and repositories

Use one constants module for public URLs and links. The first slice replaced lib/site.ts's
AUTHRAIL_DOCS_URL environment-variable/localhost fallback; do not introduce
public endpoint env configuration. The docs origin is https://docs.authrail.io;
the API staging origin verified in source is https://api-staging.authrail.io.
The tenant staging origin verified in Caddy source is https://app-staging.authrail.io. Secrets belong in
private storage/Secrets Manager, never constants or public examples.

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
Do not return to Python before this docs pass. Do not deploy or publish the
rejected draft merely because its source is committed on main.
