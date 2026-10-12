import { BIOMES, BIOME_TAGS } from "../data/biomes.js";
import { BIOME_FEATURES } from "../data/biome-features.js";
import { deriveRng, hashString } from "./random.js";
import { selectBiomeFeatures } from "./biome-features.js";

const habitatKinds = {
  "Ice Sheet": "ice sheet", "Polar Desert": "polar desert", "Cold Desert": "polar desert",
  "Temperate Desert": "desert", "Boreal Forest": "forest", "Temperate Forest": "forest",
  "Temperate Grassland": "grassland", "Tropical Grassland": "savanna",
  "Tropical Forest": "forest", "Subtropical Dryland": "shrubland"
};
const terrainForms = {
  "broad shield regions": ["low hills", "bedrock plains"],
  "young mountain chains": ["ridges", "valleys"],
  "rift valleys": ["escarpments", "valley floors"],
  "deep ocean basins": ["island hills", "coastal plains"],
  "volcanic island arcs": ["volcanic slopes", "coastal plains"],
  "large impact basins": ["basin rims", "basin floors"],
  "fault-bounded plateaus": ["plateau edges", "low plains"],
  "extensive sedimentary plains": ["low plains", "shallow valleys"]
};
const ecotoneBiomes = ["temperate-forests", "grasslands", "shrublands"];
const climateFeatures = new Set(["temperate zone", "subtropical regions", "tropical areas", "tropical regions", "tropical zone"]);

function regionalClimate(p) {
  const seasonal = p.axialTilt >= 5;
  const zone = p.meanK >= 295 ? "tropical" : p.meanK >= 285 ? "subtropical" : p.meanK >= 270 ? "temperate" : "cold";
  return {
    zone, regionalContext: true,
    moderateSeasonality: zone === "temperate" && seasonal && p.axialTilt <= 25,
    seasonalRainfall: zone === "subtropical" && seasonal && p.waterPercent >= 10,
    description: `${zone[0].toUpperCase() + zone.slice(1)} regional climate; reference temperature ${p.meanK} K${seasonal ? "; seasonal variation" : "; limited seasonal variation"}.`
  };
}

function featureEvidence(name, c) {
  if (name === "land masses") return `This site lies on a connected, grounded ${c.landMass.form}.`;
  if (name === "mix of landforms") return `The local terrain includes ${c.terrain.relief}.`;
  if (name === "zones of transition") return c.transition.description;
  if (name === "hazards") return `${c.hazard.name} threaten ${c.hazard.threatenedTarget}.`;
  if (name === "zones of high erosion") return `Active, intense ${c.erosion.process} erosion acts on ${c.erosion.substrate}.`;
  return c.climate.description;
}

function featuresFor(c, seed, index) {
  const candidates = selectBiomeFeatures(c, deriveRng(seed, "site-features", index, c.siteId), { limit: BIOME_FEATURES.length });
  let climateSelected = false;
  return candidates.filter(f => {
    if (!climateFeatures.has(f.name)) return true;
    if (climateSelected) return false;
    climateSelected = true;
    return true;
  }).slice(0, 3).map(({ name, notes }) => ({ name, notes, evidence: featureEvidence(name, c) }));
}

function waterSetting(p, rng) {
  // Conservative prototype bounds for an exposed liquid-water site, not a phase-equilibrium model.
  if (p.waterPercent <= 0 || p.meanK < 273 || p.meanK > 330 || p.atmosphere.pressure < 0.35) return null;
  if (p.hydrologyFeature === "salt lakes") return { name: "Inland Salt Lake", biome: "saline", salinity: "saline", location: "inland", kind: "inland water", body: "salt lake" };
  if (p.hydrologyFeature === "river networks") return { name: "Freshwater River", biome: "freshwater", salinity: "freshwater", location: "inland", kind: "inland water", body: "river" };
  if (["seasonal wetlands", "glacial reservoirs", "subsurface aquifers"].includes(p.hydrologyFeature)) {
    return { name: "Freshwater Lake", biome: "freshwater", salinity: "freshwater", location: "inland", kind: "inland water", body: "lake" };
  }
  if (p.hydrologyFeature === "closed inland basins") {
    const saline = rng.chance(0.5);
    return { name: saline ? "Inland Salt Lake" : "Freshwater Lake", biome: saline ? "saline" : "freshwater",
      salinity: saline ? "saline" : "freshwater", location: "inland", kind: "inland water", body: "closed-basin lake" };
  }
  if (p.hydrologyFeature === "deep ocean trenches" && p.waterPercent >= 15) {
    return { name: "Marine Basin", biome: "marine", salinity: "saline", location: "marine", kind: "marine water", body: "sea" };
  }
  if (p.waterPercent >= 15) return { name: "Coastal Inlet", biome: "coastal", salinity: "saline", location: "coastal", kind: "coastal", body: "inlet" };
  return { name: "Freshwater Lake", biome: "freshwater", salinity: "freshwater", location: "inland", kind: "inland water", body: "lake" };
}

export function generatePlanetSites(p, seed) {
  const unavailable = reason => ({ sites: [], reason });
  if (["gas-giant", "ice-giant"].includes(p.typeId)) return unavailable("This world has no modeled solid surface for local sites.");
  if (!(p.atmosphere?.pressure > 0)) return unavailable("Airless surface sites are outside the current biome model.");
  if (!(p.landPercent > 0)) return unavailable("This world has no modeled exposed land for a reference site.");
  const eligible = BIOMES.filter(b => p.meanK >= b.minTemp && p.meanK <= b.maxTemp && p.waterPercent >= b.minWater);
  const reference = eligible.find(b => b.name === p.biome && BIOME_TAGS[b.name] === p.biomeTag);
  if (!reference) return unavailable("The current catalog has no supported surface biome for these conditions.");

  const rng = deriveRng(seed, "sites", p.index);
  const prefix = `planet-${p.index}-${hashString(String(seed)).toString(36)}`;
  const region = { id: `${prefix}-region`, scope: "generated-region" };
  const climate = regionalClimate(p);
  const forms = terrainForms[p.geologyFeature] ?? ["low hills", "plains"];
  const island = p.geology === "Oceanic volcanic world" || p.geologyFeature === "volcanic island arcs" || p.waterPercent >= 75;
  const water = waterSetting(p, deriveRng(seed, "site-water", p.index));
  const sites = [];
  const landCount = water ? 2 : 3;

  for (let i = 0; i < landCount; i++) {
    const previous = sites.at(-1);
    const alternatives = eligible.filter(b => !sites.some(s => s.biomeTag === BIOME_TAGS[b.name]));
    const ecotones = alternatives.filter(b => ecotoneBiomes.includes(BIOME_TAGS[b.name]) && ecotoneBiomes.includes(previous?.biomeTag));
    const biome = i === 0 ? reference : rng.pick(ecotones.length ? ecotones : alternatives.length ? alternatives : eligible);
    const context = {
      siteId: `${prefix}-site-${i + 1}`, biome: BIOME_TAGS[biome.name],
      habitat: { medium: "land", kind: habitatKinds[biome.name] }, region: { ...region }, climate: { ...climate },
      landMass: { id: `${prefix}-landmass`, form: island ? "large island" : "continent", connected: true, grounded: true },
      terrain: { geology: p.geology, focus: forms[i % forms.length], relief: forms.join(" and "), landforms: forms.map(name => ({ name, siteCompatible: true })) }
    };
    const exposed = i === 1 && rng.chance(0.65);
    if (exposed) {
      context.terrain.focus = "exposed slopes";
      context.terrain.landforms.push({ name: "exposed slopes", siteCompatible: true });
      context.terrain.relief += ", with exposed slopes";
    }
    if (exposed && ["deserts", "shrublands", "grasslands", "taiga-forests", "temperate-forests", "tropical-forests"].includes(context.biome)) {
      context.erosion = { active: true, intense: true, process: context.biome === "deserts" ? "wind" : "slope",
        substrate: context.biome === "deserts" ? "exposed loose sediment" : "loose hillside soil", substrateCompatible: true };
    }
    if (exposed && ["deserts", "taiga-forests", "temperate-forests", "tropical-forests"].includes(context.biome)) {
      context.hazard = { name: "Unstable ground on an exposed slope", kind: "unstable ground",
        natural: true, threatenedTarget: "travelers", siteCompatible: true };
    }
    const locationName = context.terrain.focus.replace(/\b\w/g, letter => letter.toUpperCase());
    sites.push({ id: context.siteId, name: `${["Northern", "Central", "Southern"][i]} ${locationName}`,
      biome: biome.name, biomeTag: context.biome, context,
      summary: `${biome.name} on a ${context.landMass.form}, around ${context.terrain.focus}.` });
  }

  // A boundary is recorded only between two actual, compatible neighboring sites.
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];
    const neighbor = sites[i + 1] ?? sites[i - 1];
    if (neighbor && site.biomeTag !== neighbor.biomeTag && [site, neighbor].every(s => ecotoneBiomes.includes(s.biomeTag))) {
      site.context.transition = { adjoining: true, adjoiningSiteIds: [neighbor.id],
        adjoiningBiomes: [site.biomeTag, neighbor.biomeTag],
        description: `${site.biome} meets the adjoining ${neighbor.biome} at the boundary between ${site.name} and ${neighbor.name}.` };
    }
  }

  if (water) {
    const context = { siteId: `${prefix}-site-3`, biome: water.biome, region: { ...region }, climate: { ...climate },
      habitat: { medium: "water", kind: water.kind, location: water.location, salinity: water.salinity, body: water.body } };
    if (water.body === "river" && deriveRng(seed, "site-riverbank", p.index).chance(0.5)) {
      context.erosion = { active: true, intense: true, process: "flowing water", setting: "riverbank",
        substrate: "loose riverbank sediment", substrateCompatible: true };
    }
    sites.push({ id: context.siteId, name: water.name, biome: { marine: "Marine", coastal: "Coastal", freshwater: "Freshwater", saline: "Saline" }[water.biome],
      biomeTag: water.biome, context, summary: `A ${water.salinity} ${water.body} in a ${water.location} setting.` });
  }
  for (const site of sites) site.features = featuresFor(site.context, seed, p.index);
  return { sites, reason: null };
}
