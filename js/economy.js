/* Economy - Price fluctuation and income calculations */
const Economy = (() => {

  // Price modifier oscillates sinusoidally ± 25%
  let _priceModifier = 1.0;
  let _priceDirection = 0.001;
  let _pricePhase = 0;

  function tickPrices(deltaSeconds) {
    _pricePhase += deltaSeconds * 0.05; // slow cycle
    _priceModifier = 1 + 0.25 * Math.sin(_pricePhase);
  }

  function getPriceModifier() {
    return _priceModifier;
  }

  /* ── Compute current click value ── */
  function getClickValue(state) {
    const item = GAME_DATA.items.find(i => i.id === state.activeItem);
    if (!item) return 0;

    let base = item.clickValue;

    // Upgrade multipliers
    let clickMult = state.clickMultiplier || 1;

    // Heat penalty
    const heatPenalty = getHeatPenalty(state.heat);

    // District bonuses
    const districtMult = getDistrictClickMult(state);

    // Event modifier
    const eventMult = state.eventMods.incomeMult || 1;

    // Price fluctuation
    const priceMod = _priceModifier;

    return base * clickMult * heatPenalty * districtMult * eventMult * priceMod;
  }

  /* ── Worker income per second ── */
  function getWorkerIncome(state) {
    let total = 0;

    for (const [wId, count] of Object.entries(state.workers)) {
      if (count <= 0) continue;
      const workerDef = GAME_DATA.workers.find(w => w.id === wId);
      if (!workerDef || workerDef.incomePerSec <= 0) continue;

      let income = workerDef.incomePerSec * count;

      // Per-worker upgrade multipliers
      const mult = getWorkerMult(state, wId);
      income *= mult;

      // Global worker multiplier
      income *= (state.allWorkerMultiplier || 1);

      // District bonus
      const distMult = getDistrictWorkerMult(state, wId);
      income *= distMult;

      total += income;
    }

    // Heat penalty applies to worker income too
    total *= getHeatPenalty(state.heat);

    // Event modifier
    total *= (state.eventMods.incomeMult || 1);

    return total;
  }

  /* ── Heat reduction per second from workers ── */
  function getHeatReduction(state) {
    let reduction = 0;
    for (const [wId, count] of Object.entries(state.workers)) {
      if (count <= 0) continue;
      const workerDef = GAME_DATA.workers.find(w => w.id === wId);
      if (workerDef && workerDef.heatReduce > 0) {
        reduction += workerDef.heatReduce * count;
      }
    }
    // Underground district: -50% heat generation (handled at generation side)
    // But also reduces passive heat here
    if (state.districts.underground) reduction += 1;
    return reduction;
  }

  /* ── Laundering rate per second ── */
  function getLaunderRate(state) {
    let rate = 0;

    // From fronts
    for (const [fId, count] of Object.entries(state.fronts)) {
      if (count <= 0) continue;
      const frontDef = GAME_DATA.fronts.find(f => f.id === fId);
      if (frontDef) rate += frontDef.launderPerSec * count;
    }

    // From workers (accountants, lawyers)
    for (const [wId, count] of Object.entries(state.workers)) {
      if (count <= 0) continue;
      const workerDef = GAME_DATA.workers.find(w => w.id === wId);
      if (workerDef && workerDef.launderRate > 0) {
        rate += workerDef.launderRate * count;
      }
    }

    // Upgrade: offshore accounts → efficiency (already in state.launderEfficiency)
    // Launder multiplier from achievements
    rate *= (state.launderMultiplier || 1);

    return rate;
  }

  /* ── Heat generation per click ── */
  function getHeatPerClick(state) {
    const item = GAME_DATA.items.find(i => i.id === state.activeItem);
    if (!item) return 0;
    let h = item.heatPerClick;
    h *= (state.heatMultiplier || 1); // multiplier < 1 reduces heat
    // Underground district halves heat generation
    if (state.districts.underground) h *= 0.5;
    return h;
  }

  /* ── Heat penalty on income ── */
  function getHeatPenalty(heat) {
    if (heat < 25)  return 1.0;
    if (heat < 50)  return 0.9;
    if (heat < 75)  return 0.75;
    if (heat < 90)  return 0.5;
    return 0.25;
  }

  /* ── District multipliers ── */
  function getDistrictClickMult(state) {
    let mult = 1;
    if (state.districts.downtown)   mult *= 1.25;
    if (state.districts.richward)   mult *= 2.0;
    if (state.districts.airport)    mult *= 3.0;
    return mult;
  }

  function getDistrictWorkerMult(state, workerId) {
    let mult = 1;
    if (state.districts.industrial) mult *= 1.5;
    if (state.districts.harbor && workerId === 'smuggler') mult *= 2.0;
    if (state.districts.airport)    mult *= 3.0;
    return mult;
  }

  /* ── Worker upgrade multiplier ── */
  function getWorkerMult(state, workerId) {
    let mult = 1;
    const workerUpgrades = {
      runner:   ['runner_boost'],
      dealer:   ['dealer_phones'],
      chemist:  ['chemist_lab'],
      smuggler: ['smuggler_route']
    };
    const upgList = workerUpgrades[workerId] || [];
    for (const upg of upgList) {
      if (state.upgrades[upg]) {
        const upgDef = GAME_DATA.upgrades.find(u => u.id === upg);
        if (upgDef && upgDef.effect.type === 'workerMult') mult *= upgDef.effect.value;
      }
    }
    return mult;
  }

  /* ── Worker cost (with scaling) ── */
  function getWorkerCost(workerId, currentCount) {
    const def = GAME_DATA.workers.find(w => w.id === workerId);
    if (!def) return Infinity;
    return Math.floor(def.cost * Math.pow(def.costMult, currentCount));
  }

  /* ── Format currency ── */
  function formatCash(n) {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3)  return '$' + (n / 1e3).toFixed(1) + 'K';
    return '$' + Math.floor(n).toLocaleString();
  }

  function formatNumber(n) {
    if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9)  return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6)  return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3)  return (n / 1e3).toFixed(1) + 'K';
    return Math.floor(n).toLocaleString();
  }

  function formatTime(seconds) {
    if (seconds < 60) return Math.floor(seconds) + 's';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ' + (Math.floor(seconds) % 60) + 's';
    return Math.floor(seconds / 3600) + 'h ' + Math.floor((seconds % 3600) / 60) + 'm';
  }

  return {
    tickPrices, getPriceModifier,
    getClickValue, getWorkerIncome, getHeatReduction, getLaunderRate,
    getHeatPerClick, getHeatPenalty,
    getDistrictClickMult, getDistrictWorkerMult, getWorkerMult,
    getWorkerCost, formatCash, formatNumber, formatTime
  };

})();
