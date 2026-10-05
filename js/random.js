export function hashString(input) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createRng(seed) {
  let state = hashString(String(seed)) || 1;
  return {
    next() {
      state = (state + 0x6D2B79F5) | 0;
      let t = Math.imul(state ^ state >>> 15, 1 | state);
      t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    },
    float(min = 0, max = 1) { return min + this.next() * (max - min); },
    int(min, max) { return Math.floor(this.float(min, max + 1)); },
    chance(probability) { return this.next() < probability; },
    pick(items) {
      if (!items.length) throw new Error("Cannot pick from an empty list.");
      return items[this.int(0, items.length - 1)];
    },
    weighted(items) {
      const total = items.reduce((sum, item) => sum + item.weight, 0);
      let roll = this.float(0, total);
      for (const item of items) {
        roll -= item.weight;
        if (roll < 0) return item.value;
      }
      return items[items.length - 1].value;
    }
  };
}

export function deriveRng(seed, ...parts) {
  return createRng([seed, ...parts].join("::"));
}

export function randomSeed() {
  return Math.floor(Date.now()).toString(36).toUpperCase() + "-" +
    Math.floor(Math.random() * 0xFFFFFF).toString(36).toUpperCase();
}