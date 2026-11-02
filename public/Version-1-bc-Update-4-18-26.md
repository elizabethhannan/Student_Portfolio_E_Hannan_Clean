Version 1.c — Update 4-18-26
Master Reproduction Prompt: Documentation Architecture & Version System
Scope: This document captures what was built in response to the 5th and 6th text prompts of the April 18, 2026 session. Those prompts requested the creation of two technical reproduction documents — Version 1.A and Version 1.B. This document defines the exact structure, naming convention, and formatting rules used to create both, so the documentation system itself can be fully reproduced.

CONTEXT: WHAT PROMPTS 5 AND 6 BUILT
Prompt 5 requested:
"Look back in our text chats tonight for this project. Look at my first two prompts and the fixes that you created. Now create this extremely technical prompt with every little detail to reproduce all changes that you made exactly after the first two prompts. We will call this Prompt: 'Version 1. A Update 4 18 26.'"
Response: Created Version-1-A-Update-4-18-26.md — a 20-section comprehensive technical document covering all code and asset changes from the session's first two prompts.

Prompt 6 requested:
"Now go review the 3rd and 4th text prompt. Look at my first two prompts and the fixes that you created. Now create this extremely technical prompt with every little detail to reproduce all changes that you made exactly after the first two prompts. Call it Version 1.b — Update 4-18-26."
Response: Created Version-1-B-Update-4-18-26.md — a focused 2-change document covering the section divider system and the // 05 section number format.

FILE LOCATIONS
Both documents were saved inside public/ so they are served by Vite and accessible via the web server:
artifacts/static-site/public/
├── Version-1-A-Update-4-18-26.md
├── Version-1-B-Update-4-18-26.md
└── Version-1-bc-Update-4-18-26.md ← this file


NAMING CONVENTION
The version naming system used across all documents:
Version [Major].[Minor][Sub] — Update [MM-DD-YY]

Part	Meaning	Example
Major	Session or sprint number	1 = April 18 session
Minor	Document batch within session (letter)	A = first batch, B = second, bc = third
Sub	Optional sub-letter for refinements	bc distinguishes from b
Update date	Date the changes were made	4-18-26 = April 18, 2026
File naming rule: Replace spaces and dots with hyphens, preserve case:
* "Version 1.A — Update 4-18-26" → Version-1-A-Update-4-18-26.md
* "Version 1.b — Update 4-18-26" → Version-1-B-Update-4-18-26.md
* "Version 1.bc — Update 4-18-26" → Version-1-bc-Update-4-18-26.md

DOCUMENT STRUCTURE TEMPLATE
Every version document follows this exact structure:
# Version [X] — Update [Date]
## Master Reproduction Prompt: [Short description of changes]

> **Scope:** [1–2 sentence summary of what files are affected and what is preserved]

---

## CONTEXT: WHAT THESE PROMPTS CHANGED

[Brief description of which prompt number covered which feature]

---

## CHANGE [N] — [FEATURE NAME IN CAPS]

### Design Intent
[Plain-English explanation of what the feature should look/feel like from the user's perspective]

### Implementation — [Scope: Both files / index.html only / publications.html only]

[Code blocks with exact CSS]

**How it works:**
[Bullet explanation of the mechanism — pseudo-elements, inheritance, cascade order, etc.]

### [Sub-sections as needed: Cleanup, Selective Overrides, HTML Changes, etc.]

---

## COMPLETE CSS BLOCK TO INSERT

[A ready-to-paste combined block of all CSS for the changes]

---

## VARIABLE DEPENDENCY

[Table of CSS variables this change depends on]

---

## WHAT DOES NOT CHANGE

[Bullet list of everything intentionally left untouched]

---

*End of Version [X] — Update [Date]*


WHAT VERSION 1.A COVERS (20 sections)
	
	
	
	
	
Section	Topic
0	Google Fonts embed
1	CSS custom properties — all 9 neumorphic variables added to :root
2	Global base — body, section divider rule
3	Layout globals — .section-inner, .section-header, .section-number with // prefix
4	Navigation — bold weight, Career link addition
5	Social bar & icon buttons
6	All button variants — .btn, .btn-primary, .btn-light
7	Newsletter & Share buttons
8	Hero section
9	Polymath / About section — nexus cards at 0.82rem / 0.74rem
10	Research statement section
11	Research Project cards — image banners, pill labels, left-strip animation
12	Publications teaser section (dark teal)
13	Philanthropy section — foundation cards, ongoing icons 54×54 dark navy
14	Patents & IP section (dark teal)
15	ESG / Wkiva marquee section
WHAT VERSION 1.B COVERS (2 changes)
Change	Topic
1	Section dividers — section + section::before, gradient fade, max-width 1100px, selective skip rules
2	Section number format — .section-number::before { content: '// '; opacity: 0.5; }
CUMULATIVE CHANGE INDEX — ALL THREE VERSIONS
The complete set of changes across 1.A, 1.B, and 1.bc, in the order they were implemented:
#	Change	Covered in
1	Nexus card titles: 0.68rem → 0.82rem	1.A §9
2	Nexus card subtitles: 0.6rem → 0.74rem	1.A §9
3	Ongoing bullets: 0.78rem → 0.92rem	1.A §13
4	Neumorphic CSS variable system (9 new :root vars)	1.A §1
5	All buttons: left accent strip + spring cubic-bezier + neumorphic shadows	1.A §6
6	Nav: all links font-weight 700; "Career" link added	1.A §4
7	Social icons: neumorphic shadow, pressed hover	1.A §5
8	Publications section: dark teal background	1.A §12
9	Patents section: dark teal background, white text	1.A §14
10	Research project cards: .course-card-img 3D banner strip	1.A §11
11	Research project cards: .course-label → teal pill badge	1.A §11
12	3D images assigned to each research card (4 images)	1.A §11
13	Foundation card images updated (cat-paws, terrain)	1.A §13
14	Ongoing icon: 54×54px, border-radius 6px, #0f1829 bg	1.A §13
15	Foundation link: left accent strip + spring hover	1.A §13
16	publications.html: popup button font bump to 0.72rem	1.A §18
17	publications.html: repo link font bump to 0.73rem	1.A §18
18	Section dividers: section + section::before gradient hairline	1.B §Change1
19	Section divider: max-width 1100px, centered, fades at edges	1.B §Change1
20	Section divider: skip rules for dark/continuous sections	1.B §Change1
21	Section number format: // 05 via ::before pseudo-element	1.B §Change2
22	Documentation system created (this file series)	1.bc
HOW TO USE THIS DOCUMENT SERIES
To fully reproduce the Elizabeth Hannan portfolio styling from a blank-slate version of the two HTML files, apply the versions in this order:
1. Apply Version 1.A — establishes the entire neumorphic design system, all components, and all asset references.
2. Apply Version 1.B — adds the section divider system and section number // prefix (these depend on the :root variables established in 1.A).
3. Version 1.bc — no code changes; documents the system and serves as the master index.

DEPENDENCIES BETWEEN VERSIONS
Version 1.B depends on Version 1.A having been applied first:
* The divider uses var(--rule) which is declared in Version 1.A's :root
* The section number ::before inherits color: var(--muted) which is declared in Version 1.A's :root
Version 1.bc has no code dependencies — it is documentation only.

ASSETS REQUIRED (complete list across all versions)
All files go in artifacts/static-site/public/. They are served at the root path /filename.png.
File	Type	Card / Section
3d-terrain.png	User-provided	Predictive Land Trust card + Helix Land Conservatory foundation card
3d-cat-paws.png	User-provided	Feed a Friend foundation card
3d-deaf-advocacy.png	AI-generated	Deaf & DeafBlind Advocacy Research card
3d-sycophancy.png	AI-generated	Sycophancy by Design card
3d-adversarial.png	AI-generated	Adversarial Prompt Taxonomy card
End of Version 1.bc — Update 4-18-26
