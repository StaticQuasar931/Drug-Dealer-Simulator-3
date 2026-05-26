'use strict';
/* ── Laundering ── */
const Laundering = (() => {

  function buyFront(state, frontId) {
    const f = FRONTS.find(x => x.id === frontId);
    if (!f) return { ok:false, reason:'Unknown front' };
    const count = state.fronts[frontId] || 0;
    const cost  = Math.floor(f.cost * Math.pow(3, count));
    if ((state.cash + state.cleanCash) < cost) return { ok:false, reason:`Need ${Economy.fmt(cost)}` };
    Production.deductCash(state, cost);
    state.fronts[frontId] = count + 1;
    state.stats.totalFronts = (state.stats.totalFronts||0) + 1;
    return { ok:true, name:f.name, cost };
  }

  function frontCost(state, frontId) {
    const f = FRONTS.find(x => x.id === frontId);
    if (!f) return Infinity;
    return Math.floor(f.cost * Math.pow(3, state.fronts[frontId]||0));
  }

  function totalFronts(state) {
    return Object.values(state.fronts).reduce((s,n) => s+n, 0);
  }

  function tick(state, dt) {
    const rate = Economy.getLaunderRate(state);
    if (rate <= 0 || state.cash <= 0) return 0;
    const max    = rate * dt;
    const actual = Math.min(max, state.cash);
    const eff    = state.launderEfficiency || 0.80;
    state.cash      -= actual;
    const clean = actual * eff;
    state.cleanCash += clean;
    state.totalLaundered = (state.totalLaundered||0) + clean;
    return clean;
  }

  return { buyFront, frontCost, totalFronts, tick };
})();
