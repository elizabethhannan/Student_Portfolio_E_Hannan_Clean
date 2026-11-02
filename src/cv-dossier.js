const root = document.querySelector("[data-cv-dossier]");

if (root) {
  const themeClass = root.dataset.theme === "navy" ? "cv-dossier--navy" : "";
  root.outerHTML = `
    <section class="cv-dossier ${themeClass}" id="cv-dossier" aria-labelledby="cv-dossier-heading">
      <div class="cv-inner">
        <div class="cv-layout">
          <div class="cv-intro">
            <p class="cv-kicker">Recruiter desk · CV dossier</p>
            <h2 class="cv-heading" id="cv-dossier-heading">Ask this<br><em>CV Dossier</em></h2>
            <p class="cv-deck">Explore the experience, research, and technical work behind this portfolio. Ask for evidence, context, or the thread connecting it all.</p>
            <p class="cv-ready">I’m not a bot; my CV Dossier is ready to answer your questions. This isn’t a generic bot—it’s an AI guide to my CV dossier. Ask away.</p>
            <p class="cv-privacy">
              <svg class="cv-privacy-mark" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5.5 8V5.7a4.5 4.5 0 0 1 9 0V8m-10 0h11v9h-11z" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="12" r="1" fill="currentColor"/></svg>
              <span>AI-assisted answers grounded in the public CV and portfolio site. This conversation stays in this page session and is not saved.</span>
            </p>
          </div>
          <div class="cv-panel">
            <div class="cv-panel-head">
              <span class="cv-mark" aria-hidden="true">E</span>
              <div>
                <p class="cv-panel-title">CV dossier guide</p>
                <p class="cv-panel-subtitle">Evidence-led · recruiter focused</p>
              </div>
              <span class="cv-live">Ready</span>
              <button class="cv-reset" type="button" aria-label="Clear conversation and start over">Clear</button>
            </div>
            <div class="cv-conversation" role="log" aria-label="Dossier conversation" aria-live="polite" aria-relevant="additions text"></div>
            <div class="cv-error" role="alert" hidden></div>
            <div class="cv-suggestions">
              <p class="cv-suggestions-label">Try a recruiter question</p>
              <div class="cv-prompt-list">
                <button class="cv-prompt" type="button">What evidence shows enterprise technology leadership?</button>
                <button class="cv-prompt" type="button">How does the research connect to practical AI work?</button>
                <button class="cv-prompt" type="button">Which technical projects are documented in the dossier?</button>
                <button class="cv-prompt" type="button">What themes run across the career experience?</button>
              </div>
            </div>
            <form class="cv-compose">
              <label class="sr-only" for="cv-dossier-question">Ask a question about the CV dossier</label>
              <textarea class="cv-input" id="cv-dossier-question" name="question" rows="1" maxlength="1200" placeholder="Ask about experience, research, or technical work…" autocomplete="off"></textarea>
              <button class="cv-send" type="submit" aria-label="Send question">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m21 3-7.2 18-3.8-7-7-3.8L21 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 14 21 3" stroke="currentColor" stroke-width="1.6"/></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      <svg class="cv-wave" viewBox="0 0 700 50" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 28 C90 4 130 48 220 26 S350 4 440 26 580 48 700 18"/>
        <path d="M0 38 C90 14 130 58 220 36 S350 14 440 36 580 58 700 28"/>
      </svg>
    </section>`;

  const section = document.querySelector("#cv-dossier");
  const form = section.querySelector(".cv-compose");
  const input = section.querySelector(".cv-input");
  const conversation = section.querySelector(".cv-conversation");
  const errorBox = section.querySelector(".cv-error");
  const sendButton = section.querySelector(".cv-send");
  const resetButton = section.querySelector(".cv-reset");
  const prompts = [...section.querySelectorAll(".cv-prompt")];
  const messages = [];
  const greeting = "I can find evidence in the public CV and portfolio pages. Ask about leadership, research, technical work, or how the pieces connect.";
  const sourcePageNames = {
    "contact.html": "Contact",
    "hero-motion.html": "Portfolio",
    "index.html": "Home",
    "one-page.html": "One-page CV",
    "publications.html": "Publications",
    "technical_instruction.html": "Technical Instruction",
  };
  const sourceTitles = {
    "index.html#research": "Home · Research Statement",
    "index.html#projects": "Home · Research Projects",
    "index.html#publications": "Home · Publications",
    "index.html#philanthropy": "Home · Philanthropy & Mission",
    "index.html#code": "Home · Code & Technical Work",
    "index.html#career": "Home · Professional Background",
    "index.html#education": "Home · Education",
    "publications.html#recent-papers": "Publications · Recent Papers",
    "publications.html#philanthropy": "Publications · Philanthropy & Mission",
    "publications.html#esg-algorithm-section": "Publications · Transparent ESG Algorithm",
    "publications.html#philanthropy-documents": "Publications · Philanthropy Documents",
    "publications.html#code": "Publications · Code & Technical Work",
    "technical_instruction.html#system-cards": "Technical Instruction · System Cards",
    "technical_instruction.html#recent-papers": "Technical Instruction · Recent Papers",
  };
  const paperTitles = {
    "#paper-01": "Accessible Alignment: Do LLM Safety Guardrails Hold Across Deaf, DeafBlind, and AAC Communication Modalities?",
    "#paper-02": "Prompt Injection in ESG Reporting: Red Teaming LLM-Assisted Sustainability Disclosure Tools",
    "#paper-03": "Sycophancy by Design: How LLM Interface Patterns Train Users to Accept Unsafe AI Outputs",
    "#paper-04": "Sycophancy in Sustainability: LLMs Validating Greenwashing Across TCFD, CSRD, and SEC Climate Disclosures",
    "#paper-05": "Stranded Capital: Measuring the Economic Cost of AI Accessibility Exclusion Across the Disability Market",
    "#paper-07": "The Adoption Cliff: Early-Career Disabled Workers, AI Skill Formation, and Compounding Economic Exclusion",
  };

  function resolveSource(value) {
    const match = value.match(/^([a-z0-9_-]+\.html)(#[a-zA-Z0-9_-]+)?$/);
    if (!match) return null;
    const pageName = sourcePageNames[match[1]] || match[1]
      .replace(/\.html$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    const anchorName = match[2]?.slice(1).replace(/[-_]+/g, " ");
    return {
      href: `./${value}`,
      label: sourceTitles[value] || (paperTitles[match[2]] ? `${pageName} · ${paperTitles[match[2]]}` : anchorName ? `${pageName} · ${anchorName}` : pageName),
    };
  }
  let pending = false;
  let conversationVersion = 0;

  function appendMessage(role, content, sources = []) {
    const article = document.createElement("article");
    article.className = `cv-message cv-message-${role}`;
    const label = document.createElement("span");
    label.className = "cv-message-label";
    label.textContent = role === "assistant" ? "Dossier guide" : "Your question";
    const copy = document.createElement("p");
    copy.className = "cv-message-copy";
    copy.textContent = content;
    article.append(label, copy);

    if (role === "assistant" && sources.length) {
      const sourceList = document.createElement("div");
      sourceList.className = "cv-sources";
      const sourceLabel = document.createElement("span");
      sourceLabel.className = "cv-sources-label";
      sourceLabel.textContent = "Sources";
      sourceList.append(sourceLabel);
      sources.forEach((source) => {
        const value = String(source);
        const citation = resolveSource(value);
        if (citation) {
          const link = document.createElement("a");
          link.className = "cv-source";
          link.href = citation.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = citation.label;
          sourceList.append(link);
        } else {
          const text = document.createElement("span");
          text.className = "cv-source";
          text.textContent = value;
          sourceList.append(text);
        }
      });
      article.append(sourceList);
    }
    conversation.append(article);
    conversation.scrollTop = conversation.scrollHeight;
  }

  function setPending(value) {
    pending = value;
    sendButton.disabled = value;
    input.disabled = value;
    prompts.forEach((button) => { button.disabled = value; });
    section.querySelector(".cv-live").textContent = value ? "Thinking" : "Ready";
    const existing = conversation.querySelector(".cv-loading");
    if (value && !existing) {
      const loading = document.createElement("div");
      loading.className = "cv-loading";
      loading.setAttribute("role", "status");
      loading.setAttribute("aria-label", "Preparing an answer");
      loading.innerHTML = "<span></span><span></span><span></span>";
      conversation.append(loading);
      conversation.scrollTop = conversation.scrollHeight;
    } else if (!value && existing) {
      existing.remove();
    }
  }

  appendMessage("assistant", greeting);

  function resetConversation() {
    conversationVersion += 1;
    messages.length = 0;
    input.value = "";
    errorBox.hidden = true;
    errorBox.replaceChildren();
    conversation.replaceChildren();
    appendMessage("assistant", greeting);
    setPending(pending);
    if (!pending) input.focus();
  }

  async function ask(question, isRetry = false) {
    const content = question.trim();
    if (pending || (!content && !isRetry)) return;
    errorBox.hidden = true;
    errorBox.textContent = "";

    if (!isRetry) {
      messages.push({ role: "user", content });
      while (messages.length > 10) messages.shift();
      appendMessage("user", content);
      input.value = "";
    }

    setPending(true);
    const requestVersion = conversationVersion;
    try {
      const response = await fetch("/api/cv-dossier/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages.slice(-10) }),
      });
      let payload;
      try {
        payload = await response.json();
      } catch {
        payload = {};
      }
      if (!response.ok) {
        throw new Error(payload && typeof payload.error === "string" ? payload.error : `The dossier service returned an error (${response.status}).`);
      }
      if (!payload || typeof payload.answer !== "string" || !payload.answer.trim()) {
        throw new Error("The dossier service returned an empty answer. Please try again.");
      }
      if (requestVersion !== conversationVersion) return;
      const answer = payload.answer.trim();
      const sources = Array.isArray(payload.sources) ? payload.sources : [];
      messages.push({ role: "assistant", content: answer });
      while (messages.length > 10) messages.shift();
      appendMessage("assistant", answer, sources);
    } catch (error) {
      if (requestVersion !== conversationVersion) return;
      errorBox.replaceChildren();
      const message = document.createElement("span");
      message.textContent = error instanceof Error ? error.message : "We couldn’t reach the dossier service.";
      const retry = document.createElement("button");
      retry.type = "button";
      retry.textContent = "Retry";
      retry.addEventListener("click", () => ask("", true));
      errorBox.append(message, retry);
      errorBox.hidden = false;
    } finally {
      setPending(false);
      if (!pending) input.focus();
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
  });
  resetButton.addEventListener("click", resetConversation);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  prompts.forEach((button) => button.addEventListener("click", () => ask(button.textContent)));
}
