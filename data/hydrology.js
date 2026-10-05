export function classifyHydrology(waterPercent, temperatureK) {
  if (waterPercent < 2) return "arid surface hydrology";
  if (temperatureK < 210) return "ice-dominated hydrology";
  if (waterPercent < 15) return "limited seas and seasonal drainage";
  if (waterPercent < 45) return "mixed oceans, lakes, and river systems";
  if (waterPercent < 75) return "ocean-dominated hydrology";
  return "water-rich global ocean system";
}
export const HYDRO_FEATURES = [
  "river networks", "closed inland basins", "seasonal wetlands", "glacial reservoirs",
  "deep ocean trenches", "salt lakes", "coastal shelves", "subsurface aquifers"
];