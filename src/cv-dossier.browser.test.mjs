import assert from "node:assert/strict";
import { createServer as createNetServer } from "node:net";
import { after, before, test } from "node:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { createServer as createViteServer } from "vite";

const dossierGreeting =
  "I can find evidence in the public CV and portfolio pages. Ask about leadership, research, technical work, or how the pieces connect.";
const projectRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
let viteServer;
let browser;
let siteUrl;

async function findAvailablePort() {
  const probe = createNetServer();
  await new Promise((resolveListen, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolveListen);
  });
  const { port } = probe.address();
  await new Promise((resolveClose, reject) => {
    probe.close((error) => (error ? reject(error) : resolveClose()));
  });
  return port;
}

function installAskInterceptor(page) {
  const queuedRequests = [];
  const waitingConsumers = [];

  page.route("**/api/cv-dossier/ask", (route) => new Promise((resolveRoute) => {
    const request = {
      body: route.request().postDataJSON(),
      async respond(status, payload) {
        await route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(payload),
        });
        resolveRoute();
      },
    };
    const consumer = waitingConsumers.shift();
    if (consumer) consumer(request);
    else queuedRequests.push(request);
  }));

  return {
    nextRequest() {
      const queued = queuedRequests.shift();
      if (queued) return Promise.resolve(queued);
      return new Promise((resolveRequest) => waitingConsumers.push(resolveRequest));
    },
  };
}

async function openDossier(t) {
  const page = await browser.newPage();
  t.after(() => page.close());
  const asks = installAskInterceptor(page);
  await page.goto(`${siteUrl}/publications.html`);
  await page.locator(".cv-reset").waitFor();
  return { page, asks };
}

async function submitQuestion(page, question) {
  await page.locator(".cv-input").fill(question);
  await page.locator(".cv-send").click();
}

async function assertComposerEnabled(page) {
  assert.equal(await page.locator(".cv-input").isDisabled(), false);
  assert.equal(await page.locator(".cv-send").isDisabled(), false);
  assert.equal(await page.locator(".cv-prompt").first().isDisabled(), false);
  assert.equal(await page.locator(".cv-live").textContent(), "Ready");
}

async function assertConversation(page, expectedMessages) {
  assert.deepEqual(await page.locator(".cv-message-copy").allTextContents(), expectedMessages);
}

before(async () => {
  const port = await findAvailablePort();
  process.env.PORT = String(port);
  viteServer = await createViteServer({
    configFile: resolve(projectRoot, "vite.config.ts"),
    server: { host: "127.0.0.1", port, strictPort: true },
    logLevel: "error",
  });
  await viteServer.listen();
  siteUrl = `http://127.0.0.1:${port}`;

  const configuredChromium = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  const workspaceChromium = "/repl/tools/bin/chromium";
  const executablePath = configuredChromium ||
    (existsSync(workspaceChromium) ? workspaceChromium : undefined);
  browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    args: ["--no-sandbox"],
  });
});

after(async () => {
  await browser?.close();
  await viteServer?.close();
});

test("clearing an idle dossier removes the old exchange and stays ready", async (t) => {
  const { page, asks } = await openDossier(t);
  await submitQuestion(page, "An earlier question");
  const initialRequest = await asks.nextRequest();
  assert.deepEqual(initialRequest.body.messages, [
    { role: "user", content: "An earlier question" },
  ]);
  await initialRequest.respond(200, { answer: "An earlier answer", sources: [] });

  await page.getByText("An earlier answer", { exact: true }).waitFor();
  await page.locator(".cv-reset").click();

  await assertConversation(page, [dossierGreeting]);
  assert.equal(await page.locator(".cv-input").inputValue(), "");
  assert.equal(await page.locator(".cv-error").isVisible(), false);
  await assertComposerEnabled(page);
});

test("clearing during a request ignores its late answer and restores a fresh conversation", async (t) => {
  const { page, asks } = await openDossier(t);
  await submitQuestion(page, "Question from before reset");
  const oldRequest = await asks.nextRequest();
  await page.locator(".cv-loading").waitFor();

  assert.equal(await page.locator(".cv-live").textContent(), "Thinking");
  assert.equal(await page.locator(".cv-input").isDisabled(), true);
  assert.equal(await page.locator(".cv-send").isDisabled(), true);
  assert.equal(await page.locator(".cv-prompt").first().isDisabled(), true);

  await page.locator(".cv-reset").click();
  await assertConversation(page, [dossierGreeting]);
  await page.locator(".cv-loading").waitFor();
  assert.equal(await page.locator(".cv-input").isDisabled(), true);

  await oldRequest.respond(200, {
    answer: "This answer must not return after reset",
    sources: [],
  });
  await page.locator(".cv-loading").waitFor({ state: "detached" });

  await assertConversation(page, [dossierGreeting]);
  assert.equal(await page.getByText("This answer must not return after reset", { exact: true }).count(), 0);
  assert.equal(await page.locator(".cv-error").isVisible(), false);
  await assertComposerEnabled(page);

  await submitQuestion(page, "Question in the fresh conversation");
  const freshRequest = await asks.nextRequest();
  assert.deepEqual(freshRequest.body.messages, [
    { role: "user", content: "Question in the fresh conversation" },
  ]);
  await freshRequest.respond(200, { answer: "Fresh answer", sources: [] });
  await page.getByText("Fresh answer", { exact: true }).waitFor();
  await assertConversation(page, [
    dossierGreeting,
    "Question in the fresh conversation",
    "Fresh answer",
  ]);
});

test("clearing during a request ignores its late error and restores a fresh conversation", async (t) => {
  const { page, asks } = await openDossier(t);
  await submitQuestion(page, "Question that will fail after reset");
  const oldRequest = await asks.nextRequest();
  await page.locator(".cv-loading").waitFor();
  await page.locator(".cv-reset").click();
  await assertConversation(page, [dossierGreeting]);

  await oldRequest.respond(503, { error: "Old request failure" });
  await page.locator(".cv-loading").waitFor({ state: "detached" });

  await assertConversation(page, [dossierGreeting]);
  assert.equal(await page.locator(".cv-error").isVisible(), false);
  assert.equal(await page.getByText("Old request failure", { exact: true }).count(), 0);
  await assertComposerEnabled(page);

  await submitQuestion(page, "Question after the ignored error");
  const freshRequest = await asks.nextRequest();
  assert.deepEqual(freshRequest.body.messages, [
    { role: "user", content: "Question after the ignored error" },
  ]);
  await freshRequest.respond(200, { answer: "Answer after the reset", sources: [] });
  await page.getByText("Answer after the reset", { exact: true }).waitFor();
  await assertConversation(page, [
    dossierGreeting,
    "Question after the ignored error",
    "Answer after the reset",
  ]);
});
