import { BIOME_FEATURES } from "../data/biome-features.js";
import { BIOME_FEATURE_RULES } from "../data/biome-feature-rules.js";

const catalog = new Map(BIOME_FEATURES.map(feature => [feature.name, feature]));
const named = value => typeof value === "string" && value.trim().length > 0;
const number = value => typeof value === "number" && Number.isFinite(value) && value >= 0;
const textList = value => Array.isArray(value) && value.length > 0 && value.every(named);
const forests = ["taiga-forests", "temperate-forests", "tropical-forests"];
const landKinds = {
  "taiga-forests": ["forest"], "temperate-forests": ["forest"], "tropical-forests": ["forest"],
  grasslands: ["grassland"], shrublands: ["shrubland"], savanna: ["savanna"],
  deserts: ["desert"], tundra: ["tundra", "ice sheet", "polar desert"], alpine: ["alpine", "mountain"]
};

function validHabitat(c) {
  const h = c.habitat;
  if (!h || !named(c.siteId)) return false;
  if (h.medium === "water" && (!["freshwater", "saline"].includes(h.salinity) ||
      !["inland", "marine", "coastal", "underground"].includes(h.location))) return false;
  if (landKinds[c.biome]) return h.medium === "land" && landKinds[c.biome].includes(h.kind);
  if (c.biome === "wetlands") return ["land", "water"].includes(h.medium) && h.kind === "wetland" && h.saturated === true;
  if (c.biome === "coastal") return ["land", "water"].includes(h.medium) && h.kind === "coastal" && h.location === "coastal";
  if (c.biome === "freshwater") return h.medium === "water" && h.kind === "inland water" && h.location === "inland" && h.salinity === "freshwater";
  if (c.biome === "marine") return h.medium === "water" && h.kind === "marine water" && h.location === "marine" && h.salinity === "saline";
  if (c.biome === "saline") return h.medium === "water" && h.kind === "inland water" && h.location === "inland" && h.salinity === "saline";
  if (c.biome === "atmosphere") return h.medium === "air" && h.kind === "air";
  if (c.biome === "subsurface") return h.location === "underground" &&
    (h.kind === "aquifer" ? h.medium === "water" : h.medium === "land" && ["cave", "tunnel"].includes(h.kind));
  return false;
}

function comparableSites(c, metric) {
  const p = c.comparison;
  if (!p || c.region?.scope !== "generated-region" || !named(c.region.id) ||
      p.metric !== metric || !named(p.taxon) || !Array.isArray(p.sites) || p.sites.length < 2) return null;
  const sites = p.sites;
  if (!sites.every(s => s && named(s.siteId))) return null;
  const reference = sites[0];
  if (new Set(sites.map(s => s.siteId.trim())).size !== sites.length) return null;
  if (!sites.every(s => s && named(s.siteId) && s.regionId === c.region.id && s.biome === c.biome &&
      s.taxon === p.taxon && number(s.value) && number(s.area) && s.area > 0 &&
      s.area === reference.area && named(s.areaUnit) && s.areaUnit === reference.areaUnit &&
      named(s.samplingBasis) && s.samplingBasis === reference.samplingBasis &&
      named(s.valueUnit) && s.valueUnit === reference.valueUnit)) return null;
  if (metric === "species-richness" && !sites.every(s => Number.isInteger(s.value) && s.valueUnit === "species")) return null;
  if (metric === "standing-living-biomass" && (p.taxon !== "resident vegetation" ||
      !sites.every(s => ["g", "kg", "tonnes"].includes(s.valueUnit)))) return null;
  const own = sites.find(s => s.siteId.trim() === c.siteId.trim());
  if (!own) return null;
  return { own, others: sites.filter(s => s !== own), sites };
}

function highComparison(c, metric) {
  const p = comparableSites(c, metric);
  const ratio = c.comparison?.minimumHighRatio;
  if (!p || !number(ratio) || ratio <= 1) return false;
  const mean = p.others.reduce((total, s) => total + s.value, 0) / p.others.length;
  return p.own.value > mean && p.own.value >= mean * ratio;
}

const CHECKS = {
  terrestrial: c => c.habitat.medium === "land",
  fragmentation: c => Number.isInteger(c.fragmentation?.patchCount) && c.fragmentation.patchCount >= 2,
  "high-biodiversity": c => highComparison(c, "species-richness"),
  "highest-biodiversity": c => {
    const p = comparableSites(c, "species-richness");
    return Boolean(p && p.own.value > 0 && p.own.value >= Math.max(...p.sites.map(s => s.value)));
  },
  "high-biomass": c => highComparison(c, "standing-living-biomass"),
  endemism: c => {
    const e = c.endemism;
    if (!e || c.region?.scope !== "generated-region" || !named(c.region.id) ||
        e.referenceRegionId !== c.region.id || !named(e.taxon) || e.isolated !== true ||
        !Number.isInteger(e.minimumRestrictedTaxa) || e.minimumRestrictedTaxa < 2 || !Array.isArray(e.taxa)) return false;
    const restricted = e.taxa.filter(t => t && named(t.name) && t.taxon === e.taxon && t.resident === true &&
      Array.isArray(t.rangeRegionIds) && t.rangeRegionIds.length === 1 && t.rangeRegionIds[0] === e.referenceRegionId);
    return new Set(restricted.map(t => t.name.trim().toLowerCase())).size >= e.minimumRestrictedTaxa;
  },
  "habitat-loss": c => {
    const h = c.habitatLoss;
    return Boolean(h && named(h.reference) && h.referenceSiteId === c.siteId && named(h.areaUnit) &&
      number(h.referenceArea) && h.referenceArea > 0 && number(h.remainingArea) &&
      number(h.maximumRemainingFraction) && h.maximumRemainingFraction > 0 && h.maximumRemainingFraction < 1 &&
      h.remainingArea < h.referenceArea && h.remainingArea / h.referenceArea <= h.maximumRemainingFraction);
  },
  "soil-depletion": c => {
    const s = c.soil;
    return Boolean(s && s.referenceSiteId === c.siteId && number(s.currentNutrients) &&
      number(s.referenceNutrients) && s.currentNutrients < s.referenceNutrients);
  },
  hazard: c => c.hazard?.kind === "falling branches" ? forests.includes(c.biome) :
    ["unstable slope", "unstable ground", "dangerous relief"].includes(c.hazard?.kind) &&
    [...forests, "alpine", "deserts"].includes(c.biome),
  disturbance: c => {
    const kind = c.disturbance?.kind;
    if (forests.includes(c.biome)) return kind === "forest structure";
    if (["shrublands", "wetlands"].includes(c.biome)) return kind === "habitat disruption";
    if (["alpine", "coastal", "deserts"].includes(c.biome)) return kind === "erosion";
    return c.biome === "freshwater" && kind === "riverbank disturbance";
  },
  landforms: c => {
    const forms = c.terrain?.landforms;
    return Array.isArray(forms) && forms.length >= 2 && forms.every(f => f && named(f.name) && f.siteCompatible === true) &&
      new Set(forms.map(f => f.name.trim().toLowerCase())).size >= 2;
  },
  subsidence: c => {
    const s = c.subsidence;
    if (!s) return false;
    if (s.material === "soluble bedrock" && ["dissolution", "karst collapse"].includes(s.mechanism)) {
      return ["temperate-forests", "tropical-forests", "shrublands", "deserts"].includes(c.biome);
    }
    if (s.material === "compressible aquifer sediment" && s.mechanism === "groundwater withdrawal") {
      return (["temperate-forests", "grasslands"].includes(c.biome) && c.human?.landUse === "cultivation") ||
        (c.biome === "deserts" && s.aridBasin === true);
    }
    return c.biome === "wetlands" && s.material === "organic soil" && ["drainage", "oxidation", "compaction"].includes(s.mechanism);
  },
  erosion: c => {
    const e = c.erosion;
    if (e?.process === "wave") return c.biome === "coastal";
    if (c.biome === "freshwater") return ["flowing water", "slope"].includes(e?.process) && e.setting === "riverbank";
    return c.habitat.medium === "land" && ["wind", "flowing water", "slope"].includes(e?.process);
  },
  ecotone: c => {
    const biomes = c.transition?.adjoiningBiomes;
    return Array.isArray(biomes) && biomes.length >= 2 && new Set(biomes).size === biomes.length &&
      biomes.includes(c.biome) && biomes.every(b => ["temperate-forests", "shrublands", "grasslands"].includes(b));
  },
  "receiving-medium": c => c.pollutant?.receivingMedium === c.habitat.medium &&
    (c.habitat.medium !== "air" || c.pollutant.airborne === true),
  "pesticide-route": c => {
    const route = c.pollutant?.route;
    if (c.biome === "atmosphere") return ["spray drift", "dust drift"].includes(route);
    if (c.biome === "subsurface") return c.habitat.kind === "aquifer" && route === "leaching";
    if (c.biome === "freshwater") return ["runoff", "contaminated water"].includes(route);
    return c.habitat.medium === "land" && ["application", "soil contamination"].includes(route);
  }
};

function readPath(context, path) {
  return path.split(".").reduce((value, part) => value?.[part], context);
}

function evaluateCondition(rule, context) {
  if (rule.all) return rule.all.flatMap(condition => evaluateCondition(condition, context));
  if (rule.any) {
    const alternatives = rule.any.map(condition => evaluateCondition(condition, context));
    return alternatives.some(reasons => reasons.length === 0) ? [] :
      [`Need one supported alternative: ${alternatives.map(r => r.join("; ")).join(" OR ")}`];
  }
  if (rule.check) return CHECKS[rule.check]?.(context) ? [] : [`Context check required: ${rule.check}`];
  const value = readPath(context, rule.path);
  const passes = rule.type === "text" ? named(value) : rule.type === "true" ? value === true :
    rule.type === "text-list" ? textList(value) : rule.type === "enum" ? rule.values.includes(value) : false;
  return passes ? [] : [`Evidence required: ${rule.path} (${rule.type})`];
}

export function evaluateBiomeFeature(name, context = {}) {
  const feature = catalog.get(name);
  if (!feature) return { eligible: false, reasons: ["Feature is outside the approved context catalog."] };
  const rule = BIOME_FEATURE_RULES[name];
  if (!rule) return { eligible: false, reasons: ["No executable context rule is defined."] };
  if (!context || !feature.biomes.includes(context.biome)) return { eligible: false, reasons: ["No supported biome membership for this site."] };
  if (!validHabitat(context)) return { eligible: false, reasons: ["A compatible site and actual habitat are required."] };
  const reasons = evaluateCondition(rule, context);
  return { eligible: reasons.length === 0, reasons };
}

export function selectBiomeFeatures(context, rng, { limit = 3 } = {}) {
  if (!Number.isInteger(limit) || limit < 0) throw new RangeError("Feature limit must be a nonnegative integer.");
  const candidates = BIOME_FEATURES.filter(f => evaluateBiomeFeature(f.name, context).eligible);
  const selected = [];
  while (candidates.length && selected.length < limit) {
    const feature = rng.pick(candidates);
    selected.push(feature);
    candidates.splice(candidates.indexOf(feature), 1);
  }
  return selected;
}
