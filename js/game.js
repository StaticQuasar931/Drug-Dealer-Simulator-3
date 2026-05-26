/* Game - Core state machine and main loop */
const Game = (() => {

  /* ── Default state ── */
  function defaultState() {
    return {
      // Currency
      cash: 0,
      cleanCash: 0,
      totalEarned: 0,
      totalLaundered: 0,

      // Current product
      activeItem: 'reggie',
      unlockedItems: { reggie: true },

      // Workers {id: count}
      workers: {},

      // Upgrades {id: true}
      upgrades: {},

      // Districts {id: true}
      districts: { school: true },

      // Front businesses {id: count}
      fronts: {},

      // Achievements {id: {earnedAt}}
      achievements: {},

      // Multipliers (recomputed on load)
      clickMultiplier: 1,
      allWorkerMultiplier: 1,
      heatMultiplier: 1,
      launderEfficiency: 0.80,
      launderMultiplier: 1,
      allIncomeMultiplier: 1,

      // Heat
      heat: 0,

      // Event modifiers (transient, reset on load)
      eventMods: { incomeMult: 1 },

      // Stats
      stats: {
        totalClicks: 0,
        totalWorkersHired: 0,
        totalEvents: 0,
        raidssurvived: 0,
        maxHeat: 0,
        districtsUnlocked: 1,
        frontsOwned: 0,
        achievementsEarned: 0,
        itemsUnlocked: 1
      },

      // Time
      startTime: Date.now(),
      lastSave: Date.now(),
      lastTick: Date.now(),
      totalPlayTime: 0,

      // Settings
      settings: Settings.getDefaults(),

      // Actions
      layLowCooldown: 0,
      bribeCooldown: 0
    };
  }

  let state = defaultState();
  let _running = false;
  let _loopId  = null;
  let _lastTickTime = Date.now();
  let _saveTimer = 0;
  let _achTimer  = 0;

  /* ── Notification queue ── */
  const _notifications = [];
  function notify(msg, type = 'info', extra = null) {
    _notifications.push({ msg, type, ts: Date.now(), extra });
    if (_notifications.length > 50) _notifications.shift();
    UI.addNotification(msg, type, extra);
  }

  /* ── Initialize ── */
  function init() {
    // Try to load save
    const saveData = SaveSystem.load();
    if (saveData && saveData.data) {
      state = Object.assign(defaultState(), saveData.data);
      // Restore transient defaults
      state.eventMods = { incomeMult: 1 };
      state.layLowCooldown = 0;
      state.bribeCooldown  = 0;

      // Recompute all multipliers from upgrades
      Production.recomputeMultipliers(state);

      // Calculate offline progress
      const { elapsed, capped } = AntiCheat.validateTimeDelta(saveData.ts, Date.now());
      if (elapsed > 5) {
        processOffline(elapsed);
        if (capped) notify('⏱ Offline progress capped at 12 hours.', 'info');
        else        notify('⏱ Welcome back! ' + Economy.formatTime(elapsed) + ' of offline progress applied.', 'success');
      }
    } else {
      // Fresh game
      state = defaultState();
    }

    Settings.apply(state.settings);
    _lastTickTime = Date.now();
    _running = true;
    _loopId  = requestAnimationFrame(loop);

    UI.init(state);
    UI.render(state);

    // Check content warning
    if (!localStorage.getItem('dds3_warned')) {
      UI.showContentWarning();
    }
  }

  /* ── Process offline progress ── */
  function processOffline(seconds) {
    const workerIncome   = Economy.getWorkerIncome(state);
    const launderRate    = Economy.getLaunderRate(state);
    const heatReduction  = Economy.getHeatReduction(state);

    // Income (workers only offline)
    const earned = workerIncome * seconds;
    state.cash       += earned;
    state.totalEarned += earned;

    // Laundering
    if (launderRate > 0 && state.cash > 0) {
      const launderAmt = Math.min(launderRate * seconds, state.cash);
      state.cash       -= launderAmt;
      state.cleanCash  += launderAmt * (state.launderEfficiency || 0.80);
      state.totalLaundered = (state.totalLaundered || 0) + launderAmt;
    }

    // Heat decay
    const decay = heatReduction * seconds;
    state.heat = Math.max(0, state.heat - decay);
  }

  /* ── Main loop ── */
  function loop() {
    if (!_running) return;
    const now   = Date.now();
    const rawDt = (now - _lastTickTime) / 1000;
    const dt    = AntiCheat.validateTickDelta(rawDt);
    _lastTickTime = now;

    tick(dt);

    // Schedule next frame or throttled update
    const rate = window.__gameUpdateRate || 250;
    setTimeout(() => { _loopId = requestAnimationFrame(loop); }, rate);
  }

  /* ── Per-tick update ── */
  function tick(dt) {
    // Play time
    state.totalPlayTime = (state.totalPlayTime || 0) + dt;

    // Worker income
    const wIncome = Economy.getWorkerIncome(state) * dt;
    if (wIncome > 0) {
      state.cash        += wIncome;
      state.totalEarned += wIncome;
    }

    // Price fluctuation
    Economy.tickPrices(dt);

    // Heat decay from workers
    const heatDecay = Economy.getHeatReduction(state) * dt;
    state.heat = Math.max(0, state.heat - heatDecay);

    // Passive heat generation from active item (ambient)
    const passiveHeat = 0.02 * (Economy.getHeatPerClick(state)) * dt;
    state.heat = Math.min(100, state.heat + passiveHeat);

    // Track max heat
    if (state.heat > (state.stats.maxHeat || 0)) state.stats.maxHeat = state.heat;

    // Raid check at high heat
    if (state.heat >= 90) {
      const raidChance = ((state.heat - 89) / 10) * 0.005 * dt; // ~0.5% per second at 100 heat
      if (Math.random() < raidChance) {
        triggerRaid();
      }
    }

    // Laundering tick
    Laundering.processTick(state, dt);

    // Cooldown timers
    if (state.layLowCooldown > 0) state.layLowCooldown = Math.max(0, state.layLowCooldown - dt);
    if (state.bribeCooldown  > 0) state.bribeCooldown  = Math.max(0, state.bribeCooldown  - dt);

    // Random events
    Events.tick(state, dt, notify);

    // Achievement check (every 3s)
    _achTimer += dt;
    if (_achTimer >= 3) {
      _achTimer = 0;
      Achievements.checkAll(state, notify);
    }

    // Auto-save (every 30s)
    _saveTimer += dt;
    if (_saveTimer >= 30) {
      _saveTimer = 0;
      state.lastSave = Date.now();
      SaveSystem.save(state);
    }

    // Render UI
    UI.render(state);
  }

  /* ── Raid! ── */
  function triggerRaid() {
    const cashLost = state.cash * (0.15 + Math.random() * 0.15);
    state.cash = Math.max(0, state.cash - cashLost);

    const numWorkerLost = Math.floor(Math.random() * 3) + 1;
    const lostNames = [];
    for (let i = 0; i < numWorkerLost; i++) {
      const name = Workers.loseRandomWorker(state);
      if (name) lostNames.push(name);
    }

    state.heat = Math.max(0, state.heat - 40);
    state.stats.raidssurvived = (state.stats.raidssurvived || 0) + 1;

    let msg = '🚔 RAID! Lost ' + Economy.formatCash(cashLost);
    if (lostNames.length > 0) msg += ' & workers: ' + lostNames.join(', ');
    notify(msg, 'raid');
    UI.triggerRaidEffect();
  }

  /* ── Actions ── */
  function deal() {
    const earned = Production.handleClick(state);
    state.totalEarned += 0; // already done in handleClick
    UI.triggerClickEffect(earned);
  }

  function layLow() {
    if (state.layLowCooldown > 0) return notify('Lay Low on cooldown: ' + Math.ceil(state.layLowCooldown) + 's', 'warn');
    const cost = 500;
    const total = state.cash + state.cleanCash;
    if (total < cost) return notify('Need ' + Economy.formatCash(cost) + ' to lay low.', 'warn');
    if (state.cash >= cost) state.cash -= cost;
    else { state.cleanCash -= cost - state.cash; state.cash = 0; }
    state.heat = Math.max(0, state.heat - 20);
    state.layLowCooldown = 120;
    notify('Laying low. -20 heat.', 'success');
  }

  function bribe() {
    if (state.bribeCooldown > 0) return notify('Bribe on cooldown: ' + Math.ceil(state.bribeCooldown) + 's', 'warn');
    const cost = 2000;
    const total = state.cash + state.cleanCash;
    if (total < cost) return notify('Need ' + Economy.formatCash(cost) + ' to bribe.', 'warn');
    if (state.cash >= cost) state.cash -= cost;
    else { state.cleanCash -= cost - state.cash; state.cash = 0; }
    state.heat = Math.max(0, state.heat - 35);
    state.bribeCooldown = 300;
    notify('Bribed the cops. -35 heat.', 'success');
  }

  function hireWorker(workerId) {
    const result = Workers.hire(state, workerId);
    if (result.success) notify('Hired: ' + result.name + ' (' + Economy.formatCash(result.cost) + ')', 'success');
    else notify(result.reason, 'warn');
  }

  function buyUpgrade(upgradeId) {
    const result = Production.purchaseUpgrade(state, upgradeId);
    if (result.success) notify('Upgrade: ' + result.name, 'success');
    else notify(result.reason, 'warn');
  }

  function buyFront(frontId) {
    const result = Laundering.purchaseFront(state, frontId);
    if (result.success) notify('Opened: ' + result.name, 'success');
    else notify(result.reason, 'warn');
  }

  function unlockDistrict(districtId) {
    const result = Map.unlockDistrict(state, districtId);
    if (result.success) notify('Territory claimed: ' + result.name + '!', 'success');
    else notify(result.reason, 'warn');
  }

  function unlockItem(itemId) {
    if (state.unlockedItems[itemId]) {
      // Already unlocked - just switch
      Production.switchItem(state, itemId);
      return;
    }
    const ok = Production.tryUnlockItem(state, itemId);
    if (ok) {
      const item = GAME_DATA.items.find(i => i.id === itemId);
      notify('Unlocked: ' + item.name + '!', 'success');
    } else {
      const item = GAME_DATA.items.find(i => i.id === itemId);
      notify('Need ' + Economy.formatCash(item.unlockCash) + ' total earned.', 'warn');
    }
  }

  function updateSettings(key, value) {
    state.settings[key] = value;
    Settings.apply(state.settings);
  }

  function manualSave() {
    state.lastSave = Date.now();
    SaveSystem.save(state);
    notify('Game saved!', 'success');
  }

  function resetGame() {
    if (confirm('Reset ALL progress? This cannot be undone!')) {
      SaveSystem.deleteSave();
      state = defaultState();
      Production.recomputeMultipliers(state);
      Settings.apply(state.settings);
      notify('Game reset.', 'info');
      UI.render(state);
    }
  }

  function resolveEventChoice(accept) {
    Events.resolveChoice(state, accept, notify);
  }

  function getState() { return state; }

  /* ── Admin panel ── */
  function adminAddCash(amount) {
    state.cash += amount;
    state.totalEarned += amount;
  }
  function adminSetHeat(h) { state.heat = Math.min(100, Math.max(0, h)); }
  function adminUnlockAll() {
    GAME_DATA.items.forEach(i => { state.unlockedItems[i.id] = true; });
    GAME_DATA.districts.forEach(d => { state.districts[d.id] = true; });
    GAME_DATA.fronts.forEach(f => { state.fronts[f.id] = (state.fronts[f.id] || 0) + 1; });
    Production.recomputeMultipliers(state);
    notify('Admin: All unlocked', 'info');
  }

  return {
    init, getState,
    deal, layLow, bribe, hireWorker, buyUpgrade, buyFront, unlockDistrict, unlockItem,
    updateSettings, manualSave, resetGame, resolveEventChoice,
    adminAddCash, adminSetHeat, adminUnlockAll,
    notify
  };

})();

// Boot
window.addEventListener('DOMContentLoaded', () => Game.init());
