export const CLIMATES = {
  frozen: { name: "Frozen" }, cold: { name: "Cold" }, temperate: { name: "Temperate" },
  warm: { name: "Warm" }, tropical: { name: "Tropical" }, scorching: { name: "Scorching" }
};
export function classifyClimate(meanK, waterPercent) {
  if (meanK < 190) return CLIMATES.frozen;
  if (meanK < 255) return CLIMATES.cold;
  if (meanK < 295) return waterPercent > 45 ? CLIMATES.temperate : CLIMATES.warm;
  if (meanK < 340) return CLIMATES.tropical;
  return CLIMATES.scorching;
}