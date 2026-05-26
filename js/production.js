/* Production - Click handling, upgrades, item switching */
const Production = (() => {

  function handleClick(state) {
    const value = Economy.getClickValue(state);
    state.cash += value;
    state.totalEarned += value;
    state.stats.totalClicks = (state.stats.totalClicks || 0) + 1;

    // Heat per click
    let heat = Economy.getHeatPerClick(state);
    state.heat = Math.min(100, state.heat + heat);

    return value;
  }

  function switchItem(state, itemId) {
    const item = GAME_DATA.items.find(i => i.id === itemId);
    if (!item) return false;
    if (item.unlockCash > state.totalEarned && !state.unlockedItems[itemId]) return false;
    state.activeItem = itemId;
    return true;
  }

  function tryUnlockItem(state, itemId) {
    if (state.unlockedItems[itemId]) return false;
    const item = GAME_DATA.items.find(i => i.id === itemId);
    if (!item) return false;

    const totalCash = state.cash + state.cleanCash;
    if (totalCash < item.unlockCash) return false;

    // Deduct
    if (state.cash >= item.unlockCash) {
      state.cash -= item.unlockCash;
    } else {
      const rem = item.unlockCash - state.cash;
      state.cash = 0;
      state.cleanCash = Math.max(0, state.cleanCash - rem);
    }

    state.unlockedItems[itemId] = true;
    state.activeItem = itemId;
    state.stats.itemsUnlocked = (state.stats.itemsUnlocked || 0) + 1;
    return true;
  }

  function purchaseUpgrade(state, upgradeId) {
    if (state.upgrades[upgradeId]) return { success: false, reason: 'Already purchased' };
    const upgDef = GAME_DATA.upgrades.find(u => u.id === upgradeId);
    if (!upgDef) return { success: false, reason: 'Unknown upgrade' };

    // Check requirement
    if (!meetsRequirement(state, upgDef.req)) {
      return { success: false, reason: 'Requirements not met' };
    }

    const totalCash = state.cash + state.cleanCash;
    if (totalCash < upgDef.cost) return { success: false, reason: 'Not enough cash' };

    if (state.cash >= upgDef.cost) {
      state.cash -= upgDef.cost;
    } else {
      const rem = upgDef.cost - state.cash;
      state.cash = 0;
      state.cleanCash = Math.max(0, state.cleanCash - rem);
    }

    state.upgrades[upgradeId] = true;
    applyUpgradeEffect(state, upgDef.effect);

    return { success: true, name: upgDef.name };
  }

  function meetsRequirement(state, req) {
    if (!req) return true;
    if (req.cash && (state.cash + state.cleanCash) < req.cash) {
      // Check total earned instead
      if (state.totalEarned < req.cash) return false;
    }
    if (req.workers) {
      for (const [wId, needed] of Object.entries(req.workers)) {
        if ((state.workers[wId] || 0) < needed) return false;
      }
    }
    return true;
  }

  function applyUpgradeEffect(state, effect) {
    switch (effect.type) {
      case 'clickMult':
        state.clickMultiplier = (state.clickMultiplier || 1) * effect.value;
        break;
      case 'workerMult':
        // Handled in economy per-worker lookup
        break;
      case 'allWorkerMult':
        state.allWorkerMultiplier = (state.allWorkerMultiplier || 1) * effect.value;
        break;
      case 'launderEff':
        state.launderEfficiency = effect.value;
        break;
      case 'heatMult':
        state.heatMultiplier = (state.heatMultiplier || 1) * effect.value;
        break;
      case 'allIncomeMult':
        state.allIncomeMultiplier = (state.allIncomeMultiplier || 1) * effect.value;
        break;
    }
  }

  function recomputeMultipliers(state) {
    // Reset and reapply all purchased upgrades + earned achievement rewards (called on load)
    state.clickMultiplier     = 1;
    state.allWorkerMultiplier = 1;
    state.heatMultiplier      = 1;
    state.launderEfficiency   = 0.80;
    state.allIncomeMultiplier = 1;
    state.launderMultiplier   = state.launderMultiplier || 1; // keep if present, else 1

    // Re-apply upgrades
    for (const [upId, bought] of Object.entries(state.upgrades)) {
      if (!bought) continue;
      const upgDef = GAME_DATA.upgrades.find(u => u.id === upId);
      if (upgDef) applyUpgradeEffect(state, upgDef.effect);
    }

    // Re-apply achievement rewards so multipliers survive save/load cycles
    state.launderMultiplier = 1;
    for (const [achId, earned] of Object.entries(state.achievements)) {
      if (!earned) continue;
      const achDef = GAME_DATA.achievements.find(a => a.id === achId);
      if (!achDef) continue;
      const r = achDef.reward;
      if (r.clickMult)     state.clickMultiplier     = (state.clickMultiplier || 1) * r.clickMult;
      if (r.allWorkerMult) state.allWorkerMultiplier = (state.allWorkerMultiplier || 1) * r.allWorkerMult;
      if (r.launderMult)   state.launderMultiplier   = (state.launderMultiplier || 1) * r.launderMult;
      if (r.heatMult)      state.heatMultiplier      = (state.heatMultiplier || 1) * r.heatMult;
      if (r.allIncomeMult) {
        state.clickMultiplier     = (state.clickMultiplier || 1) * r.allIncomeMult;
        state.allWorkerMultiplier = (state.allWorkerMultiplier || 1) * r.allIncomeMult;
      }
    }
  }

  return { handleClick, switchItem, tryUnlockItem, purchaseUpgrade, recomputeMultipliers };
})();
