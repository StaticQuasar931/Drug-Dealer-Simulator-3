'use strict';
/* ── Workers ── */
const Workers = (() => {

  function hire(state, workerId) {
    const w = WORKERS.find(x => x.id === workerId);
    if (!w) return { ok:false, reason:'Unknown worker' };
    const count = state.workers[workerId] || 0;
    const cost  = Economy.workerCost(workerId, count);
    if ((state.cash + state.cleanCash) < cost) return { ok:false, reason:`Need ${Economy.fmt(cost)}` };
    Production.deductCash(state, cost);
    state.workers[workerId] = count + 1;
    state.stats.totalHired = (state.stats.totalHired||0) + 1;
    return { ok:true, name:w.name, cost };
  }

  function total(state) {
    return Object.values(state.workers).reduce((s,n) => s+n, 0);
  }

  function loseOne(state) {
    const pool = Object.entries(state.workers).filter(([,n]) => n > 0).map(([id]) => id);
    if (!pool.length) return null;
    const id = pool[Math.floor(Math.random() * pool.length)];
    state.workers[id]--;
    return WORKERS.find(x => x.id === id)?.name || id;
  }

  return { hire, total, loseOne };
})();
