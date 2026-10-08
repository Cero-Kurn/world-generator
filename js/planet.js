import { deriveRng } from "./random.js";
import { PLANET_TYPES } from "../data/planets.js";
import { classifyAtmosphere, atmosphereComposition } from "../data/atmospheres.js";
import { classifyClimate } from "../data/climates.js";
import { classifyHydrology, HYDRO_FEATURES } from "../data/hydrology.js";
import { GEOLOGIC_STATES, GEO_FEATURES } from "../data/geology.js";
import { selectBiome, BIOME_TAGS } from "../data/biomes.js";
import { selectBiomeFeatures } from "./biome-features.js";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;

export function generatePlanet({ systemSeed, index, star, orbitAU, siteContext }) {
  const rng = deriveRng(systemSeed, "planet", index);
  const type = rng.weighted(PLANET_TYPES.map(x => ({ value: x, weight: x.weight })));
  const mass = lerp(type.mass[0], type.mass[1], rng.next());
  const radius = lerp(type.radius[0], type.radius[1], rng.next());
  const density = lerp(type.density[0], type.density[1], rng.next());
  const gravity = +(mass / (radius * radius)).toFixed(2);

  const equilibriumK = 278 * Math.pow(star.luminosity, 0.25) / Math.sqrt(orbitAU);
  const greenhouse = rng.float(1.00, 1.22);
  const meanK = Math.round(equilibriumK * greenhouse);

  const volatileInventory = clamp(
    (type.id === "gas-giant" ? 1 : type.id === "ice-giant" ? 0.95 : gravity * 0.55) +
    rng.float(-0.2, 0.35), 0, 1
  );
  const atmosphere = classifyAtmosphere(gravity, meanK, volatileInventory);
  const composition = atmosphereComposition(rng, atmosphere, meanK);

  const terrestrial = !["gas-giant", "ice-giant"].includes(type.id);
  const waterPercent = terrestrial
    ? Math.round(clamp(rng.float(0, 100) * (meanK < 210 ? 0.25 : meanK > 340 ? 0.18 : 0.9) *
      (atmosphere.pressure === 0 ? 0.3 : 1), 0, 100)) : 0;
  const icePercent = terrestrial && meanK < 250 ? Math.round(clamp((250 - meanK) * 0.55, 0, 80)) : 0;
  const landPercent = terrestrial ? Math.max(0, 100 - waterPercent) : 0;

  const climate = classifyClimate(meanK, waterPercent);
  const hydrology = classifyHydrology(waterPercent, meanK);
  const geology = rng.pick(GEOLOGIC_STATES);
  const geologyFeature = rng.pick(GEO_FEATURES);
  const biome = terrestrial && atmosphere.pressure > 0
    ? selectBiome(meanK, waterPercent, rng) : { name: "No surface terrestrial biome" };
  const biomeTag = BIOME_TAGS[biome.name] ?? null;
  const biomeFeatures = siteContext?.biome === biomeTag && biomeTag !== null
    ? selectBiomeFeatures(siteContext, deriveRng(systemSeed, "biome-features", index)) : [];

  const rotationHours = +rng.float(8, 90).toFixed(1);
  const axialTilt = +rng.float(0, 42).toFixed(1);
  const orbitalPeriodDays = +(365.25 * Math.sqrt(Math.pow(orbitAU, 3) / star.mass)).toFixed(1);

  return {
    index,
    name: toRoman(index),
    type: type.name, typeId: type.id, orbitAU: +orbitAU.toFixed(3),
    mass: +mass.toFixed(3), radius: +radius.toFixed(3), density: +density.toFixed(2), gravity,
    rotationHours, axialTilt, orbitalPeriodDays, equilibriumK, meanK,
    waterPercent, icePercent, landPercent, atmosphere, composition, climate, hydrology,
    geology: geology.name, geologyFeature, biome: biome.name, biomeTag,
    biomeFeatures: biomeFeatures.map(({ name, notes }) => ({ name, notes })),
    habitable: ["Temperate Forest", "Temperate Grassland", "Tropical Forest", "Tropical Grassland", "Boreal Forest"].includes(biome.name),
    hydrologyFeature: rng.pick(HYDRO_FEATURES)
  };
}

function toRoman(n) {
  const vals = [[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  let out = "";
  for (const [v, s] of vals) while (n >= v) { out += s; n -= v; }
  return out;
}
