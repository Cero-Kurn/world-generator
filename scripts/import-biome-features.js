import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BIOME_FEATURE_RULES } from "../data/biome-feature-rules.js";

const spreadsheetId = "1YngH6v322joy0tMtMWW-BxSU7eDqc2zPAnTVun_8YJQ";
const tagNames = ["tundra", "marine", "geothermal", "atmosphere", "taiga forests", "temperate forests",
  "tropical forests", "shrublands", "grasslands", "wetlands", "alpine", "coastal", "deserts", "freshwater",
  "saline", "space", "subsurface", "savanna", "other"];
const cellText = cell => cell?.userEnteredValue?.stringValue ?? cell?.formattedValue ?? "";

export function parseBiomeSnapshot(input, capturedDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(capturedDate) ||
      !Number.isFinite(Date.parse(`${capturedDate}T00:00:00Z`)) ||
      new Date(`${capturedDate}T00:00:00Z`).toISOString().slice(0, 10) !== capturedDate) {
    throw new Error("Supply the snapshot's capture date in YYYY-MM-DD form.");
  }
  const snapshot = input.structuredContent ?? input;
  if (snapshot.spreadsheetId !== spreadsheetId) throw new Error("Snapshot is not from World-Generator Data.");
  const sheet = snapshot.sheets?.find(s => s.properties?.title === "Biomes");
  if (!sheet) throw new Error("Snapshot must include the Biomes sheet.");
  const header = sheet.data?.find(d => (d.startRow ?? 0) === 0 && (d.startColumn ?? 0) === 0)?.rowData?.[0]?.values;
  if (!header || cellText(header[0]) !== "Feature" || cellText(header[20]) !== "Notes") throw new Error("Expected A:U source columns.");
  const labels = header.slice(1, 20).map(cellText);
  const tags = labels.map(label => typeof label === "string" ? label.match(/[a-z].*/)?.[0] : null);
  if (tags.length !== tagNames.length || tags.some((tag, i) => tag !== tagNames[i])) throw new Error("Biome headers do not match the approved schema.");
  const required = new Set(Object.keys(BIOME_FEATURE_RULES));
  const records = new Map();
  for (const grid of sheet.data) {
    if ((grid.startColumn ?? 0) !== 0) throw new Error("Read the feature rows from column A.");
    for (const [i, row] of (grid.rowData ?? []).entries()) {
      const cells = row.values ?? [];
      const name = cellText(cells[0]);
      if (!required.has(name)) continue;
      if (records.has(name)) throw new Error(`Duplicate canonical feature: ${name}`);
      const biomes = [];
      labels.forEach((label, index) => {
        const value = cellText(cells[index + 1]);
        if (value && value !== label) throw new Error(`Unexpected membership value for ${name}: ${value}`);
        if (value) biomes.push(tags[index].replaceAll(" ", "-"));
      });
      const notes = cellText(cells[20]);
      if (!biomes.length || typeof notes !== "string" || !notes.includes("Supported occurrence:")) {
        throw new Error(`Missing supported membership or context Notes: ${name}`);
      }
      records.set(name, { name, biomes, notes, sourceRow: (grid.startRow ?? 0) + i + 1, sourceCellNote: cells[20]?.note ?? "" });
    }
  }
  const missing = [...required].filter(name => !records.has(name));
  if (missing.length) throw new Error(`Missing approved context features: ${missing.join(", ")}`);
  const features = [...records.values()].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  const source = { spreadsheetId, sheet: "Biomes", capturedDate, scope: `${features.length} approved context features`,
    snapshotSha256: createHash("sha256").update(JSON.stringify(features)).digest("hex") };
  return { source, features };
}

export function renderBiomeCatalog({ source, features }) {
  return `export const BIOME_FEATURE_SOURCE = ${JSON.stringify(source, null, 2)};\n\nexport const BIOME_FEATURES = ${JSON.stringify(features, null, 2)};\n`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [inputPath, outputPath, capturedDate] = process.argv.slice(2);
  if (!inputPath || !outputPath || !capturedDate) throw new Error("Usage: node scripts/import-biome-features.js snapshot.json data/biome-features.js YYYY-MM-DD");
  const catalog = parseBiomeSnapshot(JSON.parse(readFileSync(inputPath, "utf8")), capturedDate);
  mkdirSync(dirname(resolve(outputPath)), { recursive: true });
  writeFileSync(outputPath, renderBiomeCatalog(catalog));
  console.log(`Imported ${catalog.features.length} approved context features with visible Notes and cell-note history.`);
}
