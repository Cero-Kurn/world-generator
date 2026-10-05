import { deriveRng } from "./random.js";
import { selectStarType } from "../data/stars.js";
import { generatePlanet } from "./planet.js";

export function generateStarSystem(seed) {
  const rng = deriveRng(seed, "system");
  const star = selectStarType(rng);
  const planetCount = rng.int(3, 9);
  const planets = [];
  let orbit = rng.float(0.18, 0.45);

  for (let i = 1; i <= planetCount; i++) {
    orbit *= rng.float(1.45, 2.05);
    planets.push(generatePlanet({ systemSeed: seed, index: i, star, orbitAU: orbit }));
  }

  return {
    seed,
    name: generateSystemName(seed, rng),
    star: { type: star.name, spectralClass: star.id, mass: star.mass, radius: star.radius, luminosity: star.luminosity, temperatureK: star.temperature },
    planetCount,
    planets,
    habitableWorlds: planets.filter(p => p.habitable).map(p => p.index)
  };
}

function generateSystemName(seed, rng) {
  const source = seed.replace(/[^a-z0-9]/gi, "");
  const root = source.length >= 4 ? source.slice(0, 4) : "Aster";
  return root.charAt(0).toUpperCase() + root.slice(1).toLowerCase() + rng.pick(["is","ara","on","ea","ion","or","eus","a"]);
}