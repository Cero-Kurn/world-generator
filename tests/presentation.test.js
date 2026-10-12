import test from "node:test";
import assert from "node:assert/strict";
import { generateStarSystem } from "../js/star-system.js";
import { fixtureFor } from "./context-fixtures.js";

const elements = Object.fromEntries(["#output", "#seedInput", "#generateButton", "#randomButton"].map(id =>
  [id, { value: "Canopus-01", innerHTML: "", handlers: {}, addEventListener(event, handler) { this.handlers[event] = handler; } }]));
globalThis.document = { querySelector: id => elements[id] };
const { renderPlanet, renderPlanetSites, renderSite } = await import("../js/generator.js");
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

test("automatic sites are rendered by the browser with matching planet links and visible feature evidence and notes", () => {
  assert.ok(elements["#output"].innerHTML.includes("Local sites</h2>"));
  const p = generateStarSystem("context-6").planets[1];
  const html = renderPlanetSites(p);
  const entities = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#039;": "'" };
  const notes = [...html.matchAll(/<p class="feature-notes">([\s\S]*?)<\/p>/g)].map(m => m[1].replace(/&(amp|lt|gt|quot|#039);/g, entity => entities[entity]));
  assert.ok(renderPlanet(p).includes(`href="#planet-${p.index}-sites"`));
  assert.ok(html.includes(`id="planet-${p.index}-sites"`));
  for (const site of p.sites) {
    assert.ok(html.includes(site.name));
    for (const f of site.features) {
      assert.ok(html.includes(f.name));
      assert.ok(notes.includes(f.notes));
      assert.ok(html.includes(f.evidence));
    }
  }
  assert.ok(html.includes('<p class="feature-evidence">'));
  assert.ok(html.includes('<p class="feature-notes">'));
  assert.equal(html.includes("<details"), false);
});

test("site text is escaped and unavailable worlds explain why no locations were generated", () => {
  const p = generateStarSystem("context-6").planets[1];
  const site = structuredClone(p.sites[0]);
  site.name = '<img src=x onerror="alert(1)">';
  site.summary = "<script>summary</script>";
  site.context.transition.description = "<script>boundary</script>";
  site.features[0].evidence = "<script>evidence</script>";
  site.features[0].notes = "<script>notes</script>";
  const html = renderSite(site);
  assert.equal(html.includes("<script>"), false);
  assert.equal(html.includes("<img "), false);
  for (const word of ["summary", "boundary", "evidence", "notes"]) assert.ok(html.includes(`&lt;script&gt;${word}&lt;/script&gt;`));
  const unavailable = generateStarSystem("context-6").planets[0];
  assert.ok(renderPlanetSites(unavailable).includes(unavailable.siteGenerationReason));
  assert.equal(renderPlanetSites(unavailable).includes('class="site-list"'), false);
});
