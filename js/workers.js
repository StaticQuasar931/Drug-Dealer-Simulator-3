/* Workers - Hiring and management */
const Workers = (() => {

  function hire(state, workerId) {
    const count = state.workers[workerId] || 0;
    const cost  = Economy.getWorkerCost(workerId, count);
    const workerDef = GAME_DATA.workers.find(w => w.id === workerId);
    if (!workerDef) return { success: false, reason: 'Unknown worker' };

    const totalCash = state.cash + state.cleanCash;
    if (totalCash < cost) return { success: false, reason: 'Not enough cash' };

    // Deduct from dirty cash first, then clean
    if (state.cash >= cost) {
      state.cash -= cost;
    } else {
      const remainder = cost - state.cash;
      state.cash = 0;
      state.cleanCash -= remainder;
    }

    state.workers[workerId] = count + 1;
    state.stats.totalWorkersHired = (state.stats.totalWorkersHired || 0) + 1;

    return { success: true, cost, name: workerDef.name };
  }

  function getTotalWorkers(state) {
    return Object.values(state.workers).reduce((a, b) => a + b, 0);
  }

  function getWorkerCount(state, workerId) {
    return state.workers[workerId] || 0;
  }

  function loseRandomWorker(state) {
    const available = Object.entries(state.workers)
      .filter(([, count]) => count > 0)
      .map(([id]) => id);
    if (available.length === 0) return null;
    const pick = available[Math.floor(Math.random() * available.length)];
    state.workers[pick]--;
    const def = GAME_DATA.workers.find(w => w.id === pick);
    return def ? def.name : pick;
  }

  return { hire, getTotalWorkers, getWorkerCount, loseRandomWorker };
})();
