/* Laundering - Front businesses, dirty→clean money conversion */
const Laundering = (() => {

  function purchaseFront(state, frontId) {
    const def = GAME_DATA.fronts.find(f => f.id === frontId);
    if (!def) return { success: false, reason: 'Unknown front' };

    const count = state.fronts[frontId] || 0;
    // Each additional front costs 3× more
    const cost = Math.floor(def.cost * Math.pow(3, count));
    const totalCash = state.cash + state.cleanCash;
    if (totalCash < cost) return { success: false, reason: `Need ${Economy.formatCash(cost)}` };

    if (state.cash >= cost) {
      state.cash -= cost;
    } else {
      const rem = cost - state.cash;
      state.cash = 0;
      state.cleanCash = Math.max(0, state.cleanCash - rem);
    }

    state.fronts[frontId] = count + 1;
    state.stats.frontsOwned = (state.stats.frontsOwned || 0) + 1;
    return { success: true, name: def.name, cost };
  }

  function getFrontCost(state, frontId) {
    const def = GAME_DATA.fronts.find(f => f.id === frontId);
    if (!def) return Infinity;
    const count = state.fronts[frontId] || 0;
    return Math.floor(def.cost * Math.pow(3, count));
  }

  function processTick(state, deltaSeconds) {
    const rate = Economy.getLaunderRate(state);
    if (rate <= 0 || state.cash <= 0) return 0;

    const maxLaunder = rate * deltaSeconds;
    const actual = Math.min(maxLaunder, state.cash);
    const efficiency = state.launderEfficiency || 0.80;

    state.cash -= actual;
    const clean = actual * efficiency;
    state.cleanCash += clean;
    state.totalLaundered = (state.totalLaundered || 0) + clean;

    return clean;
  }

  function getTotalFronts(state) {
    return Object.values(state.fronts).reduce((a, b) => a + b, 0);
  }

  return { purchaseFront, getFrontCost, processTick, getTotalFronts };
})();
