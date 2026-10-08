export const BIOME_FEATURE_SOURCE = {
  "spreadsheetId": "1YngH6v322joy0tMtMWW-BxSU7eDqc2zPAnTVun_8YJQ",
  "sheet": "Biomes",
  "capturedDate": "2026-10-08",
  "scope": "43 approved context features",
  "snapshotSha256": "7aa05b32d419fe4688b48b7795edeaa59645a41d5adfcd8c8e058c64fdd64b8e"
};

export const BIOME_FEATURES = [
  {
    "name": "altered ecosystems",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "ecosystems significantly reshaped by human activity or introduced species.\n\nSupported occurrence: Select a human modification or introduced organism that significantly alters the resident ecosystem. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 56,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\necosystems significantly reshaped by human activity or introduced species.\n\nOccurrence requirement: Occurrence depends on the affected habitat and the defined human alteration or introduced species. Retain as a condition of that habitat; human influence alone does not identify a biome. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "anthrome",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "human defined ecological regions shaped by sustained land use.\n\nSupported occurrence: Use an inhabited, cultivated, grazed, or otherwise persistently managed terrestrial region with sustained human land use. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 70,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nhuman defined ecological regions shaped by sustained land use.\n\nOccurrence requirement: Specify the land use and the underlying climate, vegetation, or water setting before assigning biome memberships. Sustained human land use is the defining condition. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "anthropogenic",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "features heavily influenced or created by human activity.\n\nSupported occurrence: Use a feature created or substantially modified by human activity at the selected terrestrial site. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 71,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nfeatures heavily influenced or created by human activity.\n\nOccurrence requirement: Assign occurrence from the actual site, land use, or affected ecosystem. Human origin alone does not identify a biome. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "anthropogenic influence",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "human driven environmental changes.\n\nSupported occurrence: Specify the human activity and its effect on the selected site's resident ecosystem. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 72,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nhuman driven environmental changes.\n\nOccurrence requirement: Specify the human activity and the environment affected before assigning biome memberships. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "anthropogenic modification",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "human driven alterations to landscapes, hydrology, soils, or ecological structure.\n\nSupported occurrence: Specify an alteration to the site's land surface, soil, hydrology, or resident ecological structure. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 73,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nhuman driven alterations to landscapes, hydrology, soils, or ecological structure.\n\nOccurrence requirement: Specify the human alteration and the affected land, hydrology, soil, or ecosystem before assigning biome memberships. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "crops",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "cultivated plants grown for food, fiber, materials, or other products.\n\nSupported occurrence: Use cultivated terrestrial fields in the selected forest-region or grassland setting. Choose plants compatible with local climate, soil, water, and cultivation; food, fiber, materials, and other products remain included. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 386,
    "sourceCellNote": "Combined matching feature name and biome tags on 2026-10-07. Source Biomes rows: 647, 648. Removed rows preserved in Biomes Aliases.\n\nVisible Notes before context completion 2026-10-08:\ncultivated plants grown for food, fiber, materials, or other products. Occurrence depends on the cultivation setting and the crop's climate, soil, and water requirements; biome memberships require that context."
  },
  {
    "name": "disease",
    "biomes": [
      "temperate-forests",
      "tropical-forests",
      "grasslands",
      "wetlands"
    ],
    "notes": "biological or environmental conditions that impair organism health, including harmful infectious biological agents and noninfectious causes.\n\nSupported occurrence: Select a resident plant or animal host in the chosen habitat. For infectious disease, choose a compatible pathogen or vector; for noninfectious disease, choose a local environmental stress that can impair that host. Forest, grassland, and wetland host contexts are supported by the related entries; a vector's presence alone is not a diseased host.",
    "sourceRow": 507,
    "sourceCellNote": "Combined matching feature name and biome tags on 2026-10-07. Source Biomes rows: 913, 914. Removed rows preserved in Biomes Aliases.\n\nVisible Notes before context completion 2026-10-08:\nbiological or environmental conditions that impair organism health, including harmful infectious biological agents and noninfectious causes. Occurrence depends on a compatible host and the causal agent or environmental stress in a defined habitat; biome memberships require that context."
  },
  {
    "name": "environmental disturbance zones",
    "biomes": [
      "taiga-forests",
      "temperate-forests",
      "tropical-forests",
      "shrublands",
      "wetlands",
      "alpine",
      "coastal",
      "deserts",
      "freshwater"
    ],
    "notes": "areas affected by strong environmental forces.\n\nSupported occurrence: Choose a disturbance operating in the actual affected habitat. Supported contexts include altered forest structure, disrupted shrubland or wetland habitat, active alpine, coastal, or desert erosion, and riverbank disturbance in freshwater settings. Meteor impact zones retain their separate meaning.",
    "sourceRow": 1178,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nareas affected by strong environmental forces. Occurrence requirement: specify the disturbance process, affected habitat, and site before assigning biome memberships. This broad disturbance meaning is separate from meteor impact zones."
  },
  {
    "name": "habitat fragmentation",
    "biomes": [
      "temperate-forests",
      "shrublands"
    ],
    "notes": "breakup of continuous habitats into isolated patches.\n\nSupported occurrence: Use a formerly continuous temperate forest or shrubland habitat broken into separated patches by a specified barrier or disturbance. Select resident organisms whose movement or habitat use is affected.",
    "sourceRow": 991,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nbreakup of continuous habitats into isolated patches.\n\nOccurrence requirement: Specify the habitat and affected organisms before assigning occurrence. Fragmentation is a condition of the habitat, rather than a separate biome. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "hazards",
    "biomes": [
      "taiga-forests",
      "temperate-forests",
      "tropical-forests",
      "alpine",
      "deserts"
    ],
    "notes": "dangerous natural features that threaten movement or survival.\n\nSupported occurrence: Choose a concrete natural hazard compatible with the site: falling branches or unstable slopes in forest contexts, or dangerous relief and unstable ground in alpine or desert terrain. Specify what threatens the selected traveler or organism.",
    "sourceRow": 1010,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\ndangerous natural features that threaten movement or survival.\n\nOccurrence requirement: Specify the natural hazard, the threatened organism or traveler, and the site before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "heavy infrastructure",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "large human built structures that reshape ecosystems.\n\nSupported occurrence: Use large built facilities at a terrestrial managed site and specify the local ecological flow or habitat they alter. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 1028,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nlarge human built structures that reshape ecosystems.\n\nOccurrence requirement: Specify the built site and the surrounding land or water environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "high biodiversity",
    "biomes": [
      "temperate-forests",
      "tropical-forests"
    ],
    "notes": "areas with large numbers of species.\n\nSupported occurrence: Use a species-rich temperate or tropical forest community. Interpret high as substantially greater species richness than comparable local sites within the same forest type and generated region, using the same taxonomic group, area, and sampling basis.",
    "sourceRow": 1046,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nareas with large numbers of species.\n\nOccurrence requirement: Specify the species group, habitat, area, and comparison scale, including whether diversity is high relative to the local biome or an absolute comparison, before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "high biomass",
    "biomes": [
      "temperate-forests",
      "tropical-forests",
      "grasslands"
    ],
    "notes": "regions with large total biological mass.\n\nSupported occurrence: For these memberships, use a dense resident vegetation community in a temperate forest, tropical forest, or grassland. Compare standing biological mass on an equal-area basis with comparable local communities. High biomass refers to living mass rather than species count; aquatic or animal-dominated cases need a defined community before additional memberships are added.",
    "sourceRow": 1047,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nregions with large total biological mass.\n\nOccurrence requirement: Specify the vegetation or aquatic community, habitat, and scale of biomass measurement before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "high endemism",
    "biomes": [
      "temperate-forests",
      "tropical-forests",
      "shrublands",
      "grasslands",
      "coastal"
    ],
    "notes": "areas with many species found nowhere else.\n\nSupported occurrence: Use an isolated island, bounded refugium, or comparable geographically restricted community in the selected forest, shrubland, grassland, or coastal setting. Define the reference region and resident taxonomic group, then require many taxa restricted to that region. Isolation supports the context but does not alone establish high endemism.",
    "sourceRow": 1051,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nareas with many species found nowhere else.\n\nOccurrence requirement: Specify the species group, geographic range or isolation, and habitat before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "highest biodiversity",
    "biomes": [
      "temperate-forests",
      "tropical-forests"
    ],
    "notes": "regions with exceptionally high species richness.\n\nSupported occurrence: Use the temperate or tropical forest site with the greatest species richness among at least two comparable forest sites in the generated region. Keep taxonomic group, survey area, and sampling basis consistent. The superlative requires that regional comparison; it makes no claim of being the most diverse place on Earth.",
    "sourceRow": 1080,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nregions with exceptionally high species richness.\n\nOccurrence requirement: Specify the species group, area, habitat, and comparison scale before using the superlative or assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "human areas",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "regions dominated by human presence and land use.\n\nSupported occurrence: Use a terrestrial settlement or land-use area where human occupation dominates the selected site. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 1109,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nregions dominated by human presence and land use.\n\nOccurrence requirement: Specify the human land use and actual land or water environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "industrial",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "human built zones dominated by manufacturing and pollution.\n\nSupported occurrence: Use a terrestrial manufacturing or processing site, with its built facilities and any specified pollutant source. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 1180,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nhuman built zones dominated by manufacturing and pollution.\n\nOccurrence requirement: Specify the industrial site and affected land or water environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "invasive species",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "non native organisms that disrupt local ecosystems.\n\nSupported occurrence: Select an introduced organism capable of establishing in the chosen temperate forest or grassland community and a specified disruptive effect on resident organisms or ecosystem processes. Introduced status alone does not establish ecological invasiveness.",
    "sourceRow": 1207,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nnon native organisms that disrupt local ecosystems.\n\nOccurrence requirement: Specify the introduced organism, recipient habitat, and ecological effect before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "land masses",
    "biomes": [
      "tundra",
      "taiga-forests",
      "temperate-forests",
      "tropical-forests",
      "shrublands",
      "grasslands",
      "wetlands",
      "alpine",
      "coastal",
      "deserts",
      "savanna"
    ],
    "notes": "large continuous land areas.\n\nSupported occurrence: Use a continent or large connected island land area. Choose the actual terrestrial climate, vegetation, hydrology, and relief at the described site; the memberships are possible land-surface settings across a land mass, rather than a claim that one site contains every biome. Submerged seabed and floating ice remain separate features.",
    "sourceRow": 1295,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nlarge continuous land areas.\n\nOccurrence requirement: Specify the actual surface climate, vegetation, and terrain before assigning occurrence; a large land area can contain multiple biomes. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "machinery",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "mechanical equipment altering landscapes and ecosystems.\n\nSupported occurrence: Use equipment operating at a defined terrestrial industrial, agricultural, or construction site, with an actual landscape or ecosystem effect. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 1451,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nmechanical equipment altering landscapes and ecosystems.\n\nOccurrence requirement: Specify the equipment's site and the affected land or water environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "minimal natural habitat",
    "biomes": [
      "temperate-forests",
      "shrublands",
      "grasslands"
    ],
    "notes": "areas where natural ecosystems are heavily reduced or fragmented.\n\nSupported occurrence: Use a terrestrial site where urbanization, agriculture, or another specified disturbance has greatly reduced the extent of the original forest, shrubland, or grassland habitat. Assess remaining natural habitat against that site's earlier or defined reference extent.",
    "sourceRow": 1550,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nareas where natural ecosystems are heavily reduced or fragmented.\n\nOccurrence requirement: Specify the habitat that has been reduced or fragmented and the local land use before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "mix of landforms",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "areas containing multiple terrain types.\n\nSupported occurrence: Use a temperate forest or grassland landscape containing at least two distinct terrain forms, such as hills with valleys or plains with ridges. Match each constituent landform to the actual site's geology and relief.",
    "sourceRow": 1559,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nareas containing multiple terrain types.\n\nOccurrence requirement: Specify the constituent terrain types and their actual environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "ornamental plants",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "cultivated plants grown for aesthetic purposes.\n\nSupported occurrence: Use decorative plantings at a managed terrestrial site. Choose plant species compatible with the site's climate, soil, and water. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 1738,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\ncultivated plants grown for aesthetic purposes.\n\nOccurrence requirement: Specify the cultivated species, planting site, climate, and water requirements before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "pesticides",
    "biomes": [
      "atmosphere",
      "temperate-forests",
      "grasslands",
      "freshwater",
      "subsurface"
    ],
    "notes": "chemical agents altering ecological balance and species survival.\n\nSupported occurrence: Use a specified pesticide and an actual application or receiving environment. Terrestrial memberships cover supported managed-land exposure; atmosphere requires airborne spray or dust drift; freshwater requires contaminated low salinity inland water; subsurface requires leaching into a groundwater or aquifer setting. Match each exposure route to the receiving habitat and susceptible organisms.",
    "sourceRow": 1828,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nchemical agents altering ecological balance and species survival.\n\nOccurrence requirement: Specify the application site, receiving habitat, target organisms, and exposure before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "polluted areas",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "landscapes degraded by contaminants or waste.\n\nSupported occurrence: Use a contaminated terrestrial site in a temperate forest region or grassland. Specify the pollutant, source, receiving soil or resident community, and harmful exposure. Air and water pollution retain their own habitat-specific contexts.",
    "sourceRow": 1869,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nlandscapes degraded by contaminants or waste.\n\nOccurrence requirement: Specify the contaminated habitat, pollutant, and exposure before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "pollution",
    "biomes": [
      "marine",
      "atmosphere",
      "temperate-forests",
      "grasslands",
      "coastal",
      "freshwater"
    ],
    "notes": "the presence of harmful substances altering ecological balance.\n\nSupported occurrence: Choose the actual pollutant and receiving medium. Terrestrial memberships cover the supported contaminated landscapes; atmosphere covers airborne contamination; marine covers saltwater, freshwater covers low salinity inland water, and coastal covers contaminated shore or estuarine settings. Match the selected medium and exposure rather than applying every membership to one event.",
    "sourceRow": 1873,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nthe presence of harmful substances altering ecological balance.\n\nOccurrence requirement: Specify the pollutant and the affected land, water, or air environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "residential zones",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "human living areas altering natural ecosystems.\n\nSupported occurrence: Use a terrestrial inhabited neighborhood with houses, streets, gardens, or related residential land use. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 1983,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nhuman living areas altering natural ecosystems.\n\nOccurrence requirement: Specify the residential site and its surrounding climate, vegetation, or water environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "soil depletion",
    "biomes": [
      "temperate-forests",
      "shrublands",
      "grasslands"
    ],
    "notes": "loss of soil nutrients due to overuse or erosion.\n\nSupported occurrence: Use terrestrial soils in the selected forest-region fields, shrubland, or grassland where repeated harvesting, overuse, or erosion has reduced nutrient availability relative to a local reference soil. Specify the loss mechanism; naturally nutrient-poor soils are a separate condition.",
    "sourceRow": 2403,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nloss of soil nutrients due to overuse or erosion.\n\nOccurrence requirement: Specify the terrestrial soil, vegetation or land use, and depletion process before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "street trees",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "trees planted along urban streets providing shade and habitat.\n\nSupported occurrence: Use planted trees along streets in a terrestrial settlement. Match the tree species to local climate, available rooting soil, water, and maintenance. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 2525,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\ntrees planted along urban streets providing shade and habitat.\n\nOccurrence requirement: Specify the tree species, street site, climate, and water requirements before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "subsidence zones",
    "biomes": [
      "temperate-forests",
      "tropical-forests",
      "shrublands",
      "grasslands",
      "wetlands",
      "deserts"
    ],
    "notes": "areas where the ground surface sinks due to compaction, groundwater withdrawal, or dissolution of underlying materials.\n\nSupported occurrence: Use a surface zone undergoing ground lowering. Match dissolution or collapse to susceptible karst in the supported forest, shrubland, or desert settings; aquifer compaction from groundwater withdrawal to compatible managed-field or arid-basin settings; and drainage, oxidation, or compaction of organic soils to wetlands. Identify the actual material and mechanism. The underground cause does not assign the surface zone to subsurface.",
    "sourceRow": 2551,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nareas where the ground surface sinks due to compaction, groundwater withdrawal, or dissolution of underlying materials.\n\nOccurrence requirement: Specify the surface setting and ground-sinking process before assigning occurrence. A cause below ground does not by itself make the surface zone a subsurface habitat. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "subtropical regions",
    "biomes": [
      "temperate-forests",
      "tropical-forests",
      "shrublands",
      "grasslands",
      "wetlands",
      "coastal",
      "deserts",
      "savanna"
    ],
    "notes": "conceptual climatic zones used for classification.\n\nSupported occurrence: Retain as a warm climatic region descriptor with compatible mild winters or seasonal rainfall. Select the actual forest type, shrub-dominated cover, grassland, savanna, saturated wetland, shoreline, or arid desert at the site. Warm climate alone does not select forest cover, and grasslands and savanna follow the existing official vegetation definitions.",
    "sourceRow": 2566,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nconceptual climatic zones used for classification.\n\nOccurrence requirement: Retain as a climatic region descriptor. Specify actual vegetation or land or water habitat before assigning biome memberships. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "suburban",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "human dominated zones between urban and rural landscapes.\n\nSupported occurrence: Use an inhabited terrestrial district at an urban fringe, combining residential development with remaining natural or managed vegetation. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 2568,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nhuman dominated zones between urban and rural landscapes.\n\nOccurrence requirement: Specify the settlement site, land use, and surrounding natural environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "temperate zone",
    "biomes": [
      "temperate-forests",
      "grasslands",
      "wetlands",
      "coastal"
    ],
    "notes": "climatic region with moderate seasonal variation.\n\nSupported occurrence: Retain as a climatic descriptor. Use the selected site's moderate seasonal climate together with its actual habitat: forest cover for temperate forests, open temperate grassland for grasslands, saturated temperate habitat for wetlands, or a temperate shoreline setting for coastal. Latitude or climate alone does not choose the habitat.",
    "sourceRow": 2655,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nclimatic region with moderate seasonal variation.\n\nOccurrence requirement: Retain as a climatic region descriptor. Specify actual vegetation or land or water habitat before assigning biome memberships; temperate geography alone does not establish forest cover. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "towers",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "tall human made structures altering airflow and habitat.\n\nSupported occurrence: Use a tall human structure at a terrestrial settlement or infrastructure site. Specify its purpose and local airflow or habitat effect; rock towers remain separate. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 2720,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\ntall human made structures altering airflow and habitat.\n\nOccurrence requirement: Specify the human structure's site and surrounding land or water environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "toxic spills",
    "biomes": [
      "marine",
      "atmosphere",
      "temperate-forests",
      "grasslands",
      "coastal",
      "freshwater"
    ],
    "notes": "contamination events that disrupt ecosystems.\n\nSupported occurrence: Use a discrete release of a toxic substance and a specified receiving site. Match land contamination to supported terrestrial settings and water contamination to marine, coastal, or freshwater settings according to actual salinity and location. Atmosphere applies when harmful airborne material or vapor forms part of the release. Specify the toxic exposure and affected resident community.",
    "sourceRow": 2727,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\ncontamination events that disrupt ecosystems.\n\nOccurrence requirement: Specify the spilled substance, receiving habitat, and exposure before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "traffic",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "movement of vehicles creating noise, pollution, and fragmentation.\n\nSupported occurrence: Use vehicles on terrestrial roads or other transport corridors through the selected site, with noise, emissions, or habitat fragmentation. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 2728,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nmovement of vehicles creating noise, pollution, and fragmentation.\n\nOccurrence requirement: Specify the transport route, vehicle activity, and surrounding land or water environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "tropical areas",
    "biomes": [
      "marine",
      "tropical-forests",
      "shrublands",
      "grasslands",
      "wetlands",
      "coastal",
      "deserts",
      "freshwater",
      "savanna"
    ],
    "notes": "geographic regions within the tropics.\n\nSupported occurrence: Retain as a tropical latitude or climate descriptor. Require the site's tropical regional context and choose its actual habitat: forest, shrubland, grassland, savanna, saturated wetland, coastal shore, arid desert, marine saltwater, or low salinity inland freshwater. The memberships are habitat alternatives; being tropical does not by itself establish forest cover, water salinity, or wetland saturation.",
    "sourceRow": 2739,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\ngeographic regions within the tropics.\n\nOccurrence requirement: Retain as a latitude and climate descriptor. Specify the actual forest, savanna, desert, wetland, coastal, or aquatic setting before assigning biome memberships. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "tropical regions",
    "biomes": [
      "marine",
      "tropical-forests",
      "shrublands",
      "grasslands",
      "wetlands",
      "coastal",
      "deserts",
      "freshwater",
      "savanna"
    ],
    "notes": "conceptual climatic zones near the equator.\n\nSupported occurrence: Retain as a tropical latitude or climate descriptor. Require the site's tropical regional context and choose its actual habitat: forest, shrubland, grassland, savanna, saturated wetland, coastal shore, arid desert, marine saltwater, or low salinity inland freshwater. The memberships are habitat alternatives; being tropical does not by itself establish forest cover, water salinity, or wetland saturation.",
    "sourceRow": 2749,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nconceptual climatic zones near the equator.\n\nOccurrence requirement: Retain as a latitude and climate descriptor. Specify the actual vegetation or water habitat before assigning biome memberships. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "tropical zone",
    "biomes": [
      "marine",
      "tropical-forests",
      "shrublands",
      "grasslands",
      "wetlands",
      "coastal",
      "deserts",
      "freshwater",
      "savanna"
    ],
    "notes": "climatic region near the equator.\n\nSupported occurrence: Retain as a tropical latitude or climate descriptor. Require the site's tropical regional context and choose its actual habitat: forest, shrubland, grassland, savanna, saturated wetland, coastal shore, arid desert, marine saltwater, or low salinity inland freshwater. The memberships are habitat alternatives; being tropical does not by itself establish forest cover, water salinity, or wetland saturation.",
    "sourceRow": 2751,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nclimatic region near the equator.\n\nOccurrence requirement: Retain as a climatic zone descriptor. Specify the actual vegetation or habitat before assigning biome memberships. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "urban areas",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "highly developed human environments with altered ecosystems.\n\nSupported occurrence: Use a dense terrestrial settlement with concentrated buildings, transport routes, and altered resident ecosystems. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 2819,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nhighly developed human environments with altered ecosystems.\n\nOccurrence requirement: Specify the city site, land use, and surrounding natural land or water environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "urban predators",
    "biomes": [
      "temperate-forests",
      "grasslands"
    ],
    "notes": "predators adapted to living near or within cities.\n\nSupported occurrence: Select a predator compatible with the site's terrestrial habitat and an urban territory containing suitable prey, shelter, and movement routes. The listed memberships represent the existing temperate forest and grassland settlement or managed-land contexts. Match the site's underlying habitat and land use; human origin is the feature's cause rather than a biome.",
    "sourceRow": 2823,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\npredators adapted to living near or within cities.\n\nOccurrence requirement: Specify the predator species, city site, prey, and compatible habitat before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "zones of high erosion",
    "biomes": [
      "taiga-forests",
      "temperate-forests",
      "tropical-forests",
      "shrublands",
      "grasslands",
      "alpine",
      "coastal",
      "deserts",
      "freshwater"
    ],
    "notes": "areas experiencing intense erosive forces.\n\nSupported occurrence: Use a site undergoing pronounced active erosion, with compatible substrate and a specified wind, flowing-water, wave, or slope process. Match forest soil displacement, exposed shrubland or grassland soils, alpine slopes, coastal shorelines, desert terrain, or freshwater riverbanks to the corresponding setting.",
    "sourceRow": 3090,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\nareas experiencing intense erosive forces.\n\nOccurrence requirement: Specify the substrate, erosion process, and affected surface or water environment before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  },
  {
    "name": "zones of transition",
    "biomes": [
      "temperate-forests",
      "shrublands",
      "grasslands"
    ],
    "notes": "ecotones where two ecosystems meet.\n\nSupported occurrence: Use a boundary between two supported adjoining vegetation communities: temperate forests and shrublands, temperate forests and grasslands, or shrublands and grasslands. Name the actual pair and describe its transition; a single selected biome does not by itself establish an ecotone.",
    "sourceRow": 3093,
    "sourceCellNote": "Visible Notes before context completion 2026-10-08:\necotones where two ecosystems meet.\n\nOccurrence requirement: Specify the two or more adjoining biomes and the transition setting before assigning occurrence. Biome memberships remain unassigned until that context is specified."
  }
];
