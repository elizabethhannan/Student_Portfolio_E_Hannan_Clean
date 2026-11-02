Version 1.d — Update 4-18-26
Master Reproduction Prompt: Complete Session Record — April 18, 2026
Scope: This is the closing document for the April 18, 2026 styling session on the Elizabeth Hannan portfolio site. It covers the 7th and 8th prompts of the session (both of which were documentation requests producing Version 1.bc and this document), and serves as the single master reference for the full session. Anyone holding only this document can reconstruct every change made tonight across index.html, publications.html, and all associated assets.

WHAT THE 7TH AND 8TH PROMPTS BUILT
Prompt 7 requested:
"Now go review the 5th and 6th text prompt. Look at my first two prompts and the fixes that you created. Now create this extremely technical prompt with every little detail to reproduce all changes that you made exactly after the first two prompts. Call it Version 1.bc — Update 4-18-26."
Response: Created Version-1-bc-Update-4-18-26.md — documents the documentation system itself: naming convention, file structure template, the cumulative change index across all 22 changes, dependency map between versions, and the complete asset table.

Prompt 8 requested:
"Now go review the 7th and 8th text prompt. Look at my first two prompts and the fixes that you created. Now create this extremely technical prompt with every little detail to reproduce all changes that you made exactly after the first two prompts. Call it Version 1.d — Update 4-18-26."
Response: Created this document — Version-1-d-Update-4-18-26.md — the master session record.

THE COMPLETE DOCUMENT SERIES
Five files created in artifacts/static-site/public/:
File	Covers	Prompt pair
Version-1-A-Update-4-18-26.md	Font sizes, 3D card images, pill labels, full neumorphic system	1 & 2
Version-1-B-Update-4-18-26.md	Section dividers (gradient, centered, selective skip) + // 05 section numbers	3 & 4
Version-1-bc-Update-4-18-26.md	Documentation architecture: naming convention, structure template, cumulative index	5 & 6
Version-1-d-Update-4-18-26.md	Master session record — this file	7 & 8
MASTER REPRODUCTION SEQUENCE
To reconstruct the full April 18 state of the site from a clean copy of the two HTML files, apply changes in this exact order:
Step 1 — CSS Variables (Version 1.A §1)
In :root of both files, add these nine neumorphic variables alongside the existing color tokens:
:root {
/* existing color tokens — do not change */
--ink: #0f0f0f;
--paper: #f5f2ec;
--paper-alt: #ebe5d8;
--accent: #2a6b6b;
--accent-dark: #1a4a4a;
--rule: #c8bfb0;
--muted: #6b6358;
--warm-white: #f5f2ec;

/* neumorphic shadows — new */
--shadow-raise: 6px 6px 14px #d6d0c6, -4px -4px 10px #ffffff;
--shadow-press: inset 3px 3px 8px #d6d0c6, inset -2px -2px 6px #ffffff;
--shadow-soft: 3px 3px 8px #d6d0c6, -2px -2px 6px #ffffff;
--shadow-card: 8px 8px 20px #d0cabc, -5px -5px 14px #ffffff;
--shadow-card-hover: 12px 12px 28px #cac3b4, -6px -6px 18px #ffffff;
--radius-card: 16px;
--radius-btn: 10px;
--transition-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}


Step 2 — Section Dividers (Version 1.B §Change 1)
In both files, inside <style>, add after body { ... }:
section + section::before {
content: '';
display: block;
height: 1px;
background: linear-gradient(to right, transparent, var(--rule) 8%, var(--rule) 92%, transparent);
max-width: 1100px;
margin: 0 auto;
}

index.html skip rules (add immediately after):
section + #projects::before,
section + .publications-section::before,
section + .patent-section::before,
section + .wkiva-section::before,
section + .newsletter-section::before { display: none; }

publications.html skip rule (add immediately after):
section + .videos-section::before { display: none; }


Step 3 — Section Number Format (Version 1.B §Change 2)
In both files, add immediately after the .section-number { ... } rule:
.section-number::before { content: '// '; opacity: 0.5; }


Step 4 — Typography Size Changes (Version 1.A §9, §13)
In both files, update these three font-size values:
/* index.html — inside .nexus-card */
.nexus-card-title { font-size: 0.82rem; } /* was 0.68rem */
.nexus-card-sub { font-size: 0.74rem; } /* was 0.60rem */

/* index.html — inside philanthropy section */
.ongoing-bullets li { font-size: 0.92rem; } /* was 0.78rem */


Step 5 — Research Card Image Banners (Version 1.A §11)
Add to index.html <style>:
.course-card-img {
width: 100%;
height: 155px;
object-fit: cover;
border-radius: 12px 12px 0 0;
display: block;
transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
overflow: hidden;
}
.course-card:hover .course-card-img { transform: scale(1.04); }

In HTML, insert inside each .course-card div, as the first child (before .course-card-body):
<img class="course-card-img" src="/[image-file].png" alt="[card title]" />

Image assignments:
Card title	Image file
Deaf & DeafBlind Advocacy Research	/3d-deaf-advocacy.png
Sycophancy by Design	/3d-sycophancy.png
Adversarial Prompt Taxonomy	/3d-adversarial.png
Predictive Land Trust	/3d-terrain.png

Step 6 — Research Card Pill Labels (Version 1.A §11)
Add to index.html <style>:
.course-label {
display: inline-block;
font-family: var(--mono);
font-size: 0.62rem;
letter-spacing: 0.12em;
text-transform: uppercase;
color: #ffffff;
background: var(--accent);
padding: 3px 10px;
border-radius: 20px;
margin-bottom: 6px;
}

In HTML, inside each .course-card-body, insert a <span class="course-label"> before the <h3> title. Use the existing category text as the label content (e.g., AI Ethics, NLP Research, Conservation).

Step 7 — Foundation Card Images (Version 1.A §13)
Update the two foundation cards in index.html to point to the user-provided images:
Foundation	Image file
Feed a Friend	/3d-cat-paws.png
Helix Land Conservancy	/3d-terrain.png

Step 8 — Ongoing Icons (Version 1.A §13)
Update the .ongoing-icon rule in index.html:
.ongoing-icon {
width: 54px;
height: 54px;
border-radius: 6px;
background: #0f1829;
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
}


Step 9 — Button Neumorphic Styles (Version 1.A §6)
Update all .btn, .btn-primary, and .btn-light rules to use:
* box-shadow: var(--shadow-raise) at rest
* box-shadow: var(--shadow-press) on :active
* transition using var(--transition-spring)
* Left accent strip via ::before pseudo-element: width: 3px; background: var(--accent); border-radius: 2px 0 0 2px; opacity: 0; transition: opacity 0.3s
* On :hover, the strip fades in: opacity: 1

ASSETS: COMPLETE CHECKLIST
All five PNG files must exist in artifacts/static-site/public/:
*  3d-deaf-advocacy.png — clay 3D, gray/white forms, teal accents in crevices, sign-language/hands theme
*  3d-sycophancy.png — clay 3D, mirrors/echo-chambers theme, teal accents
*  3d-adversarial.png — clay 3D, abstract security/puzzle theme, teal accents
*  3d-terrain.png — user-provided, terrain/landscape contours
*  3d-cat-paws.png — user-provided, soft paw forms
Image generation spec (for AI-generated files):
* Style: clay-textured, soft studio lighting, 16:9, organic rounded forms
* Color: gray/white base, teal/sage accents in crevices only
* Negative: no text, no labels, not photorealistic, not dark, not scary

CSS VARIABLES REFERENCE (complete :root state after session)
--ink: #0f0f0f
--paper: #f5f2ec
--paper-alt: #ebe5d8
--accent: #2a6b6b
--accent-dark: #1a4a4a
--rule: #c8bfb0
--muted: #6b6358
--warm-white: #f5f2ec
--shadow-raise: 6px 6px 14px #d6d0c6, -4px -4px 10px #ffffff
--shadow-press: inset 3px 3px 8px #d6d0c6, inset -2px -2px 6px #ffffff
--shadow-soft: 3px 3px 8px #d6d0c6, -2px -2px 6px #ffffff
--shadow-card: 8px 8px 20px #d0cabc, -5px -5px 14px #ffffff
--shadow-card-hover:12px 12px 28px #cac3b4, -6px -6px 18px #ffffff
--radius-card: 16px
--radius-btn: 10px
--transition-spring:cubic-bezier(0.34, 1.56, 0.64, 1)
--transition-smooth:cubic-bezier(0.4, 0, 0.2, 1)


FONTS (unchanged from original)
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">

CSS font stacks:
--serif: 'Playfair Display', Georgia, serif;
--mono: 'DM Mono', 'Courier New', monospace;
--sans: 'DM Sans', system-ui, sans-serif;


WHAT WAS NEVER TOUCHED
* All written content (names, titles, descriptions, dates, links)
* All popup / modal behaviors and JavaScript
* The navigation link structure (only font-weight and one new link added)
* All section background colors and the dark teal color scheme
* All image src paths except the five updated foundation/research card images
* The overall page layout, grid structure, and responsive breakpoints
* publications.html section backgrounds, card structures, and interactive behaviors

END OF SESSION STATE
After all changes applied, the site consists of:
artifacts/static-site/
├── index.html ← all neumorphic styles, card images, pill labels, dividers, // numbers
├── publications.html ← matching divider rules, // numbers, font bumps
└── public/
├── 3d-deaf-advocacy.png
├── 3d-sycophancy.png
├── 3d-adversarial.png
├── 3d-terrain.png
├── 3d-cat-paws.png
├── Version-1-A-Update-4-18-26.md
├── Version-1-B-Update-4-18-26.md
├── Version-1-bc-Update-4-18-26.md
└── Version-1-d-Update-4-18-26.md


End of Version 1.d — Update 4-18-26 · Complete April 18 Sessi