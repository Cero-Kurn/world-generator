# World Generator

A deterministic HTML/CSS/JavaScript generator for fictional star systems and worlds. Serve the repository over HTTP and open `index.html`, or use its ES modules directly.

## Validation

With Node.js 22 or newer, run `npm test`. No dependencies need installing. GitHub Actions runs the same suite on Node.js 22 and 24 for pushes and pull requests.

The tests cover star selection, supported biome bounds, 1,000 seeded systems, and all 43 approved context features from the World-Generator Data spreadsheet. Each supported membership has positive and negative cases; additional tests check ecotones, regional species comparisons, compatible organisms, pollution media, and source-note preservation.

## Biome context features

`data/biome-features.js` is a dated snapshot of the 43 approved context features, with exact visible Notes, cell-note history, source rows, and a checksum. `data/biome-feature-rules.js` defines executable conditions. Eligibility requires both a supported membership and the feature's actual site conditions.

The existing planetary model chooses one reference biome. It does not yet generate settlements, resident organisms, regional surveys, or adjoining habitat maps. Missing evidence keeps conditional features unselected. Callers can provide established site context through `generateStarSystem(seed, { siteContexts })`; selected features and their notes then flow through planet generation and presentation. Feature randomness has its own seed stream.

This snapshot covers the 43 context entries; it is not an import of all 3,079 active spreadsheet features. The source spreadsheet remains the editing authority. See [the context contract](docs/biome-context.md) for examples and batch refresh instructions.
