/* Achievements - Checking and awarding */
const Achievements = (() => {

  function checkAll(state, notifyFn) {
    for (const ach of GAME_DATA.achievements) {
      if (state.achievements[ach.id]) continue;
      if (_check(state, ach)) {
        award(state, ach, notifyFn);
      }
    }
  }

  function _check(state, ach) {
    const req = ach.req;
    switch (req.type) {
      case 'clicks':       return (state.stats.totalClicks || 0) >= req.value;
      case 'totalEarned':  return state.totalEarned >= req.value;
      case 'totalWorkers': return Workers.getTotalWorkers(state) >= req.value;
      case 'totalLaundered': return (state.totalLaundered || 0) >= req.value;
      case 'raidssurvived': return (state.stats.raidssurvived || 0) >= req.value;
      case 'maxHeat':      return (state.stats.maxHeat || 0) >= req.value;
      case 'districts':    return Map.getUnlockedCount(state) >= req.value;
      case 'fronts':       return Laundering.getTotalFronts(state) >= req.value;
      case 'item':         return !!state.unlockedItems[req.item];
      case 'playTime':     return (state.totalPlayTime || 0) >= req.value;
      case 'speedRun': {
        const elapsed = (Date.now() - (state.startTime || Date.now())) / 1000;
        return state.totalEarned >= req.value && elapsed <= req.time;
      }
      default: return false;
    }
  }

  function award(state, ach, notifyFn) {
    state.achievements[ach.id] = { earnedAt: Date.now() };
    state.stats.achievementsEarned = (state.stats.achievementsEarned || 0) + 1;

    // Apply reward
    const r = ach.reward;
    if (r.cash)          { state.cash += r.cash; state.totalEarned += r.cash; }
    if (r.clickMult)     { state.clickMultiplier = (state.clickMultiplier || 1) * r.clickMult; }
    if (r.allWorkerMult) { state.allWorkerMultiplier = (state.allWorkerMultiplier || 1) * r.allWorkerMult; }
    if (r.launderMult)   { state.launderMultiplier = (state.launderMultiplier || 1) * r.launderMult; }
    if (r.heatMult)      { state.heatMultiplier = (state.heatMultiplier || 1) * r.heatMult; }
    if (r.allIncomeMult) {
      state.clickMultiplier     = (state.clickMultiplier || 1) * r.allIncomeMult;
      state.allWorkerMultiplier = (state.allWorkerMultiplier || 1) * r.allIncomeMult;
    }

    notifyFn('🏆 Achievement: ' + ach.name, 'achievement');
  }

  function getEarnedCount(state) {
    return Object.values(state.achievements).filter(Boolean).length;
  }

  return { checkAll, award, getEarnedCount };
})();
