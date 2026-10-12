# World Generator

A deterministic HTML/CSS/JavaScript generator for fictional star systems and worlds. Serve the repository over HTTP and open `index.html`, or use its ES modules directly.

## Validation

With Node.js 22 or newer, run `npm test`. No dependencies need installing. GitHub Actions runs the same suite on Node.js 22 and 24 for pushes and pull requests.

The tests cover star selection, supported biome bounds, 1,000 seeded systems and their automatic sites, and all 43 approved context features from the World-Generator Data spreadsheet. Each supported membership has positive and negative cases; additional tests check ecotones, regional species comparisons, compatible organisms, pollution media, source-note preservation, and browser rendering.

## Automatic local sites

Generate a system to get three named locations on each supported surface world. A location establishes its habitat, local terrain, and regional climate before the context rules select features. Adjacent compatible land habitats can establish an ecotone; suitable worlds can include inland freshwater or saline water, a marine basin, or a coastal inlet. The browser presents these locations in a separate Local sites section, with links from each planet and fully visible feature evidence and Notes.

Site generation has its own deterministic random streams and preserves the planets already produced by a seed. Try `context-6` for a forest–grassland boundary and marine site on Planet II. Use `generateStarSystem(seed, { automaticSites: false })` to disable the automatic layer. Unsupported surface worlds report a reason instead of receiving invented terrestrial locations.

## Biome context features

`data/biome-features.js` is a dated snapshot of the 43 approved context features, with exact visible Notes, cell-note history, source rows, and a checksum. `data/biome-feature-rules.js` defines executable conditions. Eligibility requires both a supported membership and the feature's actual site conditions.

The planetary model retains one reference biome. Automatic locations appear in each planet's `sites` array, and each site carries its context and selected features. This first layer models natural terrain and habitats; settlements, species communities, disease, pollution, and quantitative regional surveys require caller-supplied evidence. Callers can still provide established reference-site context through `generateStarSystem(seed, { siteContexts })`; those features remain in the existing `biomeFeatures` field and display with the planet. Feature randomness has its own seed stream.

This snapshot covers the 43 context entries; it is not an import of all 3,079 active spreadsheet features. The source spreadsheet remains the editing authority. See [the context contract](docs/biome-context.md) for examples and batch refresh instructions.
