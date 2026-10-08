import test from "node:test";
import assert from "node:assert/strict";
import { generateStarSystem } from "../js/star-system.js";
import { fixtureFor } from "./context-fixtures.js";

const elements = Object.fromEntries(["#output", "#seedInput", "#generateButton", "#randomButton"].map(id =>
  [id, { value: "Canopus-01", innerHTML: "", handlers: {}, addEventListener(event, handler) { this.handlers[event] = handler; } }]));
globalThis.document = { querySelector: id => elements[id] };
const { renderPlanet } = await import("../js/generator.js");
delete globalThis.document;

test("the browser entry point renders the default system instead of a generation error", () => {
  assert.ok(elements["#output"].innerHTML.includes("Planetary System"));
  assert.equal(elements["#output"].innerHTML.includes("Generation error:"), false);
  assert.equal(typeof elements["#generateButton"].handlers.click, "function");
});

test("selected feature notes are visible paragraphs and escape source text", () => {
  const p = generateStarSystem("context-6", { siteContexts: { 2: fixtureFor("zones of transition") } }).planets[1];
  const html = renderPlanet(p);
  assert.ok(html.includes('<p class="feature-notes">'));
  assert.ok(html.includes("Supported occurrence:"));
  assert.ok(html.includes("Name the actual pair"));
  assert.equal(html.includes("title=\"ecotones"), false);
  p.biomeFeatures[0].notes = '<script>alert("x")</script>\nsecond line';
  const escaped = renderPlanet(p);
  assert.equal(escaped.includes("<script>"), false);
  assert.ok(escaped.includes("&lt;script&gt;"));
});
