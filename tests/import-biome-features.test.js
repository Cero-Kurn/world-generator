import test from "node:test";
import assert from "node:assert/strict";
import { BIOME_FEATURES, BIOME_FEATURE_SOURCE } from "../data/biome-features.js";
import { parseBiomeSnapshot, renderBiomeCatalog } from "../scripts/import-biome-features.js";

const labels = ["❄️ tundra", "🌊 marine", "🌋 geothermal", "🌤️ atmosphere", "🌲 taiga forests", "🌳 temperate forests",
  "🌴 tropical forests", "🌵 shrublands", "🌾 grasslands", "🌿 wetlands", "🏔️ alpine", "🏖️ coastal", "🏜️ deserts",
  "💧 freshwater", "💦 saline", "🔭 space", "🕳️ subsurface", "🦓 savanna", "✨ other"];
const cell = formattedValue => ({ formattedValue });
function snapshot() {
  return { spreadsheetId: BIOME_FEATURE_SOURCE.spreadsheetId, sheets: [{ properties: { title: "Biomes" }, data: [
    { rowData: [{ values: ["Feature", ...labels, "Notes"].map(cell) }] },
    ...BIOME_FEATURES.map(f => ({ startRow: f.sourceRow - 1, rowData: [{ values: [cell(f.name),
      ...labels.map(label => f.biomes.includes(label.match(/[a-z].*/)[0].replaceAll(" ", "-")) ? cell(label) : {}),
      { formattedValue: f.notes, note: f.sourceCellNote }] }] }))
  ] }] };
}

test("native-cell imports preserve memberships, multiline Notes, and merged-note history", async () => {
  const input = snapshot();
  const grid = input.sheets[0].data.find(g => g.rowData[0].values[0].formattedValue === "crops");
  grid.rowData[0].values[20].formattedValue += '\nAdditional note: "quotes", apostrophes, | and 🕳️.';
  const parsed = parseBiomeSnapshot(input, "2026-10-08");
  const loaded = await import(`data:text/javascript;base64,${Buffer.from(renderBiomeCatalog(parsed)).toString("base64")}`);
  const crops = loaded.BIOME_FEATURES.find(f => f.name === "crops");
  assert.equal(crops.notes, grid.rowData[0].values[20].formattedValue);
  assert.equal(crops.sourceCellNote, grid.rowData[0].values[20].note);
  assert.deepEqual(crops.biomes, ["temperate-forests", "grasslands"]);
  assert.equal(loaded.BIOME_FEATURES.length, 43);
  assert.match(loaded.BIOME_FEATURE_SOURCE.snapshotSha256, /^[a-f0-9]{64}$/);
});

test("imports refuse duplicated or missing canonical features", () => {
  const duplicate = snapshot();
  duplicate.sheets[0].data.push(structuredClone(duplicate.sheets[0].data[1]));
  assert.throws(() => parseBiomeSnapshot(duplicate, "2026-10-08"), /Duplicate canonical/);
  const missing = snapshot(); missing.sheets[0].data.pop();
  assert.throws(() => parseBiomeSnapshot(missing, "2026-10-08"), /Missing approved context/);
});

test("imports require the approved source schema, actual membership labels, and context Notes", () => {
  const wrong = snapshot(); wrong.spreadsheetId = "unrelated-sheet";
  assert.throws(() => parseBiomeSnapshot(wrong, "2026-10-08"), /not from World-Generator Data/);
  const tags = snapshot(); tags.sheets[0].data[0].rowData[0].values[15].formattedValue = "💦 saltwater";
  assert.throws(() => parseBiomeSnapshot(tags, "2026-10-08"), /headers/);
  const notes = snapshot(); notes.sheets[0].data[1].rowData[0].values[20].formattedValue = "";
  assert.throws(() => parseBiomeSnapshot(notes, "2026-10-08"), /Missing supported membership/);
});

test("imports are stable across range order and require an explicit capture date", () => {
  const original = snapshot();
  const reordered = snapshot(); reordered.sheets[0].data.reverse();
  assert.equal(renderBiomeCatalog(parseBiomeSnapshot(original, "2026-10-08")), renderBiomeCatalog(parseBiomeSnapshot(reordered, "2026-10-08")));
  assert.throws(() => parseBiomeSnapshot(original, "2026-99-08"), /capture date/);
});
