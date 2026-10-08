const habitats = {
  "temperate-forests": { medium: "land", kind: "forest" },
  "tropical-forests": { medium: "land", kind: "forest" },
  "taiga-forests": { medium: "land", kind: "forest" },
  grasslands: { medium: "land", kind: "grassland" },
  shrublands: { medium: "land", kind: "shrubland" },
  savanna: { medium: "land", kind: "savanna" },
  deserts: { medium: "land", kind: "desert" },
  tundra: { medium: "land", kind: "tundra" },
  alpine: { medium: "land", kind: "alpine" },
  wetlands: { medium: "land", kind: "wetland", saturated: true },
  coastal: { medium: "water", kind: "coastal", location: "coastal", salinity: "saline" },
  marine: { medium: "water", kind: "marine water", location: "marine", salinity: "saline" },
  freshwater: { medium: "water", kind: "inland water", location: "inland", salinity: "freshwater" },
  atmosphere: { medium: "air", kind: "air" },
  subsurface: { medium: "water", kind: "aquifer", location: "underground", salinity: "freshwater" },
  saline: { medium: "water", kind: "inland water", location: "inland", salinity: "saline" }
};

export function site(biome = "temperate-forests") {
  return { siteId: "site-A", biome, habitat: structuredClone(habitats[biome]),
    region: { id: "region-1", scope: "generated-region" }, climate: { description: "Seasonal regional climate" } };
}

export function comparison(context, metric = "species-richness") {
  const biomass = metric === "standing-living-biomass";
  const taxon = biomass ? "resident vegetation" : "vascular plants";
  const valueUnit = biomass ? "kg" : "species";
  const shared = { regionId: context.region.id, biome: context.biome, taxon,
    area: 1, areaUnit: "hectare", samplingBasis: "equal-effort standing community survey", valueUnit };
  return { metric, taxon, minimumHighRatio: 2, sites: [
    { ...shared, siteId: context.siteId, value: biomass ? 10000 : 100 },
    { ...shared, siteId: "site-B", value: biomass ? 2000 : 20 }
  ] };
}

export function fixtureFor(name, biome = "temperate-forests") {
  const c = site(biome);
  const human = { activity: "Building and managing a terrestrial settlement", landUse: "cultivation",
    feature: "irrigated field", substantialModification: true, sustainedLandUse: true,
    ecosystemEffect: "Resident vegetation replaced along a transport corridor", alteration: "soil leveling",
    alterationTarget: "soil", facility: "large processing facility", largeInfrastructure: true,
    occupied: true, dominantOccupation: true, equipment: "operating earthmover",
    structures: ["houses", "streets"], street: "settlement avenue", urbanFringe: true,
    remainingVegetation: "managed and remnant woodland", structure: "communications tower",
    tallStructure: true, purpose: "communications", corridor: "terrestrial road", vehicles: ["trucks"],
    noiseEffect: "vehicle noise affects resident animals", denseSettlement: true, urbanTerritory: "settlement district" };
  const plant = { species: "compatible resident cultivar", climateCompatible: true, soilCompatible: true,
    waterCompatible: true, cultivated: true, cultivationCompatible: true, purpose: "aesthetic",
    tree: true, planted: true, rootingCompatible: true, maintenanceCompatible: true };
  const humanFeatures = ["altered ecosystems", "anthrome", "anthropogenic", "anthropogenic influence",
    "anthropogenic modification", "crops", "heavy infrastructure", "human areas", "industrial", "machinery",
    "ornamental plants", "residential zones", "street trees", "suburban", "towers", "traffic", "urban areas", "urban predators"];
  if (humanFeatures.includes(name)) {
    c.human = human;
    c.plant = plant;
    c.alteration = { significant: true, ecosystemEffect: "Resident ecosystem reshaped by cultivation" };
    c.animal = { species: "compatible terrestrial predator", habitatCompatible: true,
      prey: "resident small animals", shelter: "vegetated structures", movementRoutes: "connected corridors" };
    if (name === "industrial") c.human.landUse = "manufacturing";
    if (["residential zones", "suburban"].includes(name)) c.human.landUse = "residential";
    if (name === "urban areas") c.human.landUse = "urban";
  }
  if (name === "disease") {
    c.host = { species: "resident tree", resident: true, habitatCompatible: true, impaired: true };
    c.disease = { kind: "infectious", pathogen: "compatible fungal pathogen", hostCompatible: true };
  }
  if (name === "habitat fragmentation") c.fragmentation = { formerlyContinuous: true,
    barrier: "new road", isolatedPatches: true, patchCount: 3, affectedOrganisms: ["resident mammals"], movementAffected: true,
    organismsResident: true, organismsHabitatCompatible: true };
  if (["high biodiversity", "highest biodiversity"].includes(name)) c.comparison = comparison(c);
  if (name === "high biomass") {
    c.vegetation = { dense: true, resident: true };
    c.comparison = comparison(c, "standing-living-biomass");
  }
  if (name === "high endemism") c.endemism = { referenceRegionId: c.region.id,
    taxon: "vascular plants", isolated: true, minimumRestrictedTaxa: 3,
    taxa: ["plant A", "plant B", "plant C"].map(name => ({ name, taxon: "vascular plants", resident: true, rangeRegionIds: [c.region.id] })) };
  if (name === "invasive species") c.organism = { species: "introduced grass", introduced: true,
    established: true, habitatCompatible: true, disruptiveEffect: "Displaces resident ground vegetation" };
  if (name === "minimal natural habitat") c.habitatLoss = { cause: "urban expansion",
    reference: "earlier mapped extent", referenceSiteId: c.siteId, areaUnit: "hectare",
    referenceArea: 100, remainingArea: 5, maximumRemainingFraction: 0.1 };
  if (name === "soil depletion") c.soil = { lossMechanism: "harvesting", nutrient: "available nitrogen",
    reference: "earlier local soil survey", referenceSiteId: c.siteId, unit: "mg per kg", currentNutrients: 10, referenceNutrients: 50 };
  if (name === "hazards") c.hazard = { name: "unstable ground", kind: biome.includes("forests") ? "falling branches" : "unstable ground",
    natural: true, threatenedTarget: "travelers", siteCompatible: true };
  if (name === "environmental disturbance zones") c.disturbance = { agent: "local disturbance process",
    effect: "resident habitat disrupted", siteCompatible: true,
    kind: biome.includes("forests") ? "forest structure" : ["shrublands", "wetlands"].includes(biome) ? "habitat disruption" :
      biome === "freshwater" ? "riverbank disturbance" : "erosion" };
  if (name === "land masses") {
    if (biome === "coastal") c.habitat.medium = "land";
    c.landMass = { form: "continent", connected: true, grounded: true };
    c.terrain = { geology: "continental bedrock", relief: "hills and valleys" };
  }
  if (name === "mix of landforms") c.terrain = { geology: "continental bedrock", relief: "hills and valleys", landforms: [
    { name: "hills", siteCompatible: true }, { name: "valleys", siteCompatible: true }
  ] };
  if (name === "subsidence zones") {
    c.subsidence = { active: true, surfaceLowering: true, material: "soluble bedrock", mechanism: "dissolution" };
    if (biome === "wetlands") Object.assign(c.subsidence, { material: "organic soil", mechanism: "drainage" });
    if (biome === "grasslands") {
      c.human = { landUse: "cultivation" };
      Object.assign(c.subsidence, { material: "compressible aquifer sediment", mechanism: "groundwater withdrawal" });
    }
  }
  if (name === "zones of high erosion") c.erosion = { active: true, intense: true, substrate: "erodible local sediment",
    substrateCompatible: true, process: biome === "coastal" ? "wave" : biome === "freshwater" ? "flowing water" : "wind",
    setting: biome === "freshwater" ? "riverbank" : "surface" };
  if (name === "zones of transition") c.transition = { adjoining: true, description: "An actual boundary between vegetation communities",
    adjoiningBiomes: [biome, biome === "grasslands" ? "temperate-forests" : "grasslands"] };
  if (["pesticides", "polluted areas", "pollution", "toxic spills"].includes(name)) {
    c.pollutant = { substance: name === "pesticides" ? "specified insecticide" : "toxic contaminant", source: "identified release",
      route: biome === "atmosphere" ? "spray drift" : biome === "subsurface" ? "leaching" :
        c.habitat.medium === "water" ? "runoff" : "application", receivingMedium: c.habitat.medium,
      affectedCommunity: "susceptible resident community", harmfulExposure: true, airborne: true,
      pesticide: true, susceptibleOrganisms: ["resident insects"], organismExposureCompatible: true, toxic: true, discreteRelease: true };
  }
  if (["temperate zone", "subtropical regions", "tropical areas", "tropical regions", "tropical zone"].includes(name)) {
    Object.assign(c.climate, { zone: name === "temperate zone" ? "temperate" : name === "subtropical regions" ? "subtropical" : "tropical",
      regionalContext: true, moderateSeasonality: true, mildWinters: true, seasonalRainfall: true });
  }
  return c;
}
