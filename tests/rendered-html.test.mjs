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
  assert.match(html, /Named public sources/);
  assert.match(html, /Saved recipes and language preferences stay in this browser/);
  assert.match(html, /Grounded in culinary expertise/);
  assert.match(html, /licensed cook and confectionery hygienist in Japan/);
  assert.match(html, /Recipe explorer/);
  assert.match(html, /Food &amp; nutrient guide/);
  assert.match(html, /Explore the ingredients behind the meal/);
  assert.match(html, /View related recipes/);
  assert.match(html, /Ideas for choosing ingredients/);
  assert.match(html, /dark leafy greens, colorful vegetables, fruit, fish, beans, nuts, and whole grains/);
  assert.doesNotMatch(html, /Reference note|Reference information<\/strong>/);
  assert.match(html, /National Eye Institute/);
  assert.match(html, /https:\/\/www\.nei\.nih\.gov\/eye-health-information/);
  assert.match(html, /Soft Egg &amp; Scallion Rice/);
  assert.match(html, /Miso Salmon &amp; Vegetable Rice Bowl/);
  assert.match(html, /Spinach &amp; Almond Lemon Pasta/);
  assert.match(html, /Blueberry &amp; Almond Oat Bowl/);
  assert.match(html, /Recipe visuals are illustrative images created for this prototype/);
  assert.match(html, /\/images\/hero\/kitchenrx-hero\.webp/);
  assert.match(html, /\/images\/recipes\/tomato-tofu-pasta\.webp/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-rendered copy keeps one concise health boundary in the guide and footer", async () => {
  const html = await (await render()).text();
  const guideBoundary = "Reference information for choosing foods and meals. It does not provide treatment or supplement dosing guidance.";
  const footerBoundary = "KitchenRx is a food and meal-planning prototype. For medical or diet-specific needs, consult a qualified professional.";
  assert.equal(html.split(guideBoundary).length - 1, 1);
  assert.equal(html.split(footerBoundary).length - 1, 1);
  assert.doesNotMatch(html, /Food support, not medical advice|No backend · No login · No data collection|does not promise changes to vision or health/i);
  assert.doesNotMatch(html, /cures|clinically proven|prescribed for|recommended for patients/i);
  assert.doesNotMatch(html, /doctor-reviewed|dietitian-reviewed|registered dietitian|medical supervision/i);
});
