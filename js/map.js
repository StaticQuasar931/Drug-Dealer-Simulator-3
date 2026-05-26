'use strict';
/* ── Territories ── */
const Map = (() => {

  function unlock(state, territoryId) {
    if (state.territories[territoryId]) return { ok:false, reason:'Already owned' };
    const t = TERRITORIES.find(x => x.id === territoryId);
    if (!t) return { ok:false, reason:'Unknown territory' };
    if (state.totalEarned < t.unlockCost) return { ok:false, reason:`Need ${Economy.fmt(t.unlockCost)} total earned` };
    const cost = Math.floor(t.unlockCost * 0.1); // pay 10% of threshold as a claim fee
    if (cost > 0 && (state.cash + state.cleanCash) < cost) return { ok:false, reason:`Need ${Economy.fmt(cost)} to claim` };
    if (cost > 0) Production.deductCash(state, cost);
    state.territories[territoryId] = true;
    state.stats.territoriesUnlocked = (state.stats.territoriesUnlocked||0) + 1;
    return { ok:true, name:t.name };
  }

  function count(state) {
    return Object.values(state.territories).filter(Boolean).length;
  }

  function canUnlock(state, territoryId) {
    const t = TERRITORIES.find(x => x.id === territoryId);
    return t && state.totalEarned >= t.unlockCost;
  }

  return { unlock, count, canUnlock };
})();
