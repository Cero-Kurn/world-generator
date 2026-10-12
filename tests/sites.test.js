import test from "node:test";
import assert from "node:assert/strict";
import { BIOMES } from "../data/biomes.js";
import { BIOME_FEATURES } from "../data/biome-features.js";
import { evaluateBiomeFeature } from "../js/biome-features.js";
import { generateStarSystem } from "../js/star-system.js";
import { generatePlanetSites } from "../js/sites.js";

const prototype = overrides => ({ index: 2, typeId: "rocky", atmosphere: { pressure: 1 },
  meanK: 280, waterPercent: 45, landPercent: 55, axialTilt: 17,
  biome: "Temperate Forest", biomeTag: "temperate-forests", geology: "Ancient and stable",
  geologyFeature: "extensive sedimentary plains", hydrologyFeature: "river networks", ...overrides });

test("automatic sites are reproducible, independent of planet physics, and can be disabled", () => {
  for (const seed of ["Canopus-01", "context-6", "site-example-18"]) {
    const enabled = generateStarSystem(seed);
    const disabled = generateStarSystem(seed, { automaticSites: false });
    assert.deepEqual(enabled, generateStarSystem(seed));
    const physical = system => ({ ...system, planets: system.planets.map(({ sites, siteGenerationReason, ...p }) => p) });
    assert.deepEqual(physical(enabled), physical(disabled));
    assert.ok(enabled.planets.some(p => p.sites.length === 3));
    assert.ok(disabled.planets.every(p => p.sites.length === 0 && p.siteGenerationReason.includes("turned off")));
  }
});

test("unsupported, airless, giant, and fully submerged worlds have explicit reasons rather than terrestrial sites", () => {
  for (const overrides of [{ typeId: "gas-giant" }, { typeId: "ice-giant" }, { atmosphere: { pressure: 0 } },
    { landPercent: 0 }, { meanK: 700 }, { biomeTag: null }, { biome: "No supported surface biome" }]) {
    const result = generatePlanetSites(prototype(overrides), "no-sites");
    assert.deepEqual(result.sites, []);
    assert.ok(result.reason.length > 0);
  }
});

test("ecotones name actual adjoining generated habitats with compatible physical bounds", () => {
  const p = generateStarSystem("context-6").planets[1];
  assert.equal(p.sites[0].biome, p.biome);
  assert.equal(p.sites[1].biome, "Temperate Grassland");
  for (const site of p.sites.filter(s => s.context.transition)) {
    const transition = site.context.transition;
    const neighbor = p.sites.find(s => s.id === transition.adjoiningSiteIds[0]);
    assert.ok(neighbor);
    assert.notEqual(site.biomeTag, neighbor.biomeTag);
    assert.deepEqual(transition.adjoiningBiomes, [site.biomeTag, neighbor.biomeTag]);
    assert.equal(evaluateBiomeFeature("zones of transition", site.context).eligible, true);
    assert.ok(transition.description.includes(site.name) && transition.description.includes(neighbor.name));
    const incomplete = structuredClone(site.context);
    incomplete.transition.adjoiningBiomes = [site.biomeTag];
    assert.equal(evaluateBiomeFeature("zones of transition", incomplete).eligible, false);
  }
  assert.ok(p.sites.some(s => s.features.some(f => f.name === "zones of transition")));
});

test("water sites distinguish inland freshwater, inland saline, marine, and coastal habitats", () => {
  for (const [hydrologyFeature, biome, location, salinity, body] of [
    ["river networks", "freshwater", "inland", "freshwater", "river"],
    ["salt lakes", "saline", "inland", "saline", "salt lake"],
    ["deep ocean trenches", "marine", "marine", "saline", "sea"],
    ["coastal shelves", "coastal", "coastal", "saline", "inlet"]
  ]) {
    const result = generatePlanetSites(prototype({ meanK: 300, hydrologyFeature }), "water-settings");
    const water = result.sites.find(s => s.context.habitat.medium === "water");
    assert.ok(water);
    assert.equal(water.biomeTag, biome);
    assert.deepEqual(water.context.habitat, { medium: "water", kind: biome === "coastal" ? "coastal" : biome === "marine" ? "marine water" : "inland water",
      location, salinity, body });
    for (const feature of water.features) assert.equal(evaluateBiomeFeature(feature.name, water.context).eligible, true);
  }
  const marine = generatePlanetSites(prototype({ meanK: 300, hydrologyFeature: "deep ocean trenches" }), "water-settings").sites[2];
  marine.context.habitat.salinity = "freshwater";
  assert.equal(evaluateBiomeFeature("tropical areas", marine.context).eligible, false);
});

test("prototype liquid-water sites are withheld outside the exposed-water bounds", () => {
  for (const overrides of [{ meanK: 272 }, { atmosphere: { pressure: 0.03 } },
    { biome: "Temperate Desert", biomeTag: "deserts", waterPercent: 0 }]) {
    const { sites } = generatePlanetSites(prototype(overrides), "water-bounds");
    assert.equal(sites.length, 3);
    assert.ok(sites.every(s => s.context.habitat.medium === "land"));
  }
  const upper = generatePlanetSites(prototype({ meanK: 331, biome: "Subtropical Dryland", biomeTag: "shrublands" }), "water-bounds");
  assert.equal(upper.sites.length, 3);
  assert.ok(upper.sites.every(s => s.context.habitat.medium === "land"));
  assert.ok(generatePlanetSites(prototype({ meanK: 273 }), "water-bounds").sites.some(s => s.context.habitat.medium === "water"));
});

test("1000 systems select only eligible, source-backed site features and maintain distinct site identities", t => {
  const catalog = new Map(BIOME_FEATURES.map(f => [f.name, f]));
  const selected = new Set();
  const climateNames = new Set(["temperate zone", "subtropical regions", "tropical areas", "tropical regions", "tropical zone"]);
  let siteCount = 0;
  for (let i = 0; i < 1000; i++) {
    const system = generateStarSystem(`regression-${i}`);
    const ids = new Set();
    for (const p of system.planets) {
      if (!p.sites.length) { assert.ok(p.siteGenerationReason); continue; }
      assert.equal(p.sites.length, 3);
      assert.equal(p.sites[0].biome, p.biome);
      assert.equal(p.siteGenerationReason, null);
      for (const site of p.sites) {
        siteCount++;
        assert.equal(ids.has(site.id), false);
        ids.add(site.id);
        assert.equal(site.id, site.context.siteId);
        assert.equal(site.biomeTag, site.context.biome);
        if (site.context.habitat.medium === "land") {
          const biome = BIOMES.find(b => b.name === site.biome);
          assert.ok(biome);
          assert.ok(p.meanK >= biome.minTemp && p.meanK <= biome.maxTemp && p.waterPercent >= biome.minWater);
        } else {
          assert.ok(p.meanK >= 273 && p.meanK <= 330 && p.waterPercent > 0 && p.atmosphere.pressure >= 0.35);
        }
        assert.ok(site.features.length <= 3);
        assert.equal(new Set(site.features.map(f => f.name)).size, site.features.length);
        assert.ok(site.features.filter(f => climateNames.has(f.name)).length <= 1);
        for (const feature of site.features) {
          selected.add(feature.name);
          const result = evaluateBiomeFeature(feature.name, site.context);
          assert.equal(result.eligible, true, `${feature.name}: ${result.reasons.join("; ")}`);
          assert.equal(feature.notes, catalog.get(feature.name).notes);
          assert.ok(feature.evidence.length > 0);
        }
        for (const field of ["human", "plant", "animal", "host", "disease", "organism", "pollutant", "comparison", "endemism"]) {
          assert.equal(site.context[field], undefined);
        }
      }
    }
  }
  for (const name of ["land masses", "mix of landforms", "hazards", "zones of high erosion", "zones of transition", "temperate zone", "subtropical regions", "tropical areas"]) assert.ok(selected.has(name), name);
  t.diagnostic(`Validated ${siteCount} automatic sites across 1000 systems; ${selected.size} context feature types selected.`);
});
