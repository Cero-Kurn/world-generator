import test from "node:test";
import assert from "node:assert/strict";
import { BIOME_FEATURES, BIOME_FEATURE_SOURCE } from "../data/biome-features.js";
import { BIOME_FEATURE_RULES } from "../data/biome-feature-rules.js";
import { evaluateBiomeFeature, selectBiomeFeatures } from "../js/biome-features.js";
import { createRng } from "../js/random.js";
import { fixtureFor, site } from "./context-fixtures.js";

const accepted = (name, context) => {
  const result = evaluateBiomeFeature(name, context);
  assert.equal(result.eligible, true, result.reasons.join("; "));
};
const blocked = (name, context) => assert.equal(evaluateBiomeFeature(name, context).eligible, false);

test("the approved snapshot has 43 unique features, notes, provenance, and executable rules", () => {
  assert.equal(BIOME_FEATURES.length, 43);
  assert.equal(new Set(BIOME_FEATURES.map(f => f.name)).size, 43);
  assert.deepEqual(Object.keys(BIOME_FEATURE_RULES).sort(), BIOME_FEATURES.map(f => f.name).sort());
  assert.equal(BIOME_FEATURE_SOURCE.sheet, "Biomes");
  for (const f of BIOME_FEATURES) {
    assert.ok(f.notes.includes("Supported occurrence:"), f.name);
    assert.ok(f.biomes.length > 0, f.name);
    assert.ok(Number.isInteger(f.sourceRow), f.name);
  }
});

for (const feature of BIOME_FEATURES) {
  test(`${feature.name}: supported settings accept complete evidence and block tag-only selection`, () => {
    for (const biome of feature.biomes) {
      accepted(feature.name, fixtureFor(feature.name, biome));
      blocked(feature.name, { biome });
      blocked(feature.name, site(biome));
    }
    const incompatible = fixtureFor(feature.name, feature.biomes[0]);
    incompatible.biome = "space";
    blocked(feature.name, incompatible);
    blocked(feature.name, null);
  });
}

test("ecotones require different supported communities that actually adjoin the current site", () => {
  const c = fixtureFor("zones of transition");
  accepted("zones of transition", c);
  for (const pair of [["temperate-forests"], ["temperate-forests", "temperate-forests"],
    ["temperate-forests", "marine"], ["grasslands", "shrublands"]]) {
    const bad = structuredClone(c); bad.transition.adjoiningBiomes = pair;
    blocked("zones of transition", bad);
  }
  c.transition.adjoining = false;
  blocked("zones of transition", c);
});

test("highest biodiversity needs at least two distinct comparable sites in the generated region", () => {
  const c = fixtureFor("highest biodiversity");
  accepted("highest biodiversity", c);
  const mutations = [
    x => x.comparison.sites.pop(),
    x => x.comparison.sites[1].siteId = x.siteId,
    x => x.comparison.sites[1].value = 200,
    x => x.comparison.sites[1].biome = "tropical-forests",
    x => x.comparison.sites[1].regionId = "other-region",
    x => x.comparison.sites[1].taxon = "birds",
    x => x.comparison.sites[1].area = 2,
    x => x.comparison.sites[1].areaUnit = "acre",
    x => x.comparison.sites[1].samplingBasis = "different method",
    x => x.comparison.sites[1].valueUnit = "individuals",
    x => x.region.scope = "Earth-global",
    x => x.comparison.sites[0].siteId = "somewhere-else",
    x => x.comparison.sites[0].value = NaN,
    x => x.comparison.sites[0].value = Infinity,
    x => x.comparison.sites[0].value = -1,
    x => x.comparison.sites[1].siteId = 42,
    x => x.comparison.sites.forEach(s => s.value = 0)
  ];
  for (const mutate of mutations) {
    const bad = structuredClone(c); mutate(bad);
    blocked("highest biodiversity", bad);
  }
});

test("high biodiversity uses a specified substantial comparison, rather than the biome label", () => {
  const c = fixtureFor("high biodiversity");
  accepted("high biodiversity", c);
  delete c.comparison.minimumHighRatio;
  blocked("high biodiversity", c);
  c.comparison.minimumHighRatio = 2;
  c.comparison.sites[0].value = 21;
  blocked("high biodiversity", c);
});

test("living biomass cannot be substituted with species counts or animal mass", () => {
  const c = fixtureFor("high biomass");
  accepted("high biomass", c);
  c.comparison.metric = "species-richness";
  blocked("high biomass", c);
  c.comparison.metric = "standing-living-biomass";
  c.comparison.taxon = "animals";
  blocked("high biomass", c);
  c.comparison.taxon = "resident vegetation";
  c.comparison.sites.forEach(s => s.valueUnit = "species");
  blocked("high biomass", c);
  c.comparison.sites.forEach(s => s.valueUnit = "kg");
  c.vegetation.dense = false;
  blocked("high biomass", c);
});

test("endemism requires many distinct resident taxa with restricted ranges, beyond isolation", () => {
  const c = fixtureFor("high endemism");
  accepted("high endemism", c);
  for (const mutate of [x => x.endemism.taxa = [], x => x.endemism.taxa[1].rangeRegionIds.push("other-region"),
    x => x.endemism.taxa[1].resident = false, x => x.endemism.taxa[1].name = " PLANT A ",
    x => delete x.endemism.minimumRestrictedTaxa, x => x.endemism.referenceRegionId = "Earth"]) {
    const bad = structuredClone(c); mutate(bad); blocked("high endemism", bad);
  }
});

test("host impairment and a compatible cause distinguish disease from a vector's presence", () => {
  const c = fixtureFor("disease");
  accepted("disease", c);
  c.host.impaired = false; blocked("disease", c);
  c.host.impaired = true;
  c.disease = { kind: "infectious", vector: "mosquito", hostCompatible: true };
  blocked("disease", c);
  c.disease.vectorTransmissionConfirmed = true;
  accepted("disease", c);
  c.disease = { kind: "noninfectious", environmentalStress: "local toxic exposure", hostCompatible: true };
  accepted("disease", c);
  c.disease.hostCompatible = false; blocked("disease", c);
});

test("an introduced organism needs establishment, habitat compatibility, and disruption", () => {
  const c = fixtureFor("invasive species");
  for (const field of ["established", "habitatCompatible", "disruptiveEffect"]) {
    const bad = structuredClone(c); delete bad.organism[field]; blocked("invasive species", bad);
  }
});

test("introduced organisms can alter ecosystems without automatically becoming invasive", () => {
  const c = fixtureFor("altered ecosystems");
  delete c.human;
  c.organism = { species: "introduced ecosystem engineer", introduced: true, established: true, habitatCompatible: true };
  c.alteration.introducedOrganismCause = true;
  accepted("altered ecosystems", c);
  blocked("invasive species", c);
});

test("fragmentation requires affected resident organisms compatible with the habitat", () => {
  const c = fixtureFor("habitat fragmentation");
  c.fragmentation.organismsResident = false;
  blocked("habitat fragmentation", c);
  c.fragmentation.organismsResident = true;
  c.fragmentation.organismsHabitatCompatible = false;
  blocked("habitat fragmentation", c);
});

test("plant and predator selections require compatibility with the actual site", () => {
  for (const name of ["crops", "ornamental plants", "street trees"]) {
    const c = fixtureFor(name); c.plant.waterCompatible = false; blocked(name, c);
  }
  const c = fixtureFor("urban predators"); delete c.animal.prey; blocked("urban predators", c);
});

test("pollutants stay in their receiving medium, water context, and actual exposure route", () => {
  const c = fixtureFor("pollution", "freshwater");
  c.habitat.salinity = "saline"; blocked("pollution", c);
  const ocean = fixtureFor("pollution", "marine");
  ocean.habitat.location = "inland"; blocked("pollution", ocean);
  const air = fixtureFor("pollution", "atmosphere");
  air.pollutant.airborne = false; blocked("pollution", air);
  const wrongMedium = fixtureFor("pollution");
  wrongMedium.pollutant.receivingMedium = "water"; blocked("pollution", wrongMedium);
  const aquifer = fixtureFor("pesticides", "subsurface");
  aquifer.pollutant.route = "spray drift"; blocked("pesticides", aquifer);
  const saline = fixtureFor("pollution", "saline");
  blocked("pollution", saline); // Unassigned membership is not automatically added.
  const coast = fixtureFor("pollution", "coastal");
  delete coast.habitat.salinity; blocked("pollution", coast);
  const spill = fixtureFor("toxic spills");
  spill.pollutant.discreteRelease = false; blocked("toxic spills", spill);
});

test("regional climate does not invent forest cover, water salinity, or wetland saturation", () => {
  for (const name of ["tropical areas", "tropical regions", "tropical zone", "subtropical regions", "temperate zone"]) {
    const c = fixtureFor(name, "coastal"); delete c.habitat; blocked(name, c);
  }
  const wetland = fixtureFor("tropical areas", "wetlands");
  wetland.habitat.saturated = false; blocked("tropical areas", wetland);
  const forest = fixtureFor("tropical areas", "tropical-forests");
  forest.habitat.kind = "grassland"; blocked("tropical areas", forest);
});

test("terrain needs compatible distinct forms, materials, mechanisms, and active processes", () => {
  const forms = fixtureFor("mix of landforms");
  forms.terrain.landforms[1].name = "HILLS"; blocked("mix of landforms", forms);
  const sinking = fixtureFor("subsidence zones");
  sinking.subsidence.material = "organic soil"; blocked("subsidence zones", sinking);
  const underground = fixtureFor("subsidence zones", "subsurface");
  blocked("subsidence zones", underground);
  const erosion = fixtureFor("zones of high erosion", "deserts");
  erosion.erosion.process = "wave"; blocked("zones of high erosion", erosion);
  const meteor = fixtureFor("environmental disturbance zones");
  meteor.disturbance.kind = "meteor impact"; blocked("environmental disturbance zones", meteor);
  const seabed = fixtureFor("land masses", "coastal");
  seabed.habitat.medium = "water"; blocked("land masses", seabed);
  const floatingIce = fixtureFor("land masses", "tundra");
  floatingIce.landMass.grounded = false; blocked("land masses", floatingIce);
});

test("habitat and soil loss require a local reference and an actual decrease", () => {
  const loss = fixtureFor("minimal natural habitat");
  loss.habitatLoss.remainingArea = 100; blocked("minimal natural habitat", loss);
  loss.habitatLoss.remainingArea = 50; blocked("minimal natural habitat", loss);
  const soil = fixtureFor("soil depletion");
  soil.soil.currentNutrients = soil.soil.referenceNutrients; blocked("soil depletion", soil);
  soil.soil.currentNutrients = 1; soil.soil.lossMechanism = "naturally poor soil"; blocked("soil depletion", soil);
});

test("feature sampling is deterministic, unique, bounded, and refuses unknown or incomplete context", () => {
  const c = fixtureFor("zones of transition");
  const a = selectBiomeFeatures(c, createRng("features"));
  const b = selectBiomeFeatures(c, createRng("features"));
  assert.deepEqual(a, b);
  assert.deepEqual(a.map(f => f.name), ["zones of transition"]);
  assert.equal(new Set(a.map(f => f.name)).size, a.length);
  assert.deepEqual(selectBiomeFeatures(c, createRng("features"), { limit: 0 }), []);
  assert.deepEqual(selectBiomeFeatures(null, createRng("features")), []);
  assert.throws(() => selectBiomeFeatures(c, createRng("features"), { limit: 1.5 }), RangeError);
  blocked("unregistered feature", c);
});
