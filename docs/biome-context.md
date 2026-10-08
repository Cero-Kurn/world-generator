# Biome context contract

The source is [World-Generator Data](https://docs.google.com/spreadsheets/d/1YngH6v322joy0tMtMWW-BxSU7eDqc2zPAnTVun_8YJQ/edit), specifically the 43 context features marked Applied in Biomes Review on October 8, 2026. Blank memberships mean unassigned settings. The generator selects from supported settings and does not infer additional memberships.

## Selection API

```js
import { generateStarSystem } from "../js/star-system.js";

const context = {
  siteId: "forest-edge-1",
  biome: "temperate-forests",
  habitat: { medium: "land", kind: "forest" },
  transition: {
    adjoining: true,
    adjoiningBiomes: ["temperate-forests", "grasslands"],
    description: "Woodland gives way to an adjoining grassland."
  }
};

// This deterministic seed has a temperate forest reference biome on Planet II.
const system = generateStarSystem("context-6", { siteContexts: { 2: context } });
console.log(system.planets[1].biomeFeatures);
```

`siteContexts` uses planet indices starting at 1. The supplied site's biome must match that planet's reference biome. Context never overrides its physical biome eligibility. Selected features contain `name` and the source's full `notes`. The renderer displays these notes in visible paragraphs.

Use `evaluateBiomeFeature(name, context)` from `js/biome-features.js` to get eligibility and reasons, or `selectBiomeFeatures(context, rng, { limit: 3 })` for direct site-level selection. The site selector supports aquatic and atmospheric contexts even though the current planetary model only generates reference terrestrial biomes. It samples without replacement and never manufactures missing evidence.

The normal browser interface supplies no detailed site context yet, so these conditional features remain withheld there. A later site-generation layer can construct this evidence from settlements, habitat maps, communities, and regional comparisons.

## Evidence

Each context needs a nonempty `siteId`, an official biome tag ID, and a compatible `habitat`. Internal tag IDs replace spaces with hyphens; displayed official names remain in the source spreadsheet. Forests require `kind: "forest"` and `medium: "land"`; grasslands, shrublands, and savanna require their corresponding vegetation. Wetlands also require `saturated: true`. Water contexts require an actual `location` and `salinity` (`freshwater` or `saline`); marine and inland settings remain distinct.

The declarative rules specify all required fields. Evidence flags represent facts established by the site-generation layer or caller; this module validates their combination, rather than simulating diseases, human settlement, or ecological measurements. Unknown facts do not count as confirmed facts.

| Group | Required evidence |
| --- | --- |
| Human land use | Actual activity, occupation, structures, or land use in the site's terrestrial habitat; plants and predators also need compatibility. |
| Disease and invasion | A resident impaired host with a compatible pathogen, confirmed vector transmission, or environmental stress; or an introduced, established organism with a disruptive effect. |
| Ecotones | At least two distinct supported adjoining communities, including the site's selected biome, and a described boundary. |
| Biodiversity | Comparable species richness samples from the same forest type and generated region, with consistent taxon, area, units, and sampling. |
| Biomass | Standing living vegetation mass in g, kg, or tonnes, dense resident vegetation, and equal-area comparable communities. Species counts cannot substitute for mass. |
| Endemism | A bounded reference region, taxonomic group, and many distinct resident taxa whose ranges are restricted to that region. |
| Pollution | Identified substance, source, receiving medium, route, and harmful exposure; water location and salinity must fit. Pesticides and toxic spills require their specific additional conditions. |
| Climate | Regional climate and actual vegetation or water habitat together. Climate alone does not establish forest cover or salinity. |
| Terrain | Actual landforms, materials, mechanisms, or active erosive processes. Underground causes do not automatically make a surface feature subsurface. |

`high biodiversity` and `high biomass` require a caller-defined `comparison.minimumHighRatio > 1`. Endemism requires a caller-defined `endemism.minimumRestrictedTaxa >= 2`; reduced habitat requires `habitatLoss.maximumRemainingFraction` between 0 and 1. These express the caller's local criteria for “high,” “many,” and “minimal.” They are not universal ecological thresholds. `highest biodiversity` requires the site's richness to be greatest among at least two distinct comparable sites; tied greatest values qualify jointly. Its scope is the generated region.

For a richness comparison, use this shape:

```js
context.region = { id: "region-1", scope: "generated-region" };
context.comparison = {
  metric: "species-richness",
  taxon: "vascular plants",
  minimumHighRatio: 2,
  sites: [
    { siteId: context.siteId, regionId: "region-1", biome: "temperate-forests", taxon: "vascular plants",
      area: 1, areaUnit: "hectare", samplingBasis: "equal-effort survey", value: 100, valueUnit: "species" },
    { siteId: "forest-2", regionId: "region-1", biome: "temperate-forests", taxon: "vascular plants",
      area: 1, areaUnit: "hectare", samplingBasis: "equal-effort survey", value: 20, valueUnit: "species" }
  ]
};
```

The complete synthetic examples in `tests/context-fixtures.js` cover every imported feature and supported membership. They are test data, not automatically assigned world facts.

## Batch refresh

Read native CellData for `Biomes!A1:U1` and the complete current rows of the 43 features, including `formattedValue`, `userEnteredValue`, and `note`. A bounded full-sheet snapshot can also be used. Save that native read as `snapshot.json`, then run:

```sh
node scripts/import-biome-features.js snapshot.json data/biome-features.js 2026-10-08
npm test
```

Use the actual capture date. The importer validates the source sheet, official headers, memberships, context Notes, unique canonical features, and complete rule coverage. It preserves visible Notes and cell-note history, sorts features by canonical name for stable selection, and records source rows and a checksum. Read current rows afresh rather than reusing archived row coordinates. Review the resulting diff and commit it with any needed rule changes.

The catalog is a committed snapshot, not a live Sheets connection. Expanding beyond these 43 features requires a corresponding review of each feature's conditions before adding it to generation.
