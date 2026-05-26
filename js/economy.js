'use strict';
/* ── Economy — price math, multiplier helpers ── */
const Economy = (() => {

  /* Price oscillation */
  let _phase = 0;
  let _pricemod = 1;

  function tickPrices(dt) {
    _phase += dt * 0.04;
    _pricemod = 1 + 0.25 * Math.sin(_phase);
  }
  function getPriceMod() { return _pricemod; }

  /* ── Compute effective sell price ── */
  function getSellPrice(state, productId) {
    const p = PRODUCTS.find(x => x.id === (productId || state.activeProduct));
    if (!p) return 0;
    let price = p.basePrice;
    price *= _pricemod;                                    // market fluctuation
    price *= (state.mods.priceMult || 1);                  // event modifier
    price *= (state.sellPriceBonus || 1);                  // upgrade/achievement multiplier
    price *= getTerritoryBonus(state, 'sellPrice');         // territory
    price *= getHeatPenalty(state.heat);                   // heat penalty
    return price;
  }

  /* ── Auto-produce rate (units/s) ── */
  function getAutoProduceRate(state) {
    const p = PRODUCTS.find(x => x.id === state.activeProduct);
    if (!p) return 0;
    let rate = 0;
    for (const [wId, cnt] of Object.entries(state.workers)) {
      if (!cnt) continue;
      const w = WORKERS.find(x => x.id === wId);
      if (w && w.produceRate > 0) rate += w.produceRate * cnt;
    }
    rate *= (state.produceRateMult || 1);                  // upgrades/achievements
    rate *= (state.mods.produceMult || 1);                 // events
    rate *= getTerritoryBonus(state, 'produceSpeed');       // territory
    return rate;
  }

  /* ── Bar fill rate (0→1 per second, includes manual + workers) ── */
  function getProduceBarRate(state) {
    const p = PRODUCTS.find(x => x.id === state.activeProduct);
    if (!p) return 0;
    const effectiveTime = p.produceTime / (state.produceSpeedMult || 1);
    const workerFillRate = getAutoProduceRate(state) / Math.max(p.batchSize, 1);
    // Workers contribute 1 unit = 1 bar-fill worth
    const baseRate = 1 / Math.max(effectiveTime, 0.1);    // natural bar fill/s
    return baseRate + workerFillRate;
  }

  /* ── Auto-sell rate (units/s) ── */
  function getAutoSellRate(state) {
    let rate = 0;
    for (const [wId, cnt] of Object.entries(state.workers)) {
      if (!cnt) continue;
      const w = WORKERS.find(x => x.id === wId);
      if (w && w.sellRate > 0) rate += w.sellRate * cnt;
    }
    rate *= (state.sellRateMult || 1);
    rate *= getTerritoryBonus(state, 'sellRate');
    return rate;
  }

  /* ── Heat reduction/s ── */
  function getHeatReduction(state) {
    let r = 0;
    for (const [wId, cnt] of Object.entries(state.workers)) {
      if (!cnt) continue;
      const w = WORKERS.find(x => x.id === wId);
      if (w && w.heatReduce > 0) r += w.heatReduce * cnt;
    }
    if (state.territories.underground) r += 2;
    return r;
  }

  /* ── Laundering rate ($/s) ── */
  function getLaunderRate(state) {
    let r = 0;
    for (const [fId, cnt] of Object.entries(state.fronts)) {
      if (!cnt) continue;
      const f = FRONTS.find(x => x.id === fId);
      if (f) r += f.rate * cnt;
    }
    for (const [wId, cnt] of Object.entries(state.workers)) {
      if (!cnt) continue;
      const w = WORKERS.find(x => x.id === wId);
      if (w && w.launderRate > 0) r += w.launderRate * cnt;
    }
    r *= (state.launderRateMult || 1);
    return r;
  }

  /* ── Heat per sale ── */
  function getHeatPerSale(state, productId) {
    const p = PRODUCTS.find(x => x.id === (productId || state.activeProduct));
    if (!p) return 0;
    return p.heatPerSale * (state.heatMult || 1) * getTerritoryHeatMult(state);
  }

  /* ── Heat penalty on prices ── */
  function getHeatPenalty(heat) {
    if (heat < 25) return 1.0;
    if (heat < 50) return 0.90;
    if (heat < 75) return 0.75;
    if (heat < 90) return 0.55;
    return 0.30;
  }

  /* ── Territory helpers ── */
  function getTerritoryBonus(state, key) {
    let mult = 1;
    for (const tId of Object.keys(state.territories)) {
      if (!state.territories[tId]) continue;
      const t = TERRITORIES.find(x => x.id === tId);
      if (t && t.bonus[key]) mult *= t.bonus[key];
    }
    return mult;
  }

  function getTerritoryHeatMult(state) {
    let mult = 1;
    for (const tId of Object.keys(state.territories)) {
      if (!state.territories[tId]) continue;
      const t = TERRITORIES.find(x => x.id === tId);
      if (t && t.bonus.heatMult) mult *= t.bonus.heatMult;
    }
    return mult;
  }

  /* ── Worker cost with scaling ── */
  function workerCost(workerId, currentCount) {
    const w = WORKERS.find(x => x.id === workerId);
    if (!w) return Infinity;
    return Math.ceil(w.cost * Math.pow(w.mult, currentCount));
  }

  /* ── Formatting ── */
  function fmt(n) {
    if (n >= 1e12) return '$' + (n/1e12).toFixed(2) + 'T';
    if (n >= 1e9)  return '$' + (n/1e9).toFixed(2) + 'B';
    if (n >= 1e6)  return '$' + (n/1e6).toFixed(2) + 'M';
    if (n >= 1e3)  return '$' + (n/1e3).toFixed(1) + 'K';
    return '$' + Math.floor(n).toLocaleString();
  }
  function fmtNum(n) {
    if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
    return Math.floor(n).toLocaleString();
  }
  function fmtTime(s) {
    if (s < 60) return Math.floor(s) + 's';
    if (s < 3600) return Math.floor(s/60) + 'm ' + (Math.floor(s)%60) + 's';
    return Math.floor(s/3600) + 'h ' + Math.floor((s%3600)/60) + 'm';
  }

  return {
    tickPrices, getPriceMod,
    getSellPrice, getAutoProduceRate, getProduceBarRate, getAutoSellRate,
    getHeatReduction, getLaunderRate, getHeatPerSale, getHeatPenalty,
    getTerritoryBonus, workerCost,
    fmt, fmtNum, fmtTime
  };
})();
