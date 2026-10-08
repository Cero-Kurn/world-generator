import { generateStarSystem } from "./star-system.js";
import { randomSeed } from "./random.js";

const output = document.querySelector("#output");
const seedInput = document.querySelector("#seedInput");
const generateButton = document.querySelector("#generateButton");
const randomButton = document.querySelector("#randomButton");

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function stat(label, value) {
  return `<div class="stat"><span class="label">${esc(label)}</span><strong>${esc(value)}</strong></div>`;
}

function row(label, value) {
  return `<div class="data-row"><span>${esc(label)}</span><span>${esc(value)}</span></div>`;
}

function render(system) {
  const habitable = system.habitableWorlds.length
    ? system.habitableWorlds.map(i => `Planet ${i}`).join(", ")
    : "None identified";

  output.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">SYSTEM REFERENCE</p>
          <h2>${esc(system.name)}</h2>
          <p>Deterministic seed: <strong>${esc(system.seed)}</strong></p>
        </div>
      </div>
      <div class="stats">
        ${stat("Primary", system.star.type)}
        ${stat("Spectral class", system.star.spectralClass)}
        ${stat("Mass", system.star.mass + " M☉")}
        ${stat("Luminosity", system.star.luminosity + " L☉")}
        ${stat("Temperature", system.star.temperatureK + " K")}
        ${stat("Planets", system.planetCount)}
      </div>
      <div class="callout"><strong>Potentially habitable:</strong> ${esc(habitable)}</div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">ORBITAL ARCHITECTURE</p>
          <h2>Planetary System</h2>
          <p>Planetary properties are derived from the star, orbit, and physical type rather than independently randomized.</p>
        </div>
      </div>
      <div class="planet-list">${system.planets.map(renderPlanet).join("")}</div>
    </section>
  `;
}

export function renderPlanet(p) {
  return `
    <article class="planet ${p.habitable ? "habitable" : ""}">
      <div class="planet-title">
        <div>
          <h3>Planet ${esc(p.name)}</h3>
          <span class="badge">${esc(p.type)}</span>
          ${p.habitable ? '<span class="badge good">Potentially habitable</span>' : ""}
        </div>
        <span class="badge">#${p.index}</span>
      </div>
      <div class="data-list">
        ${row("Orbit", p.orbitAU + " AU")}
        ${row("Mass", p.mass + " M⊕")}
        ${row("Radius", p.radius + " R⊕")}
        ${row("Gravity", p.gravity + " g")}
        ${row("Density", p.density + " g/cm³")}
        ${row("Rotation", p.rotationHours + " h")}
        ${row("Axial tilt", p.axialTilt + "°")}
        ${row("Orbital period", p.orbitalPeriodDays + " days")}
        ${row("Mean temperature", p.meanK + " K")}
        ${row("Climate", p.climate.name)}
        ${row("Atmosphere", p.atmosphere.name)}
        ${row("Pressure", p.atmosphere.pressure + " atm")}
        ${row("Water", p.waterPercent + "%")}
        ${row("Ice", p.icePercent + "%")}
        ${row("Land", p.landPercent + "%")}
        ${row("Hydrology", p.hydrology)}
        ${row("Geology", p.geology)}
        ${row("Major geological feature", p.geologyFeature)}
        ${row("Biome", p.biome)}
        ${row("Hydrologic feature", p.hydrologyFeature)}
      </div>
      <div class="callout"><strong>Atmospheric composition:</strong> ${p.composition.map(g => `${esc(g.gas)} ${esc(g.percent)}%`).join(" · ")}</div>
      ${p.biomeFeatures.length ? `<div class="biome-features"><h4>Contextual features</h4>${p.biomeFeatures.map(f =>
        `<div class="biome-feature"><strong>${esc(f.name)}</strong><p class="feature-notes">${esc(f.notes)}</p></div>`).join("")}</div>` : ""}
    </article>
  `;
}

function run() {
  const seed = seedInput.value.trim() || "Canopus-01";
  try {
    render(generateStarSystem(seed));
  } catch (error) {
    output.innerHTML = `<section class="panel error"><strong>Generation error:</strong> ${esc(error.message)}</section>`;
    console.error(error);
  }
}

generateButton.addEventListener("click", run);
randomButton.addEventListener("click", () => {
  seedInput.value = randomSeed();
  run();
});
seedInput.addEventListener("keydown", event => {
  if (event.key === "Enter") run();
});

run();
