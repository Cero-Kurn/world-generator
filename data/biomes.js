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
  const candidates = BIOMES.filter(b => meanK >= b.minTemp && meanK <= b.maxTemp && waterPercent >= b.minWater);
  return rng.pick(candidates.length ? candidates : [meanK < 250 ? BIOMES[1] : BIOMES[3]]);
}