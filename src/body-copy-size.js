const bodyCopySelector = [
  "p",
  "li",
  "blockquote",
  "[class$='-desc']",
  "[class$='-note']",
  ".linkedin-text",
  ".hero-statement",
  ".hero-quote",
  ".polymath-journey",
  ".hxo-statement",
  ".legal-victory-text",
  ".esg-gate-text",
  ".edu-degree",
  ".cv-message-copy",
].join(",");

const excludedSelector = [
  ".cv-kicker",
  ".cv-suggestions-label",
  ".cv-message-label",
  ".cv-panel-title",
  ".cv-panel-subtitle",
  ".course-label",
  ".page-hero-label",
  ".section-number",
  ".career-status-label",
  ".edu-year",
].join(",");

const originalInlineSizes = new WeakMap();

function adjustBodyCopy(element) {
  if (!(element instanceof HTMLElement)) return;
  if (element.closest("nav, footer, .site-footer, .nav-links, .footer-links")) return;
  if (element.matches(excludedSelector)) return;

  const originalInline = originalInlineSizes.get(element);
  if (originalInline) {
    if (originalInline.value) {
      element.style.setProperty("font-size", originalInline.value, originalInline.priority);
    } else {
      element.style.removeProperty("font-size");
    }
  } else {
    originalInlineSizes.set(element, {
      value: element.style.getPropertyValue("font-size"),
      priority: element.style.getPropertyPriority("font-size"),
    });
  }

  const currentSize = Number.parseFloat(window.getComputedStyle(element).fontSize);
  if (!Number.isFinite(currentSize)) return;
  element.style.setProperty("font-size", `${currentSize + 2}px`, "important");
}

function adjustAllBodyCopy(root = document) {
  if (root instanceof HTMLElement && root.matches(bodyCopySelector)) {
    adjustBodyCopy(root);
  }
  root.querySelectorAll?.(bodyCopySelector).forEach(adjustBodyCopy);
}

adjustAllBodyCopy();

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) adjustAllBodyCopy(node);
    });
  }
});
observer.observe(document.body, { childList: true, subtree: true });

let resizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => adjustAllBodyCopy(), 120);
});
