import test from "node:test";
import assert from "node:assert/strict";
import { selectStarType, STAR_TYPES } from "../data/stars.js";
import { BIOMES, selectBiome, BIOME_TAGS } from "../data/biomes.js";
import { createRng } from "../js/random.js";
import { generateStarSystem } from "../js/star-system.js";
import { fixtureFor } from "./context-fixtures.js";

test("weighted star selection returns the star object needed by planet generation", () => {
  for (let i = 0; i < 100; i++) {
    const star = selectStarType(createRng(`star-${i}`));
    assert.ok(STAR_TYPES.includes(star));
    assert.ok(star.mass > 0 && star.luminosity > 0);
  }
});

test("unsupported temperatures produce no supported biome rather than an invalid desert fallback", () => {
  const biome = selectBiome(1000, 0, createRng("too-hot"));
  assert.equal(biome.name, "No supported surface biome");
  assert.equal(BIOME_TAGS[biome.name], undefined);
  for (const [temperature, water] of [[NaN, 20], [Infinity, 20], [0, 20], [300, -1], [300, 101]]) {
    assert.throws(() => selectBiome(temperature, water, createRng("bad-input")), RangeError);
  }
});

test("1000 generated systems preserve deterministic seeds and select biomes within their supported bounds", t => {
  let planetCount = 0;
  for (let i = 0; i < 1000; i++) {
    const seed = `regression-${i}`;
    const system = generateStarSystem(seed);
    assert.deepEqual(system, generateStarSystem(seed));
    assert.ok(system.planetCount >= 3 && system.planetCount <= 9);
    assert.equal(system.planets.length, system.planetCount);
    for (const p of system.planets) {
      planetCount++;
      assert.ok(Number.isFinite(p.meanK) && p.meanK > 0);
      assert.ok(p.waterPercent >= 0 && p.waterPercent <= 100);
      assert.deepEqual(p.biomeFeatures, []); // No site evidence is fabricated.
      const b = BIOMES.find(b => b.name === p.biome);
      if (b) {
        assert.ok(p.meanK >= b.minTemp && p.meanK <= b.maxTemp, `${seed}: ${p.biome} at ${p.meanK} K`);
        assert.ok(p.waterPercent >= b.minWater);
      } else assert.equal(p.biomeTag, null);
      if (["gas-giant", "ice-giant"].includes(p.typeId) || p.atmosphere.pressure === 0) assert.equal(p.biomeTag, null);
    }
  }
  assert.ok(planetCount >= 3000);
  t.diagnostic(`Validated ${planetCount} planets across 1000 deterministic systems.`);
});

test("approved context features flow through actual system and planet generation without changing physical RNG streams", () => {
  const baseline = generateStarSystem("context-6");
  assert.equal(baseline.planets[1].biomeTag, "temperate-forests");
  const context = fixtureFor("zones of transition");
  const system = generateStarSystem("context-6", { siteContexts: { 2: context } });
  assert.deepEqual(system.planets[1].biomeFeatures.map(f => f.name), ["zones of transition"]);
  assert.ok(system.planets[1].biomeFeatures[0].notes.includes("Name the actual pair"));
  for (let i = 0; i < system.planets.length; i++) {
    const { biomeFeatures: before, ...physicalBefore } = baseline.planets[i];
    const { biomeFeatures: after, ...physicalAfter } = system.planets[i];
    assert.deepEqual(physicalAfter, physicalBefore);
    if (i !== 1) assert.deepEqual(after, before);
  }
  context.transition.adjoiningBiomes = ["temperate-forests"];
  const blocked = generateStarSystem("context-6", { siteContexts: { 2: context } });
  assert.deepEqual(blocked.planets[1].biomeFeatures, []);
});

test("the regional richness comparison is enforced through planet generation", () => {
  const c = fixtureFor("highest biodiversity");
  const system = generateStarSystem("context-6", { siteContexts: { 2: c } });
  assert.ok(system.planets[1].biomeFeatures.some(f => f.name === "highest biodiversity"));
  c.comparison.sites[1].value = 200;
  const blocked = generateStarSystem("context-6", { siteContexts: { 2: c } });
  assert.equal(blocked.planets[1].biomeFeatures.some(f => f.name === "highest biodiversity"), false);
});

test("site context cannot override the generated world's supported biome", () => {
  const wrongSite = fixtureFor("zones of transition", "grasslands");
  const system = generateStarSystem("context-6", { siteContexts: { 2: wrongSite } });
  assert.deepEqual(system.planets[1].biomeFeatures, []);
});
