import { defineConfig } from "vite";
import { basename, dirname, resolve } from "path";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";

const publicSiteUrl = "https://e-hannan-career-portfolio.replit.app";
const knownAgentSources = [
  {
    file: "index.html",
    path: "/",
    label: "Portfolio Home",
    summary:
      "Elizabeth Hannan’s non-traditional student portfolio, with career overview, research, projects, publications, technical work, education, and the CV Dossier.",
  },
  {
    file: "publications.html",
    path: "/publications.html",
    label: "Publications & Papers",
    summary:
      "Research statements, papers, portfolio works, philanthropy documents, and technical projects.",
  },
  {
    file: "technical_instruction.html",
    path: "/technical_instruction.html",
    label: "Technical Writing & Research",
    summary:
      "System cards, research papers, technical writing samples, and code examples.",
  },
  {
    file: "one-page.html",
    path: "/one-page.html",
    label: "One-Page CV",
    summary: "A concise public CV and professional profile.",
  },
  {
    file: "contact.html",
    path: "/contact.html",
    label: "Contact & Speaking Inquiries",
    summary: "Contact options and speaking-opportunity inquiries.",
  },
  {
    file: "hero-motion.html",
    path: "/hero-motion.html",
    label: "Motion Portfolio",
    summary:
      "A visual portfolio experience; consult the source page for motion content not represented in text.",
  },
];

function discoverAgentSourcePages(projectRoot: string) {
  const knownSources = new Map(
    knownAgentSources.map((source) => [source.file, source]),
  );

  return readdirSync(projectRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        /\.html$/i.test(entry.name) &&
        entry.name.toLowerCase() !== "agents.html",
    )
    .map((entry) => {
      const knownSource = knownSources.get(entry.name);
      if (knownSource) return knownSource;

      const label = entry.name
        .replace(/\.html$/i, "")
        .split(/[-_]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
      return {
        file: entry.name,
        path: `/${entry.name}`,
        label,
        summary: "Public source page from the portfolio site.",
      };
    })
    .sort((first, second) => {
      if (first.file === "index.html") return -1;
      if (second.file === "index.html") return 1;
      return first.file.localeCompare(second.file);
    });
}

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    bull: "•",
    copy: "©",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    mdash: "—",
    middot: "·",
    nbsp: " ",
    ndash: "–",
    quot: '"',
    rdquo: "”",
    reg: "®",
    rsquo: "’",
    trade: "™",
  };

  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (entity, name: string) =>
      namedEntities[name.toLowerCase()] ?? entity,
    );
}

function inlineText(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function removeExcludedSubtrees(html: string) {
  const tagPattern = /<\/?([a-z][\w:-]*)\b[^>]*>/gi;
  const voidTags = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);
  const output: string[] = [];
  let skippedTags: string[] = [];
  let cursor = 0;

  for (const match of html.matchAll(tagPattern)) {
    const tag = match[1].toLowerCase();
    const token = match[0];
    const start = match.index ?? 0;
    const isClosing = token.startsWith("</");
    const isSelfClosing = /\/\s*>$/.test(token) || voidTags.has(tag);

    if (skippedTags.length > 0) {
      if (isClosing) {
        const matchingTagIndex = skippedTags.lastIndexOf(tag);
        if (matchingTagIndex >= 0) skippedTags.length = matchingTagIndex;
      } else if (!isSelfClosing) {
        skippedTags.push(tag);
      }
      cursor = start + token.length;
      continue;
    }

    output.push(html.slice(cursor, start));
    const attributes = token.match(/\b(?:class|id)\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
    const isHidden =
      /\baria-hidden\s*=\s*(["'])true\1/i.test(token) ||
      /\bhidden(?:\s|=|\/?>)/i.test(token) ||
      /\bstyle\s*=\s*(["'])[^"']*display\s*:\s*none/i.test(token) ||
      /\b(?:modal|overlay|popup|gate)\b/i.test(attributes);

    if (!isClosing && !isSelfClosing && isHidden) {
      skippedTags = [tag];
    } else {
      output.push(token);
    }
    cursor = start + token.length;
  }

  if (skippedTags.length === 0) output.push(html.slice(cursor));
  return output.join("");
}

function extractReadablePageText(html: string) {
  let content = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  content = content.replace(/<!--[\s\S]*?-->/g, " ");
  content = removeExcludedSubtrees(content);

  for (const tag of [
    "script",
    "style",
    "noscript",
    "nav",
    "footer",
    "form",
    "svg",
    "canvas",
  ]) {
    content = content.replace(
      new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, "gi"),
      " ",
    );
  }

  const codeBlocks: string[] = [];
  content = content.replace(
    /<pre\b[^>]*>([\s\S]*?)<\/pre\s*>/gi,
    (_, code: string) => {
      const marker = `\u0000AGENT_CODE_${codeBlocks.length}\u0000`;
      codeBlocks.push(decodeHtmlEntities(code.replace(/<[^>]*>/g, "")).trim());
      return `\n\n${marker}\n\n`;
    },
  );

  content = content.replace(
    /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi,
    (_, level: string, heading: string) =>
      `\n\n${"#".repeat(Number(level))} ${inlineText(heading)}\n\n`,
  );
  content = content.replace(/<li\b[^>]*>/gi, "\n- ");
  content = content.replace(/<\/li\s*>/gi, "\n");
  content = content.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi,
    (_, attributes: string, inner: string) => {
      const match = attributes.match(
        /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
      );
      const href = decodeHtmlEntities(match?.[1] ?? match?.[2] ?? match?.[3] ?? "");
      const label = inlineText(inner);
      if (!label) return href;
      return href ? `${label} [${href}]` : label;
    },
  );
  content = content.replace(/<img\b([^>]*)>/gi, (_, attributes: string) => {
    const alt = attributes.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const description = inlineText(alt?.[1] ?? alt?.[2] ?? "");
    return description ? ` [Image: ${description}] ` : " ";
  });
  content = content.replace(/<br\b[^>]*\/?>|<hr\b[^>]*\/?>/gi, "\n");
  content = content.replace(
    /<\/?(?:p|div|section|article|main|header|blockquote|ul|ol|dl|dt|dd|table|thead|tbody|tr|td|th)\b[^>]*>/gi,
    "\n",
  );
  content = content.replace(/<[^>]*>/g, " ");
  content = decodeHtmlEntities(content)
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return content.replace(/\u0000AGENT_CODE_(\d+)\u0000/g, (_, index: string) => {
    const code = codeBlocks[Number(index)] ?? "";
    return `\n\n${code}\n\n`;
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function writeIfChanged(filePath: string, content: string) {
  const existing = existsSync(filePath) ? readFileSync(filePath, "utf8") : null;
  if (existing !== content) writeFileSync(filePath, content);
}

function renderAgentPage(pages: Array<Record<string, any>>, generatedAt: string) {
  const sourceCards = pages
    .map(
      (page) => `
        <article class="source-card">
          <h3><a href="${escapeHtml(page.path)}">${escapeHtml(page.label)}</a></h3>
          <p>${escapeHtml(page.summary)}</p>
          <a class="source-link" href="${escapeHtml(page.path)}">Open source page <span aria-hidden="true">↗</span></a>
        </article>`,
    )
    .join("");
  const sourceText = pages
    .map(
      (page) => `
        <details class="source-content">
          <summary>${escapeHtml(page.label)} <span>${escapeHtml(page.title)}</span></summary>
          <p class="source-meta">Source: <a href="${escapeHtml(page.path)}">${escapeHtml(page.url)}</a></p>
          <pre>${escapeHtml(page.content)}</pre>
        </details>`,
    )
    .join("");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Non-Traditional Student Portfolio Index — Elizabeth Hannan",
    description:
      "Text-first index of Elizabeth Hannan’s non-traditional student portfolio, with sources for AI safety research, projects, education, publications, and CV.",
    url: `${publicSiteUrl}/agents.html`,
    dateModified: generatedAt,
    about: {
      "@type": "Person",
      name: "Elizabeth Hannan",
      url: publicSiteUrl,
      description:
        "Elizabeth Hannan’s portfolio as a non-traditional student, featuring AI safety research, technical projects, publications, education, and professional experience.",
    },
    hasPart: pages.map((page) => ({
      "@type": "WebPage",
      name: page.label,
      url: page.url,
      description: page.summary,
    })),
  };
  const structuredJson = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow">
  <meta name="description" content="Text-first index of Elizabeth Hannan’s non-traditional student portfolio, with sources for AI safety research, projects, education, publications, and CV.">
  <link rel="canonical" href="${publicSiteUrl}/agents.html">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="alternate" type="application/json" href="/agents.json">
  <meta property="og:title" content="Non-Traditional Student Portfolio Index | Elizabeth Hannan">
  <meta property="og:description" content="Text-first index of Elizabeth Hannan’s non-traditional student portfolio, with sources for AI safety research, projects, education, publications, and CV.">
  <meta property="og:url" content="${publicSiteUrl}/agents.html">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="Elizabeth Hannan Public Portfolio">
  <meta property="og:image" content="${publicSiteUrl}/opengraph.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Non-Traditional Student Portfolio Index | Elizabeth Hannan">
  <meta name="twitter:description" content="Text-first index of Elizabeth Hannan’s non-traditional student portfolio, with sources for AI safety research, projects, education, publications, and CV.">
  <meta name="twitter:image" content="${publicSiteUrl}/opengraph.jpg">
  <title>Non-Traditional Student Portfolio Index | Elizabeth Hannan</title>
  <script type="application/ld+json">${structuredJson}</script>
  <style>
    :root { color-scheme: light; --paper: #f5f2ec; --ink: #0f1829; --accent: #2a6b6b; --muted: #657078; --rule: #d8d4ca; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--paper); color: var(--ink); font: 16px/1.65 Inter, Arial, sans-serif; }
    .agent-nav { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem max(1.25rem, calc((100vw - 1100px) / 2)); border-bottom: 1px solid var(--rule); }
    .agent-brand, .agent-nav a { color: var(--ink); text-decoration: none; }
    .agent-brand { font: 600 0.78rem/1.3 ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 0.16em; text-transform: uppercase; }
    .agent-nav a:last-child { color: var(--accent); font: 600 0.75rem/1.4 ui-monospace, SFMono-Regular, Consolas, monospace; }
    main { width: min(1100px, calc(100% - 3rem)); margin: 0 auto; }
    .agent-hero { padding: clamp(3.5rem, 8vw, 6rem) 0 2.5rem; }
    .eyebrow { margin: 0 0 0.9rem; color: var(--accent); font: 700 0.76rem/1.4 ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 0.16em; text-transform: uppercase; }
    h1, h2, h3 { font-family: Georgia, "Times New Roman", serif; font-weight: 400; }
    h1 { margin: 0 0 1rem; font-size: clamp(2.9rem, 7vw, 5.5rem); line-height: 0.98; letter-spacing: -0.035em; }
    .intro { max-width: 760px; margin: 0; color: #44515a; font-size: 1.15rem; line-height: 1.75; }
    .agent-note { margin: 2rem 0 3.5rem; padding: 1.2rem 1.4rem; border-left: 3px solid var(--accent); background: rgba(42,107,107,0.08); color: #354149; }
    .agent-note strong { color: var(--ink); }
    .index-heading { margin: 0 0 1.2rem; font-size: clamp(1.8rem, 4vw, 2.5rem); }
    .source-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-bottom: 3.5rem; }
    .source-card { padding: 1.3rem 1.4rem; border: 1px solid var(--rule); background: rgba(255,255,255,0.56); }
    .source-card h3 { margin: 0 0 0.45rem; font-size: 1.35rem; line-height: 1.25; }
    .source-card h3 a { color: var(--ink); text-decoration: none; }
    .source-card p { min-height: 3.4em; margin: 0 0 1rem; color: var(--muted); }
    .source-link { color: var(--accent); font: 700 0.76rem/1.5 ui-monospace, SFMono-Regular, Consolas, monospace; letter-spacing: 0.06em; text-decoration: none; text-transform: uppercase; }
    .source-link:hover, .agent-nav a:hover { text-decoration: underline; text-underline-offset: 0.2em; }
    .source-content { border-top: 1px solid var(--rule); padding: 1rem 0; }
    .source-content:last-child { border-bottom: 1px solid var(--rule); }
    .source-content summary { cursor: pointer; color: var(--ink); font-weight: 650; }
    .source-content summary span { margin-left: 0.4rem; color: var(--muted); font-weight: 400; }
    .source-meta { margin: 0.9rem 0; color: var(--muted); font-size: 0.9rem; }
    .source-meta a { color: var(--accent); overflow-wrap: anywhere; }
    pre { margin: 0; padding: 1.2rem; overflow: auto; border: 1px solid #e2ded5; background: rgba(255,255,255,0.72); color: #26323b; font: 0.9rem/1.65 ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
    .agent-footer { margin-top: 3.5rem; padding: 1.5rem 0 2.5rem; border-top: 1px solid var(--rule); color: var(--muted); font-size: 0.85rem; }
    .agent-footer a { color: var(--accent); }
    @media (max-width: 680px) {
      .agent-nav { align-items: flex-start; flex-direction: column; padding: 1rem 1.25rem; }
      main { width: min(100% - 2rem, 1100px); }
      .source-grid { grid-template-columns: 1fr; }
      .source-card p { min-height: 0; }
      .source-content summary span { display: block; margin: 0.25rem 0 0; }
    }
  </style>
</head>
<body>
  <nav class="agent-nav" aria-label="Agent resource navigation">
    <a class="agent-brand" href="/">Elizabeth Hannan · Public Portfolio</a>
    <a href="/agents.json">Open machine-readable JSON</a>
  </nav>
  <main>
    <header class="agent-hero">
      <p class="eyebrow">Welcome Agents · public source index</p>
      <h1>Non-Traditional Student Portfolio</h1>
      <p class="intro">This text-first index covers Elizabeth Hannan’s non-traditional student portfolio and the current readable text from its public source pages. Follow the source links for context, links, and visual material.</p>
      <aside class="agent-note"><strong>Source guidance:</strong> Use the linked public pages as the source of truth, cite the page that supports each claim, and say when a detail is not specified. This export contains public site content only; it does not include private dossier conversations or session data.</aside>
    </header>
    <section aria-labelledby="sources-heading">
      <h2 class="index-heading" id="sources-heading">Public source pages</h2>
      <div class="source-grid">${sourceCards}
      </div>
    </section>
    <section aria-labelledby="content-heading">
      <h2 class="index-heading" id="content-heading">Readable page content</h2>
      <p class="intro" style="font-size:1rem;margin-bottom:1.5rem;">This content is generated from the current site pages during development and every production build. Open a source below to read its text, or use the JSON link for structured data.</p>
      ${sourceText}
    </section>
    <footer class="agent-footer">Generated ${escapeHtml(generatedAt)} · <a href="/">Return to the portfolio</a></footer>
  </main>
</body>
</html>`;
}

function agentContentPlugin() {
  let projectRoot = "";
  const speakingPanelMarker = "<!-- shared:speaking-panel -->";

  const expandSpeakingPanel = (html: string) => {
    if (!html.includes(speakingPanelMarker)) return html;

    const partialPath = resolve(projectRoot, "src/speaking-panel.html");
    if (!existsSync(partialPath)) {
      throw new Error(`Shared speaking panel is missing: ${partialPath}`);
    }

    return html.replaceAll(
      speakingPanelMarker,
      readFileSync(partialPath, "utf8").trim(),
    );
  };

  const refreshAgentResources = () => {
    if (!projectRoot) return;
    const sourcePages = discoverAgentSourcePages(projectRoot);
    const pages = sourcePages.map((source) => {
      const sourceFile = resolve(projectRoot, source.file);
      if (!existsSync(sourceFile)) {
        throw new Error(`Agent resource source page is missing: ${sourceFile}`);
      }

      const html = expandSpeakingPanel(readFileSync(sourceFile, "utf8"));
      const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
      const title = inlineText(titleMatch?.[1] ?? source.label);
      const content = extractReadablePageText(html);

      return {
        ...source,
        title,
        url: `${publicSiteUrl}${source.path === "/" ? "/" : source.path}`,
        headings: content
          .split("\n")
          .filter((line) => /^#{1,6}\s+/.test(line))
          .map((line) => line.replace(/^#+\s+/, "")),
        content,
      };
    });
    const generatedAt = new Date().toISOString();
    const publicDirectory = resolve(projectRoot, "public");
    mkdirSync(publicDirectory, { recursive: true });
    const json = JSON.stringify(
      {
        name: "Elizabeth Hannan — Non-Traditional Student Portfolio",
        description:
          "Generated text and source links for Elizabeth Hannan’s non-traditional student portfolio.",
        generatedAt,
        sourceGuidance:
          "Use the source page URL for citations. If the public pages do not specify a detail, say it is not specified. This feed excludes private dossier conversations and session data.",
        pages,
      },
      null,
      2,
    );

    writeIfChanged(resolve(publicDirectory, "agents.json"), `${json}\n`);
    writeIfChanged(
      resolve(publicDirectory, "agents.html"),
      renderAgentPage(pages, generatedAt),
    );
    const sitemapUrls = [
      ...pages.map((page) => page.url),
      `${publicSiteUrl}/agents.html`,
    ];
    const sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...sitemapUrls.map(
        (url) => `  <url><loc>${escapeHtml(url)}</loc></url>`,
      ),
      "</urlset>",
      "",
    ].join("\n");
    writeIfChanged(resolve(publicDirectory, "sitemap.xml"), sitemap);
    writeIfChanged(
      resolve(publicDirectory, "robots.txt"),
      `User-agent: *\nAllow: /\nSitemap: ${publicSiteUrl}/sitemap.xml\n`,
    );
  };

  return {
    name: "public-agent-content-index",
    transformIndexHtml: {
      order: "pre" as const,
      handler(html: string) {
        return expandSpeakingPanel(html);
      },
    },
    configResolved(config: { root: string }) {
      projectRoot = config.root;
      refreshAgentResources();
    },
    configureServer(server: {
      watcher: {
        add(paths: string[]): void;
        on(
          event: "change" | "add" | "unlink",
          listener: (file: string) => void,
        ): void;
      };
      ws: { send(payload: { type: "full-reload" }): void };
      config: { logger: { error(message: string): void } };
    }) {
      const sharedSpeakingSources = [
        resolve(projectRoot, "src/speaking-panel.html"),
        resolve(projectRoot, "src/speaking-panel.css"),
      ];
      server.watcher.add([projectRoot, ...sharedSpeakingSources]);
      const refreshOnSourcePageChange = (file: string) => {
        const absoluteFile = resolve(file);
        const isSharedSpeakingSource = sharedSpeakingSources.includes(absoluteFile);
        if (
          !isSharedSpeakingSource &&
          (dirname(absoluteFile) !== projectRoot ||
            !/\.html$/i.test(absoluteFile) ||
            basename(absoluteFile).toLowerCase() === "agents.html")
        ) {
          return;
        }
        try {
          refreshAgentResources();
          server.ws.send({ type: "full-reload" });
        } catch (error) {
          server.config.logger.error(
            error instanceof Error ? error.message : String(error),
          );
        }
      };
      server.watcher.on("change", refreshOnSourcePageChange);
      server.watcher.on("add", refreshOnSourcePageChange);
      server.watcher.on("unlink", refreshOnSourcePageChange);
    },
  };
}

export default defineConfig({
  base: basePath,
  root: new URL(".", import.meta.url).pathname,
  plugins: [agentContentPlugin()],
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        publications: resolve(__dirname, "publications.html"),
        contact: resolve(__dirname, "contact.html"),
        technical_instruction: resolve(__dirname, "technical_instruction.html"),
        hero_motion: resolve(__dirname, "hero-motion.html"),
        one_page: resolve(__dirname, "one-page.html"),
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
