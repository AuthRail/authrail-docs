# AuthRail documentation design

## Purpose and audience

The public site helps business owners understand agent governance and helps
builders connect real tools and applications. Lead with the customer's task,
useful access, rules, human decisions and understandable outcomes. Compliance
remains clearly accessible as a secondary path.

Explain the experience in direct language. Use business names in instructions;
keep internal IDs, infrastructure names and version mechanics in technical
references only where the reader must act on them. A backend resource model does
not determine the navigation, page hierarchy or setup form.

## Brand and typography

Use the real AuthRail mark and favicon through `components/brand.tsx` and the
existing image assets. Brand text is compact: 20px on desktop and 19px on narrow
screens. Authored UI uses the existing Phosphor icons where they aid recognition.

IBM Plex Sans is the reading font for articles, navigation and paragraphs.
Oxanium semibold is reserved for the landing heading, capped at 64px on desktop.
Use the Fumadocs reading hierarchy and code treatment inside documentation.
Headings retain the existing tight letter spacing; paragraphs need comfortable
line length and spacing rather than dashboard density.

## Colour and theme

`app/global.css` extends Fumadocs neutral styles with AuthRail colours. Preserve
these existing tokens rather than inventing a separate palette per page.

| Token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| authrail-blue | #1761df | #1761df | Approved landing hero |
| authrail-ink | #071018 | #071018 | Landing text and commands |
| fd-primary / fd-ring | #145bd7 | #8db9ff | Article links and focus |
| fd-accent | #edf3ff | #152641 | Highlighted interactive surfaces |
| fd-accent-foreground | #174aab | #bad4ff | Accent text |

The docs provider defaults to dark mode and retains the visitor's theme choice.
The approved landing has its own fixed blue and dark composition. Preserve clear
focus, readable code and contrast in both article themes.

## Landing and layout

Keep the approved minimal landing: real brand, compact GitHub/Get started
navigation, one heading and paragraph, then the dark documentation entry area.
Preserve the heading, “AI governance for your organisation.” and the exact existing
paragraph in `app/page.tsx`. Do not add feature grids, product-story sections,
install banners, audience choosers or decorative screenshots to that composition.

Landing navigation and introduction cap at 1180px with 32px side gutters; below
680px the gutters become 18px. Navigation actions provide at least 44px height.
The hero heading scales down for narrow screens. Article layout uses Fumadocs
sidebar, search and on-page contents with the shared brand and theme controls.
Keep long code, tables and media within the article's responsive boundary.

Screenshots and videos use the existing 8px border radius and thin themed border.
Captions explain what matters; they do not repeat the surrounding instruction.
Use progressively disclosed technical details when they help a reader complete
the task without obscuring the ordinary setup path.

## Customer journeys and navigation

Keep introduction, setup, connected accounts, Rails, approvals and recovery ahead
of deeper references. Expand the following journeys as the matching capabilities
become usable, with their actual permission and coverage boundaries:

- **Hosted assistant:** connect AuthRail, sign in, choose an organisation, consent
  to access, discover authorised tools and handle human review or saved work.
- **Custom MCP:** connect a customer-owned server, review tools and account access,
  apply Rails and handle changed schemas, reconnects and interrupted work.
- **A2A:** connect permitted agents, submit a scoped task, follow updates/results,
  request cancellation and recover saved work without assuming effects reversed.
- **Own application:** install a supported Node, Python or Go SDK, run the
  customer-side sidecar and wrap the real function with trusted identity, account
  and credential binding. Optional OpenShell guidance teaches a real protected
  application; the Node reference demonstration is an optional advanced example.

Explain Policy, Data and Guard Rails through their business purpose and simple
setup. Contextual AI is AuthRail-operated per Rail; disclose selected material and
its recipient without asking customers for our private model-provider setup.
Show how a human reviews and publishes exact changes. Collection account access
does not automatically grant tool execution, Runtime reads or writes.

Keep the existing guides and integration coverage available. Preserve the 34
provider/product integrations and document added providers when their real flows
are ready. The API reference remains a separate linked technical reference.
Compliance pages retain their exact proof and permission semantics without
becoming a prerequisite for publishing a Policy Rail.

## Released behavior and intended behavior

Public setup follows verified released artifacts and available services. Source
implementation, local validation and a named public URL do not prove deployment.
Mark planned capabilities clearly instead of presenting future hooks or provider
tools as working integrations. Match examples to the selected released SDK and
sidecar versions; never substitute current source behavior silently.

Keep public origins, repository links and the approved video URL in the existing
constants module. Never publish credentials or private continuation material.
Use practical supported-client examples; no guaranteed setup time or universal
protection, isolation, undo or raw-content-locality claims without evidence.

## Copying, media and accessibility

Preserve Copy page, Use with AI and View Markdown. Copy resolved Markdown with
useful links and all language examples; opening an assistant is a separate user
action. Announce success or failure and keep a selectable Markdown fallback when
clipboard access fails. These actions do not change the guide's human voice.

Preserve the approved walkthrough video with native controls, no autoplay,
captions, an accessible name, responsive sizing and a direct recording fallback.
Keep the existing disclosure that automatic captions may contain errors.

Use semantic headings, descriptive links, visible keyboard focus and accessible
names for icon-only actions. Search, navigation, disclosures and page actions
must work by keyboard. Show clear unavailable/error states and useful next steps.
Preserve reading position and usable navigation on narrow screens and with zoom.

## Implementation references

Visual sources are `app/global.css`, `app/layout.tsx`, `app/page.tsx`,
`app/docs/layout.tsx`, `components/brand.tsx`, `page-actions.tsx`,
`walkthrough-video.tsx` and `lib/constants.ts`. These establish the current design;
the journey guidance above describes intended coverage, not a claim of release.
