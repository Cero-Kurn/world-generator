export const BIOMES = [
  { name: "Ice Sheet", minTemp: -Infinity, maxTemp: 205, minWater: 0 },
  { name: "Polar Desert", minTemp: 190, maxTemp: 245, minWater: 0 },
  { name: "Cold Desert", minTemp: 220, maxTemp: 275, minWater: 0 },
  { name: "Temperate Desert", minTemp: 250, maxTemp: 315, minWater: 0 },
  { name: "Boreal Forest", minTemp: 240, maxTemp: 285, minWater: 25 },
  { name: "Temperate Grassland", minTemp: 260, maxTemp: 305, minWater: 10 },
  { name: "Temperate Forest", minTemp: 270, maxTemp: 310, minWater: 35 },
  { name: "Tropical Grassland", minTemp: 285, maxTemp: 325, minWater: 15 },
  { name: "Tropical Forest", minTemp: 292, maxTemp: 330, minWater: 45 },
  { name: "Subtropical Dryland", minTemp: 285, maxTemp: 335, minWater: 5 }
];
export function selectBiome(meanK, waterPercent, rng) {
  if (!Number.isFinite(meanK) || meanK <= 0 || !Number.isFinite(waterPercent) || waterPercent < 0 || waterPercent > 100) {
    throw new RangeError("Biome selection requires a positive temperature and water coverage between 0 and 100.");
  }
  const candidates = BIOMES.filter(b => meanK >= b.minTemp && meanK <= b.maxTemp && waterPercent >= b.minWater);
  return candidates.length ? rng.pick(candidates) : { name: "No supported surface biome" };
}

// The source sheet's official vegetation definitions distinguish savanna from grasslands.
export const BIOME_TAGS = {
  "Ice Sheet": "tundra", "Polar Desert": "tundra", "Cold Desert": "tundra",
  "Temperate Desert": "deserts", "Boreal Forest": "taiga-forests",
  "Temperate Grassland": "grasslands", "Temperate Forest": "temperate-forests",
  "Tropical Grassland": "savanna", "Tropical Forest": "tropical-forests",
  "Subtropical Dryland": "shrublands"
};
