'use strict';
/* ── Production — produce, sell, unlock, upgrade ── */
const Production = (() => {

  /* ── Manual produce click (boosts progress bar) ── */
  function manualProduce(state) {
    const p = PRODUCTS.find(x => x.id === state.activeProduct);
    if (!p) return 0;
    // Manual click adds 0.6 seconds worth of bar progress
    const boost = 0.6 / Math.max(p.produceTime / (state.produceSpeedMult || 1), 0.5);
    state.production.progress += boost;
    let added = 0;
    while (state.production.progress >= 1) {
      state.production.progress -= 1;
      const qty = Math.max(1, Math.floor(p.batchSize * (state.batchMult || 1)));
      state.stock[state.activeProduct] = (state.stock[state.activeProduct] || 0) + qty;
      added += qty;
    }
    state.stats.totalProduced = (state.stats.totalProduced || 0) + added;
    return added;
  }

  /* ── Auto-produce tick ── */
  function tickProduce(state, dt) {
    const p = PRODUCTS.find(x => x.id === state.activeProduct);
    if (!p) return;
    const rate = Economy.getProduceBarRate(state);
    state.production.progress += rate * dt;
    while (state.production.progress >= 1) {
      state.production.progress -= 1;
      const qty = Math.max(1, Math.floor(p.batchSize * (state.batchMult || 1)));
      state.stock[state.activeProduct] = (state.stock[state.activeProduct] || 0) + qty;
      state.stats.totalProduced = (state.stats.totalProduced || 0) + qty;
    }
  }

  /* ── Sell units ── */
  function sell(state, productId, qty) {
    const pid  = productId || state.activeProduct;
    const avail = Math.floor(state.stock[pid] || 0);
    if (avail <= 0) return 0;
    const toSell = Math.min(Math.max(1, qty), avail);
    const price  = Economy.getSellPrice(state, pid);
    const earned = price * toSell;

    state.stock[pid]  = (state.stock[pid] || 0) - toSell;
    state.cash        += earned;
    state.totalEarned += earned;
    state.heat         = Math.min(100, state.heat + Economy.getHeatPerSale(state, pid) * toSell);
    state.stats.totalSales  = (state.stats.totalSales || 0) + toSell;
    state.stats.totalSalesCash = (state.stats.totalSalesCash || 0) + earned;
    if (state.heat > (state.stats.maxHeat||0)) state.stats.maxHeat = state.heat;

    return earned;
  }

  /* ── Auto-sell tick ── */
  function tickSell(state, dt) {
    const pid   = state.activeProduct;
    const avail = state.stock[pid] || 0;
    if (avail <= 0) return 0;
    const rate   = Economy.getAutoSellRate(state);
    const toSell = Math.min(rate * dt, avail);
    if (toSell <= 0) return 0;

    const price  = Economy.getSellPrice(state, pid);
    const earned = price * toSell;

    state.stock[pid]  = Math.max(0, (state.stock[pid] || 0) - toSell);
    state.cash        += earned;
    state.totalEarned += earned;
    state.heat         = Math.min(100, state.heat + Economy.getHeatPerSale(state, pid) * toSell);
    state.stats.totalSales  = (state.stats.totalSales || 0) + toSell;
    state.stats.totalSalesCash = (state.stats.totalSalesCash || 0) + earned;
    if (state.heat > (state.stats.maxHeat||0)) state.stats.maxHeat = state.heat;

    return earned;
  }

  /* ── Unlock product ── */
  function unlock(state, productId) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return { ok:false, reason:'Unknown product' };
    if (state.unlockedProducts[productId]) {
      // Already unlocked — just switch
      state.activeProduct = productId;
      state.production.progress = 0;
      return { ok:true, switched:true };
    }
    if (state.totalEarned < p.unlockCost) {
      return { ok:false, reason:`Need ${Economy.fmt(p.unlockCost)} earned first` };
    }
    // Unlock is free once you've earned the threshold
    state.unlockedProducts[productId] = true;
    state.activeProduct = productId;
    state.production.progress = 0;
    state.stats.productsUnlocked = (state.stats.productsUnlocked||0) + 1;
    return { ok:true };
  }

  /* ── Buy upgrade ── */
  function buyUpgrade(state, upgradeId) {
    if (state.upgrades[upgradeId]) return { ok:false, reason:'Already bought' };
    const u = UPGRADES.find(x => x.id === upgradeId);
    if (!u) return { ok:false, reason:'Unknown upgrade' };
    if (!meetsReq(state, u.req)) return { ok:false, reason:'Requirements not met' };
    if ((state.cash + state.cleanCash) < u.cost) return { ok:false, reason:`Need ${Economy.fmt(u.cost)}` };

    deductCash(state, u.cost);
    state.upgrades[upgradeId] = true;
    applyUpgrade(state, u.effect, false);
    return { ok:true, name:u.name };
  }

  function meetsReq(state, req) {
    if (!req) return true;
    if (req.totalEarned && state.totalEarned < req.totalEarned) {
      // Also pass if they have that much cash
      if ((state.cash + state.cleanCash) < req.totalEarned) return false;
    }
    if (req.workers) {
      for (const [wId, n] of Object.entries(req.workers)) {
        if ((state.workers[wId]||0) < n) return false;
      }
    }
    return true;
  }

  function applyUpgrade(state, effect, silent) {
    if (effect.produceSpeed)  state.produceSpeedMult  = (state.produceSpeedMult||1) * effect.produceSpeed;
    if (effect.sellPrice)     state.sellPriceBonus    = (state.sellPriceBonus||1) * effect.sellPrice;
    if (effect.heatMult)      state.heatMult          = (state.heatMult||1) * effect.heatMult;
    if (effect.launderEff !== undefined) state.launderEfficiency = effect.launderEff;
    if (effect.sellRate)      state.sellRateMult      = (state.sellRateMult||1) * effect.sellRate;
    if (effect.produceRate)   state.produceRateMult   = (state.produceRateMult||1) * effect.produceRate;
    if (effect.batchMult)     state.batchMult         = (state.batchMult||1) * effect.batchMult;
  }

  /* ── Recompute all multipliers from scratch ── */
  function recompute(state) {
    state.produceSpeedMult  = 1;
    state.sellPriceBonus    = 1;
    state.heatMult          = 1;
    state.launderEfficiency = 0.80;
    state.sellRateMult      = 1;
    state.produceRateMult   = 1;
    state.batchMult         = 1;
    state.launderRateMult   = 1;

    // Upgrades
    for (const [uid, bought] of Object.entries(state.upgrades)) {
      if (!bought) continue;
      const u = UPGRADES.find(x => x.id === uid);
      if (u) applyUpgrade(state, u.effect, true);
    }

    // Achievement rewards
    for (const [aid, earned] of Object.entries(state.achievements)) {
      if (!earned) continue;
      const a = ACHIEVEMENTS.find(x => x.id === aid);
      if (!a) continue;
      const r = a.reward;
      if (r.sellPrice)    state.sellPriceBonus  = (state.sellPriceBonus||1) * r.sellPrice;
      if (r.produceSpeed) state.produceSpeedMult = (state.produceSpeedMult||1) * r.produceSpeed;
      if (r.heatMult)     state.heatMult        = (state.heatMult||1) * r.heatMult;
      if (r.launderRate)  state.launderRateMult = (state.launderRateMult||1) * r.launderRate;
    }
  }

  /* ── Cash deduction helper ── */
  function deductCash(state, amount) {
    if (state.cash >= amount) { state.cash -= amount; }
    else { const rem = amount - state.cash; state.cash = 0; state.cleanCash = Math.max(0, state.cleanCash - rem); }
  }

  return { manualProduce, tickProduce, sell, tickSell, unlock, buyUpgrade, recompute, deductCash };
})();
