# AuthRail documentation design brief

The existing implementation is a rejected draft. Preserve useful source and
screenshots, but do not use its landing, introduction or navigation as the
approved design. The founder requested a fresh agent and a dedicated docs
conversation before Python work.

## Reference and visual direction

Inspect the actual Authlier landing and documentation at
https://authlier.vercel.app/ and the local source at
/Users/macbook/Codes/Projects/consumel/authlier/website. Study both the landing
and getting-started pages before proposing the AuthRail design. Follow their
clear hierarchy, direct product explanation, grouped sidebar, useful icons,
readable code blocks and straightforward setup. Use AuthRail's own real logo,
mark, favicon and blue identity. Do not invent another text-only logo or generic
favicon. Verify responsive layouts, accessibility, light/dark themes, keyboard
navigation, search and on-page contents in the browser.

## Explain the product before installation

Begin with the AI governance problem in plain language: organisations need to
understand AI activity, set boundaries, review decisions and retain useful proof.
Explain what AuthRail is and how it helps. Introduce Frameworks, Policies and
Controls before Runtime. Explain how they relate without a large GRC glossary.
Then teach Runtime visibility and protection at the customer's actual tool and
result boundaries, with concrete examples and expected outcomes.

Do not lead with the rejected refund/approval demo card, slogans such as
"Set the boundaries. Keep the proof.", an audience chooser, internal architecture
jargon or a public "Current delivery status" section. The first page must make
the product understandable to someone who has never used AuthRail.

## Teaching and evidence

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

Use one constants module for public URLs and links. Replace lib/site.ts's
AUTHRAIL_DOCS_URL environment-variable/localhost fallback; do not introduce
public endpoint env configuration. The docs origin is https://docs.authrail.io;
the API staging origin verified in source is https://api-staging.authrail.io.
Verify the exact tenant staging origin before linking it. Secrets belong in
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

First discuss the product introduction, page sections and navigation with the
founder in the new chat. Update this brief and canonical root MD files with the
agreed decisions. Then implement and visually inspect the site slice by slice.
Do not return to Python before this docs pass. Do not deploy or publish the
rejected draft merely because its source is committed on main.
