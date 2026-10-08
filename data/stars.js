export const STAR_TYPES = [
  { id: "M", name: "Red Dwarf", mass: 0.20, radius: 0.25, luminosity: 0.008, temperature: 3200, weight: 42 },
  { id: "K", name: "Orange Dwarf", mass: 0.72, radius: 0.68, luminosity: 0.16, temperature: 4600, weight: 28 },
  { id: "G", name: "Yellow Dwarf", mass: 1.00, radius: 1.00, luminosity: 1.00, temperature: 5770, weight: 20 },
  { id: "F", name: "Yellow-White Star", mass: 1.35, radius: 1.30, luminosity: 3.5, temperature: 6500, weight: 7 },
  { id: "A", name: "White Star", mass: 2.00, radius: 1.75, luminosity: 18, temperature: 8500, weight: 3 }
];
export function selectStarType(rng) {
  return rng.weighted(STAR_TYPES.map(value => ({ value, weight: value.weight })));
}
