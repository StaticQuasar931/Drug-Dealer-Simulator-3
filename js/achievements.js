'use strict';
/* ── Achievements ── */
const Achievements = (() => {

  function check(state, notify) {
    for (const a of ACHIEVEMENTS) {
      if (state.achievements[a.id]) continue;
      if (_meets(state, a.req)) _award(state, a, notify);
    }
  }

  function _meets(state, req) {
    if (req.sales        && (state.stats.totalSales||0) < req.sales)             return false;
    if (req.totalEarned  && state.totalEarned < req.totalEarned)                  return false;
    if (req.totalWorkers && Workers.total(state) < req.totalWorkers)              return false;
    if (req.laundered    && (state.totalLaundered||0) < req.laundered)            return false;
    if (req.raidsSurvived&& (state.stats.raidsSurvived||0) < req.raidsSurvived)  return false;
    if (req.maxHeat      && (state.stats.maxHeat||0) < req.maxHeat)               return false;
    if (req.territories  && Map.count(state) < req.territories)                   return false;
    if (req.fronts       && Laundering.totalFronts(state) < req.fronts)           return false;
    if (req.product      && !state.unlockedProducts[req.product])                 return false;
    if (req.playTime     && (state.totalPlayTime||0) < req.playTime)              return false;
    if (req.speedRun) {
      const elapsed = (Date.now() - (state.startTime||Date.now())) / 1000;
      if (state.totalEarned < req.speedRun.cash || elapsed > req.speedRun.time)  return false;
    }
    return true;
  }

  function _award(state, ach, notify) {
    state.achievements[ach.id] = { at: Date.now() };
    state.stats.achEarned = (state.stats.achEarned||0) + 1;

    const r = ach.reward;
    if (r.cash)         { state.cash += r.cash; state.totalEarned += r.cash; }
    if (r.sellPrice)    state.sellPriceBonus   = (state.sellPriceBonus||1) * r.sellPrice;
    if (r.produceSpeed) state.produceSpeedMult = (state.produceSpeedMult||1) * r.produceSpeed;
    if (r.heatMult)     state.heatMult         = (state.heatMult||1) * r.heatMult;
    if (r.launderRate)  state.launderRateMult  = (state.launderRateMult||1) * r.launderRate;

    notify(`🏆 ${ach.name}: ${ach.desc}`, 'achievement');
  }

  function earnedCount(state) {
    return Object.values(state.achievements).filter(Boolean).length;
  }

  return { check, earnedCount };
})();
