import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished KitchenRx shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>KitchenRx — Practical meal support<\/title>/i);
  assert.match(html, /Food support for the day you actually have/);
  assert.match(html, /This prototype runs locally in the browser/);
  assert.match(html, /Grounded in culinary expertise/);
  assert.match(html, /licensed cook and confectionery hygienist in Japan/);
  assert.match(html, /Recipe explorer/);
  assert.match(html, /Food &amp; nutrient guide/);
  assert.match(html, /Explore the ingredients behind the meal/);
  assert.match(html, /View related recipes/);
  assert.match(html, /Food information only/);
  assert.match(html, /National Eye Institute/);
  assert.match(html, /https:\/\/www\.nei\.nih\.gov\/eye-health-information/);
  assert.match(html, /Soft Egg &amp; Scallion Rice/);
  assert.match(html, /Miso Salmon &amp; Vegetable Rice Bowl/);
  assert.match(html, /Spinach &amp; Almond Lemon Pasta/);
  assert.match(html, /Blueberry &amp; Almond Oat Bowl/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-rendered copy stays non-medical and privacy-forward", async () => {
  const html = await (await render()).text();
  assert.match(html, /food-support prototype, not medical advice/i);
  assert.match(html, /No backend · No login · No data collection/);
  assert.match(html, /does not promise changes to vision or health/i);
  assert.match(html, /does not provide supplement instructions/i);
  assert.doesNotMatch(html, /cures|clinically proven|prescribed for|recommended for patients/i);
  assert.doesNotMatch(html, /doctor-reviewed|dietitian-reviewed|registered dietitian|medical supervision/i);
});
