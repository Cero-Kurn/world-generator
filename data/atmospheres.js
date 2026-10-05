export const ATMOSPHERES = {
  vacuum: { name: "Vacuum / Trace Exosphere", pressure: 0 },
  tenuous: { name: "Tenuous Atmosphere", pressure: 0.03 },
  thin: { name: "Thin Atmosphere", pressure: 0.35 },
  standard: { name: "Standard Atmosphere", pressure: 1.0 },
  dense: { name: "Dense Atmosphere", pressure: 2.5 },
  superdense: { name: "Superdense Atmosphere", pressure: 8.0 }
};

export function classifyAtmosphere(gravity, temperatureK, volatileInventory) {
  if (gravity < 0.12 || volatileInventory < 0.15) return ATMOSPHERES.vacuum;
  if (gravity < 0.35) return ATMOSPHERES.tenuous;
  if (gravity < 0.60) return ATMOSPHERES.thin;
  if (temperatureK > 650 && volatileInventory > 0.75) return ATMOSPHERES.dense;
  if (gravity > 1.4 && volatileInventory > 0.55) return ATMOSPHERES.superdense;
  return ATMOSPHERES.standard;
}

export function atmosphereComposition(rng, type, temperatureK) {
  if (type.pressure === 0) return [{ gas: "trace gases", percent: 100 }];
  const cold = temperatureK < 240;
  const hot = temperatureK > 430;
  const choices = hot
    ? [["carbon dioxide", 55], ["nitrogen", 25], ["sulfur compounds", 12], ["argon", 5], ["other", 3]]
    : cold
      ? [["nitrogen", 65], ["methane", 12], ["argon", 10], ["carbon dioxide", 8], ["other", 5]]
      : [["nitrogen", 68], ["oxygen", 20], ["argon", 5], ["carbon dioxide", 2], ["other", 5]];
  const drift = rng.int(-5, 5);
  const values = choices.map(([gas, percent], i) => ({ gas, percent: Math.max(1, percent + (i === 0 ? drift : 0)) }));
  const total = values.reduce((s, x) => s + x.percent, 0);
  return values.map(x => ({ ...x, percent: +(x.percent * 100 / total).toFixed(1) }));
}