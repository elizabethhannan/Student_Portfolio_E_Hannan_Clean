Prompt 1 Version 1.A:: Version 1.A — Update 4-18-26
Master Reproduction Prompt: Elizabeth Hannan Portfolio — Full Styling Overhaul
Scope: Two static HTML files (index.html, publications.html) in a Vite-based static site. Apply every change below verbatim. All original colors, fonts, content, and modal/popup behaviors must be preserved exactly.

0. FONTS & GOOGLE FONTS
Ensure the <head> of both files links:
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">


1. CSS CUSTOM PROPERTIES — Add to :root in both files
Keep all existing variables. Add these new ones:
--paper-alt: #ebe5d8;
--neu-light: rgba(255,255,255,0.88);
--neu-dark: rgba(175,165,148,0.58);
--neu-shadow: 6px 6px 14px var(--neu-dark), -6px -6px 14px var(--neu-light);
--neu-shadow-sm: 4px 4px 9px var(--neu-dark), -4px -4px 9px var(--neu-light);
--neu-shadow-lg: 10px 10px 24px var(--neu-dark), -10px -10px 24px var(--neu-light);
--neu-inset: inset 4px 4px 9px var(--neu-dark), inset -4px -4px 9px var(--neu-light);
--neu-pressed: inset 3px 3px 7px var(--neu-dark), inset -3px -3px 7px var(--neu-light);

Existing values to preserve exactly:
--ink: #0f0f0f;
--paper: #f5f2ec;
--warm-white: #f5f2ec;
--accent: #2a6b6b;
--accent-light: #3d8b8b;
--accent-dark: #1a4a4a;
--rule: #c8bfb0;
--muted: #6b6358;
--tag-bg: #e2edec;
--serif: 'Playfair Display', Georgia, serif;
--mono: 'DM Mono', 'Courier New', monospace;
--sans: 'DM Sans', system-ui, sans-serif;


2. GLOBAL BASE — Both files
Immediately after body { ... }, insert these two rules:
/* Section dividers: centered hairline, fades at edges, skips dark sections */
section + section::before {
content: '';
display: block;
height: 1px;
background: linear-gradient(to right, transparent, var(--rule) 8%, var(--rule) 92%, transparent);
max-width: 1100px;
margin: 0 auto;
}

index.html only — also add these overrides to suppress the divider before dark/continuous sections:
section + #projects::before,
section + .publications-section::before,
section + .patent-section::before,
section + .wkiva-section::before,
section + .newsletter-section::before { display: none; }

publications.html only — suppress before the dark videos section:
section + .videos-section::before { display: none; }

section element itself:
section { position: relative; z-index: 1; }


3. LAYOUT GLOBALS — Both files
.section-inner { max-width: 1100px; margin: 0 auto; padding: 5rem 3rem; }
.section-header { display: flex; align-items: baseline; gap: 2rem; margin-bottom: 2.8rem; padding-bottom: 1rem; }

Section numbers — "// 05" format:
/* index.html */
.section-number { font-family: var(--mono); font-size: 0.82rem; letter-spacing: 0.15em; color: var(--muted); }
.section-number::before { content: '// '; opacity: 0.5; }

/* publications.html */
.section-number { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.15em; color: var(--muted); }
.section-number::before { content: '// '; opacity: 0.5; }

The ::before pseudo-element on .section-number prepends // at 50% opacity to every section counter, making them display as // 00, // 01, etc.
Section title:
.section-title { font-family: var(--serif); font-size: 1.85rem; font-weight: 400; }


4. NAVIGATION — Both files
nav {
position: fixed; top: 0; left: 0; right: 0; z-index: 100;
display: flex; align-items: center; justify-content: space-between;
padding: 1rem 3rem; background: var(--paper); backdrop-filter: blur(8px);
box-shadow: 0 4px 16px var(--neu-dark), 0 -2px 8px var(--neu-light);
}
.nav-name { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
.nav-links { display: flex; gap: 1.8rem; list-style: none; }
.nav-links a {
font-family: var(--mono); font-size: 0.63rem; letter-spacing: 0.1em;
text-transform: uppercase; color: var(--muted); text-decoration: none;
transition: color 0.2s; font-weight: 700; /* ALL nav links bold */
}
.nav-links a:hover { color: var(--accent); }

index.html nav HTML — add a "Career" item (7th item) pointing to #career:
<li><a href="#career">Career</a></li>

Also add id="career" to the employer section opening tag: <section class="employer-section" id="career">.

5. SOCIAL BAR & ICON BUTTONS — index.html
.social-bar {
position: fixed; top: 54px; left: 0; right: 0; z-index: 99;
display: flex; align-items: center; justify-content: center; gap: 0.7rem;
padding: 1.1rem 2rem 0.75rem; background: var(--paper);
box-shadow: 0 4px 12px var(--neu-dark); flex-wrap: wrap;
}
.social-icon {
width: 34px; height: 34px; border-radius: 50%; background: var(--paper);
box-shadow: var(--neu-shadow-sm); display: flex; align-items: center;
justify-content: center; font-size: 0.85rem; text-decoration: none;
color: var(--muted); transition: all 0.25s;
}
.social-icon:hover { box-shadow: var(--neu-pressed); color: var(--accent); transform: none; }
.social-icon svg { width: 15px; height: 15px; fill: currentColor; }


6. BUTTONS — Both files
All buttons use a left accent strip (not a full border), neumorphic shadows, and spring bounce cubic-bezier.
@keyframes btn-bounce { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} 70%{transform:translateY(-2px)} }

.btn {
font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.12em;
text-transform: uppercase; text-decoration: none; padding: 0.75rem 1.6rem;
border: none; border-left: 4px solid var(--accent);
color: var(--ink); background: var(--paper);
transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
cursor: pointer; display: inline-block;
border-radius: 0 8px 8px 0; /* flat on the left, rounded on the right */
box-shadow: var(--neu-shadow);
}
.btn:hover { box-shadow: var(--neu-shadow-lg); color: var(--accent); transform: translateY(-3px); }
.btn:active { box-shadow: var(--neu-pressed); transform: translateY(0); }

.btn-primary {
background: var(--accent); color: white;
border-left: 4px solid rgba(255,255,255,0.28);
box-shadow: 5px 5px 12px rgba(20,65,65,0.45), -3px -3px 10px rgba(55,120,120,0.3);
border-radius: 0 8px 8px 0;
transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.btn-primary:hover {
box-shadow: 7px 7px 18px rgba(20,65,65,0.5), -4px -4px 12px rgba(55,120,120,0.35);
color: white; transform: translateY(-3px);
}
.btn-primary:active {
box-shadow: inset 4px 4px 10px rgba(15,50,50,0.45), inset -3px -3px 8px rgba(55,120,120,0.25);
transform: translateY(0);
}

/* Used inside dark sections (publications, videos): */
.btn-light {
border: 1px solid rgba(255,255,255,0.35);
border-left: 4px solid rgba(255,255,255,0.6);
color: #faf8f4; background: transparent;
box-shadow: 4px 4px 10px rgba(10,35,35,0.4), -3px -3px 8px rgba(35,80,80,0.3);
border-radius: 0 8px 8px 0;
transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.btn-light:hover {
background: rgba(255,255,255,0.08);
box-shadow: 6px 6px 16px rgba(10,35,35,0.5), -4px -4px 12px rgba(35,80,80,0.35);
transform: translateY(-3px);
}
.btn-light:active {
box-shadow: inset 3px 3px 8px rgba(10,35,35,0.4), inset -3px -3px 7px rgba(35,80,80,0.25);
transform: translateY(0);
}


7. NEWSLETTER & SHARE BUTTONS — index.html
.newsletter-btn-wrap { position: relative; margin-left: 1rem; }
.newsletter-btn {
font-family: var(--mono); font-size: 0.63rem; letter-spacing: 0.1em;
text-transform: uppercase; background: var(--accent); color: white;
border: none; padding: 0.45rem 1.1rem; border-radius: 20px; cursor: pointer;
box-shadow: 4px 4px 10px rgba(30,80,80,0.4), -2px -2px 8px rgba(60,120,120,0.25),
inset 4px 0 0 rgba(255,255,255,0.25);
transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.newsletter-btn:hover {
box-shadow: 6px 6px 16px rgba(30,80,80,0.5), -3px -3px 10px rgba(60,120,120,0.3),
inset 4px 0 0 rgba(255,255,255,0.35);
transform: translateY(-3px);
}
.newsletter-btn:active {
box-shadow: inset 3px 3px 7px rgba(15,50,50,0.4), inset -2px -2px 6px rgba(60,120,120,0.2);
transform: translateY(0);
}

.share-btn {
font-family: var(--mono); font-size: 0.58rem; letter-spacing: 0.1em;
text-transform: uppercase; background: var(--paper); color: var(--muted);
border: none; padding: 0.42rem 0.9rem; border-radius: 20px; cursor: pointer;
transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;
box-shadow: var(--neu-shadow-sm), inset 3px 0 0 var(--accent);
}
.share-btn:hover { box-shadow: var(--neu-shadow), inset 4px 0 0 var(--accent); color: var(--accent); transform: translateY(-2px); }
.share-btn:active { box-shadow: var(--neu-pressed); transform: translateY(0); }


8. HERO SECTION — index.html
.hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; padding-top: 124px; }
.hero-left {
display: flex; flex-direction: column; justify-content: flex-end;
padding: 3rem 4rem 5rem 6rem; position: relative;
}
/* Vertical rule between hero columns */
.hero-left::after {
content: ''; position: absolute; top: 10%; right: 0;
width: 2px; height: 80%;
background: linear-gradient(to bottom, transparent, var(--rule), transparent);
border-radius: 1px;
}

Hero tags (keyword pills):
.tag {
font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.1em;
text-transform: uppercase; color: var(--accent); background: var(--paper);
padding: 0.32rem 0.75rem; border-radius: 20px; box-shadow: var(--neu-shadow-sm);
}


9. POLYMATH / "ABOUT" SECTION — index.html
Section background: var(--paper-alt) (#ebe5d8).
.polymath-section { background: var(--paper-alt); }

/* Inset blockquote-style journey quote */
.polymath-journey {
font-family: var(--serif); font-style: italic; font-size: 0.97rem;
line-height: 1.8; color: var(--ink); padding: 1rem 1.4rem;
background: var(--paper); margin: 1.3rem 0; border-radius: 10px;
box-shadow: var(--neu-inset); border-left: 3px solid var(--accent);
}

/* Mantras list */
.mantras-list li {
font-family: var(--serif); font-size: 0.85rem; color: var(--ink);
padding: 0.55rem 1rem 0.55rem 1.1rem;
border-left: 3px solid var(--accent);
background: var(--paper); border-radius: 0 8px 8px 0;
box-shadow: var(--neu-shadow-sm);
}

Nexus Cards (5-column grid of specialty pillars):
.nexus-cards { display: grid; grid-template-columns: repeat(5,1fr); gap: 0.9rem; margin-top: 1.5rem; clear: both; }
.nexus-card {
padding: 0.85rem; background: var(--paper); text-align: center;
border-radius: 12px; box-shadow: var(--neu-shadow-sm); transition: box-shadow 0.25s;
}
.nexus-card:hover { box-shadow: var(--neu-pressed); }
.nexus-card-title { font-family: var(--sans); font-size: 0.82rem; font-weight: 500; color: var(--accent); margin-bottom: 0.3rem; }
.nexus-card-sub { font-size: 0.74rem; color: var(--muted); line-height: 1.45; }


10. RESEARCH STATEMENT SECTION — index.html
.credential-item {
display: flex; flex-direction: column; padding: 0.75rem 1rem;
margin-bottom: 0.5rem; background: var(--paper);
border-radius: 10px; box-shadow: var(--neu-shadow-sm);
}
.hxo-statement {
background: var(--paper); border-left: 3px solid var(--accent);
padding: 1rem 1.3rem; font-size: 0.9rem; margin-top: 1.3rem;
line-height: 1.7; border-radius: 0 10px 10px 0; box-shadow: var(--neu-inset);
}


11. RESEARCH PROJECT CARDS (Section 02) — index.html
Cards receive: neumorphic shadow, left accent strip animation on hover, and a 3D image banner at the top.
.course-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; }

.course-card {
background: var(--paper); border-radius: 14px; padding: 1.8rem;
transition: box-shadow 0.3s, transform 0.25s;
position: relative; overflow: hidden; box-shadow: var(--neu-shadow);
}
/* Left accent strip — animates upward on hover */
.course-card::before {
content: ''; position: absolute; top: 0; left: 0;
width: 4px; height: 100%; background: var(--accent);
transform: scaleY(0); transform-origin: bottom;
transition: transform 0.3s ease; border-radius: 14px 0 0 14px;
}
.course-card:hover::before { transform: scaleY(1); }
.course-card:hover { box-shadow: var(--neu-shadow-lg); transform: translateY(-3px); }

/* 3D image banner at top of card */
.course-card-img {
width: calc(100% + 3.6rem); /* bleeds past card padding */
margin: -1.8rem -1.8rem 1.3rem; /* negative margins to reach card edges */
height: 155px; overflow: hidden;
border-radius: 14px 14px 0 0;
}
.course-card-img img {
width: 100%; height: 100%; object-fit: cover;
display: block; transition: transform 0.4s ease;
}
.course-card:hover .course-card-img img { transform: scale(1.04); }

/* Pill badge label (was plain text) */
.course-label {
font-family: var(--mono); font-size: 0.58rem; letter-spacing: 0.12em;
text-transform: uppercase; color: white; background: var(--accent-dark);
padding: 0.28rem 0.85rem; border-radius: 20px;
display: inline-block; margin-bottom: 0.85rem;
}

.course-title { font-family: var(--serif); font-size: 0.97rem; font-weight: 600; line-height: 1.4; margin-bottom: 0.6rem; }
.course-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.6; margin-bottom: 1.1rem; }
.card-link {
font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.1em;
text-transform: uppercase; color: var(--accent); text-decoration: none;
display: inline-flex; align-items: center; gap: 0.4rem; transition: gap 0.2s;
}
.card-link:hover { gap: 0.7rem; }
.card-link::after { content: '→'; }

HTML structure for each card — add a .course-card-img div as the FIRST child:
<div class="course-card reveal">
<div class="course-card-img"><img src="/3d-[slug].png" alt="[Title]"></div>
<p class="course-label">[LABEL TEXT]</p>
<h3 class="course-title">[Title]</h3>
<p class="course-desc">[Description]</p>
<a href="..." class="card-link">View ...</a>
</div>

Image assignments (files go in public/):
Card	Image file	Source
Deaf & DeafBlind Advocacy Research	/3d-deaf-advocacy.png	AI-generated: Clay 3D ASL hands rising, organic gray-white clay material, teal accent in crevices
Sycophancy by Design	/3d-sycophancy.png	AI-generated: Multiple identical smooth dome spheres in mirror pattern, concentric ripple rings, pale blue-teal accent
Predictive Land Trust Evaluation	/3d-terrain.png	User-attached: Topographic terrain render — layered contour ridges in gray-white clay, teal/sage accent pools
Adversarial Prompt Taxonomy	/3d-adversarial.png	AI-generated: Interlocking angular geometric shield plates, branching taxonomy forms, gray clay with deep teal accent
12. PUBLICATIONS TEASER SECTION (Section 03) — index.html
Dark teal background.
.publications-section { background: var(--accent-dark); color: #faf8f4; }
.publications-section .section-title { color: #faf8f4; }
.publications-section .section-number { color: rgba(255,255,255,0.35); }
.publications-section .section-header { border-color: transparent; }


13. PHILANTHROPY SECTION (Section 04) — index.html
Background: var(--paper-alt).
.philanthropy-section { background: var(--paper-alt); }
.foundation-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; margin-bottom: 2.5rem; }
.foundation-card {
background: var(--paper); overflow: hidden;
transition: transform 0.25s, box-shadow 0.25s;
border-radius: 14px; box-shadow: var(--neu-shadow);
}
.foundation-card:hover { transform: translateY(-4px); box-shadow: var(--neu-shadow-lg); }
.foundation-img { width: 100%; height: 165px; object-fit: cover; display: block; }

.foundation-badge {
font-family: var(--mono); font-size: 0.53rem; letter-spacing: 0.15em;
text-transform: uppercase; background: var(--accent); color: white;
padding: 0.22rem 0.55rem; display: inline-block;
margin: 0.9rem 1.4rem 0; border-radius: 20px;
}
.foundation-tagline { font-family: var(--mono); font-size: 0.75rem; letter-spacing: 0.07em; color: var(--accent); font-weight: 700; }

/* Foundation "Learn More" button — left accent strip + spring hover */
.foundation-link {
display: inline-block; margin-top: 0.9rem;
font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.1em;
text-transform: uppercase; color: var(--accent); text-decoration: none;
padding: 0.42rem 1rem; border-radius: 20px; background: var(--paper);
box-shadow: var(--neu-shadow-sm), inset 4px 0 0 var(--accent);
transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.foundation-link:hover { box-shadow: var(--neu-shadow), inset 5px 0 0 var(--accent); transform: translateY(-2px); }
.foundation-link:active { box-shadow: var(--neu-pressed); transform: translateY(0); }

Foundation card image assignments:
* Feed a Friend → src="/3d-cat-paws.png" (user-attached: clay cat paws curled in abstract ring, soft gray with pink paw pads)
* Helix Land Conservatory → src="/3d-terrain.png" (same topographic terrain render as Land Trust card)
Ongoing advocacy cards:
.ongoing-card { background: var(--paper); padding: 1.6rem 1.8rem; margin-bottom: 1rem; border-radius: 16px; box-shadow: var(--neu-shadow); }
/* Icon square */
.ongoing-icon {
width: 54px; height: 54px;
background: #0f1829; /* dark navy, NOT the teal accent */
border-radius: 6px; /* square with slight rounding */
display: flex; align-items: center; justify-content: center;
font-size: 1.5rem; flex-shrink: 0;
box-shadow: 4px 4px 10px rgba(5,10,20,0.5), -2px -2px 8px rgba(25,40,70,0.35);
}
/* Bullet list */
.ongoing-bullets { list-style: none; display: flex; flex-direction: column; gap: 0.28rem; margin-bottom: 0.7rem; }
.ongoing-bullets li { font-size: 0.92rem; color: var(--muted); padding-left: 1rem; position: relative; }
.ongoing-bullets li::before { content: '—'; position: absolute; left: 0; color: var(--accent); }
/* Legal victory callout */
.legal-victory {
background: var(--paper); border-left: 3px solid var(--accent);
padding: 0.75rem 1rem; margin-top: 0.7rem;
border-radius: 0 8px 8px 0; box-shadow: var(--neu-inset);
}


14. PATENTS & IP SECTION — index.html
Entire section uses dark teal background with white text.
.patent-section { background: var(--accent-dark); color: #faf8f4; }
.patent-section .section-number { color: rgba(255,255,255,0.3); }
.patent-section .section-title { color: #faf8f4; }
/* Patent cards: adapt all shadows for dark background */
/* Patent badges: keep pill style but use rgba(255,255,255,0.12) bg, white text */


15. ESG / WKIVA MARQUEE SECTION — index.html
Dark background section (dark navy or similar). Maintain existing scrolling logo marquee. Add neumorphic treatment to any card or badge elements within.

16. CODE SECTION — index.html
.code-section { background: var(--paper); }
.github-btn {
display: inline-flex; align-items: center; gap: 0.45rem;
font-family: var(--mono); font-size: 0.63rem; letter-spacing: 0.1em;
text-transform: uppercase; color: var(--muted); text-decoration: none;
background: var(--paper); padding: 0.5rem 1.1rem; margin-top: 1rem;
transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
border-radius: 0 8px 8px 0; border-left: 3px solid var(--accent);
box-shadow: var(--neu-shadow-sm);
}
.github-btn:hover { box-shadow: var(--neu-shadow); color: var(--accent); transform: translateY(-2px); }
.github-btn:active { box-shadow: var(--neu-pressed); transform: translateY(0); }

Code popup (modal overlay):
.code-popup-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 2000; align-items: center; justify-content: center; padding: 1.5rem; cursor: pointer; }
.code-popup-overlay.open { display: flex; }
.code-popup-box {
background: var(--paper); border-radius: 16px; width: 100%;
max-width: 1100px; max-height: 90vh; overflow: hidden;
display: flex; flex-direction: column; cursor: default;
box-shadow: 0 24px 80px rgba(0,0,0,0.5), var(--neu-shadow-lg);
}


17. EMPLOYER / CAREER SECTION — index.html
Add id="career" to the section: <section class="employer-section" id="career">. The nav "Career" link (<a href="#career">Career</a>) scrolls here.

18. PUBLICATIONS.HTML — ALL SECTIONS
Apply the same :root variables, global divider rule, button styles, and nav styles as index.html.
Paper cards (3-column grid):
.papers-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; }
.paper-card {
background: var(--paper); border-radius: 14px; padding: 2rem;
cursor: pointer; transition: box-shadow 0.3s, transform 0.25s;
position: relative; overflow: hidden; box-shadow: var(--neu-shadow);
}
/* Same left accent strip as course-card: */
.paper-card::before {
content: ''; position: absolute; top: 0; left: 0;
width: 4px; height: 100%; background: var(--accent);
transform: scaleY(0); transform-origin: bottom;
transition: transform 0.3s ease; border-radius: 14px 0 0 14px;
}
.paper-card:hover::before { transform: scaleY(1); }
.paper-card:hover { box-shadow: var(--neu-shadow-lg); transform: translateY(-3px); }

Repo link in code popup:
.cmod-gh {
font-family: var(--mono); font-size: 0.73rem; /* bumped from 0.57rem */
letter-spacing: 0.1em; text-transform: uppercase;
color: var(--accent); text-decoration: none; margin-bottom: 0.85rem; font-weight: 600;
}

Popup action buttons in publications.html:
.cmod-link-btn {
font-family: var(--mono); font-size: 0.72rem; /* bumped from 0.6rem */
letter-spacing: 0.1em; text-transform: uppercase;
color: var(--muted); padding: 0.45rem 1rem; border-radius: 8px;
text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;
transition: all 0.25s; background: var(--paper); cursor: pointer; border: none;
box-shadow: var(--neu-shadow-sm);
}
.cmod-link-btn:hover { box-shadow: var(--neu-pressed); color: var(--accent); }

Videos section (dark):
.videos-section { background: var(--accent-dark); color: #faf8f4; }
.videos-section .section-title { color: #faf8f4; }
.videos-section .section-number { color: rgba(255,255,255,0.35); }
.video-card {
cursor: pointer; border-radius: 12px; overflow: hidden;
transition: transform 0.25s, box-shadow 0.25s;
background: rgba(255,255,255,0.05);
box-shadow: 6px 6px 16px rgba(8,30,30,0.55), -4px -4px 12px rgba(35,80,80,0.35);
}
.video-card:hover { transform: translateY(-4px); box-shadow: 10px 10px 24px rgba(8,30,30,0.65), -5px -5px 14px rgba(35,80,80,0.4); }

PDF philanthropy cards:
.pdf-card {
display: flex; align-items: stretch; background: var(--paper);
border-radius: 14px; padding: 0; cursor: pointer;
transition: box-shadow 0.3s, transform 0.25s;
overflow: hidden; box-shadow: var(--neu-shadow); margin-bottom: 1.2rem;
}
.pdf-card:hover { box-shadow: var(--neu-shadow-lg); transform: translateY(-3px); }


19. IMAGE ASSETS REQUIRED
Place these PNG files in public/ (served at root /):
File	Description
3d-terrain.png	User-provided: topographic terrain 3D render — stacked rounded ridge contours, gray-white clay, sage/teal pools between layers
3d-cat-paws.png	User-provided: clay 3D render of curled cat paws and abstract ring, soft gray clay, pink paw pad details
3d-deaf-advocacy.png	AI-generate: Clay 3D, two human hands rising with fingers gently spread (ASL gesture), smooth rounded organic forms, sage-green teal accent in bg crevices, 16:9
3d-sycophancy.png	AI-generate: Clay 3D, multiple identical smooth dome spheres in perfect mirror pattern, concentric ripple rings from each dome, pale blue-teal accent in valleys, top-down view, 16:9
3d-adversarial.png	AI-generate: Clay 3D, overlapping angular shield forms + branching taxonomy tree nodes, interlocking angular plates, deep teal/steel-blue accent in recesses, dramatic angle, 16:9

Generation prompt style guide (for AI image gen):
* Material: clay-like gray-white surface, smooth matte finish
* Lighting: soft diffuse studio lighting, no harsh shadows
* Accents: sage green, pale teal, blue-green — visible only in crevices/valleys
* Negative prompts: text, labels, faces, photorealistic, dark/scary, weapons, fire, low quality
* Aspect ratio: 16:9 for all card banner images, 16:9 for foundation card images

20. RESPONSIVE BREAKPOINTS (preserve existing)
At ≤768px:
.course-grid, .foundation-grid, .employer-grid { grid-template-columns: 1fr; }
.nexus-cards { grid-template-columns: repeat(3,1fr); }
.papers-grid { grid-template-columns: 1fr; } /* publications.html */


SUMMARY OF ALL SIZING CHANGES
Element	Before	After
.section-number (index)	0.6rem	0.82rem
.nexus-card-title	0.68rem	0.82rem
.nexus-card-sub	0.6rem	0.74rem
.ongoing-bullets li	0.78rem	0.92rem
.cmod-link-btn (pub)	0.6rem	0.72rem
.cmod-gh (pub)	0.57rem	0.73rem
.ongoing-icon	varies	54×54px, border-radius: 6px

End of Version 1.A — Update 4-18-26