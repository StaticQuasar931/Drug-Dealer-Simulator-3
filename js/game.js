'use strict';
/* ── Game — state, loop, actions ── */
const Game = (() => {

  /* ── Default state ── */
  function fresh() {
    return {
      cash: 0, cleanCash: 0, totalEarned: 0, totalLaundered: 0,
      activeProduct: 'vape_disp',
      unlockedProducts: { vape_disp: true },
      stock: {},
      production: { progress: 0 },
      workers: {},
      upgrades: {},
      territories: { school: true },
      fronts: {},
      achievements: {},
      mods: { priceMult: 1, produceMult: 1 },
      // Computed multipliers (recomputed from upgrades on load)
      produceSpeedMult: 1, sellPriceBonus: 1, heatMult: 1,
      launderEfficiency: 0.80, sellRateMult: 1, produceRateMult: 1,
      batchMult: 1, launderRateMult: 1,
      heat: 0,
      layLowCd: 0, bribeCd: 0,
      startTime: Date.now(), lastSave: Date.now(), totalPlayTime: 0,
      settings: Settings.getDefaults(),
      stats: { totalSales:0, totalProduced:0, totalSalesCash:0, maxHeat:0, totalHired:0,
               totalFronts:0, raidsSurvived:0, totalEvents:0, achEarned:0,
               territoriesUnlocked:1, productsUnlocked:1 }
    };
  }

  let G  = fresh();
  let _running = false;
  let _lastTick = Date.now();
  let _saveTimer = 0;
  let _achTimer  = 0;

  /* ── Notify ── */
  function notify(msg, type='info', extra=null) {
    UI.addNotif(msg, type, extra);
  }

  /* ── Init ── */
  function init() {
    const save = SaveSystem.load();
    if (save?.data) {
      G = Object.assign(fresh(), save.data);
      G.mods = { priceMult:1, produceMult:1 }; // reset transient event mods
      G.layLowCd = 0; G.bribeCd = 0;
      Production.recompute(G);

      // Offline progress
      const { elapsed, capped } = AntiCheat.validateTimeDelta(save.ts, Date.now());
      if (elapsed > 5) {
        _applyOffline(elapsed);
        notify(capped
          ? '⏱ Offline progress capped at 12 hours.'
          : `⏱ Welcome back! ${Economy.fmtTime(elapsed)} of idle income applied.`,
          'info');
      }
    }

    Settings.apply(G.settings);
    _lastTick = Date.now();
    _running  = true;
    _loop();

    UI.init();
    UI.render(G);

    if (!localStorage.getItem('dds3_warned')) UI.showWarning();
  }

  function _applyOffline(secs) {
    const sellRate = Economy.getAutoSellRate(G);
    const price    = Economy.getSellPrice(G, G.activeProduct);
    const laundRate= Economy.getLaunderRate(G);
    const heatRed  = Economy.getHeatReduction(G);

    // Sell existing stock offline
    const canSell = Math.min(sellRate * secs, G.stock[G.activeProduct] || 0);
    if (canSell > 0) {
      G.stock[G.activeProduct] = Math.max(0, (G.stock[G.activeProduct]||0) - canSell);
      const earned = canSell * price * 0.5; // 50% offline efficiency
      G.cash += earned; G.totalEarned += earned;
    }

    // Laundering
    const laundAmt = Math.min(laundRate * secs * 0.5, G.cash);
    if (laundAmt > 0) {
      G.cash -= laundAmt;
      G.cleanCash += laundAmt * (G.launderEfficiency||0.80);
      G.totalLaundered = (G.totalLaundered||0) + laundAmt;
    }

    // Heat decay
    G.heat = Math.max(0, G.heat - heatRed * secs);
  }

  /* ── Main loop ── */
  function _loop() {
    if (!_running) return;
    const now = Date.now();
    const dt  = AntiCheat.validateTickDelta((now - _lastTick) / 1000);
    _lastTick = now;
    _tick(dt);
    const rate = window.__updateRate || 200;
    setTimeout(() => requestAnimationFrame(_loop), rate);
  }

  function _tick(dt) {
    G.totalPlayTime = (G.totalPlayTime||0) + dt;

    // Production (auto-fill bar from workers)
    Production.tickProduce(G, dt);

    // Auto-sell
    Production.tickSell(G, dt);

    // Price fluctuation
    Economy.tickPrices(dt);

    // Heat decay from security workers
    const decay = Economy.getHeatReduction(G) * dt;
    G.heat = Math.max(0, G.heat - decay);

    // Ambient heat (small passive increase from being active)
    const prod = PRODUCTS.find(p => p.id === G.activeProduct);
    if (prod) G.heat = Math.min(100, G.heat + prod.heatPerSale * 0.01 * dt);

    // Raid check
    if (G.heat >= 90) {
      const raidP = ((G.heat - 89)/10) * 0.004 * dt;
      if (Math.random() < raidP) _raid();
    }

    // Laundering tick
    Laundering.tick(G, dt);

    // Cooldowns
    if (G.layLowCd > 0) G.layLowCd = Math.max(0, G.layLowCd - dt);
    if (G.bribeCd  > 0) G.bribeCd  = Math.max(0, G.bribeCd  - dt);

    // Events
    Events.tick(G, dt, notify);

    // Achievements (every 3s)
    _achTimer += dt;
    if (_achTimer >= 3) { _achTimer = 0; Achievements.check(G, notify); }

    // Auto-save (every 30s)
    _saveTimer += dt;
    if (_saveTimer >= 30) { _saveTimer = 0; G.lastSave = Date.now(); SaveSystem.save(G); }

    UI.render(G);
  }

  function _raid() {
    const lost = G.cash * (0.15 + Math.random() * 0.15);
    G.cash = Math.max(0, G.cash - lost);
    const lostW = [];
    const numW = Math.floor(Math.random()*2) + 1;
    for (let i=0; i<numW; i++) { const n = Workers.loseOne(G); if(n) lostW.push(n); }
    G.heat = Math.max(0, G.heat - 38);
    G.stats.raidsSurvived = (G.stats.raidsSurvived||0) + 1;
    notify(`🚔 RAID! Lost ${Economy.fmt(lost)}${lostW.length?' & '+lostW.join(', '):''}`, 'raid');
    UI.raidFlash();
  }

  /* ══════════ PUBLIC ACTIONS ══════════ */

  function produce() {
    const qty = Production.manualProduce(G);
    if (qty > 0) UI.produceEffect(qty);
  }

  function sellOne() {
    const earned = Production.sell(G, G.activeProduct, 1);
    if (earned > 0) UI.sellEffect(Economy.fmt(earned));
  }

  function sellAll() {
    const avail = Math.floor(G.stock[G.activeProduct] || 0);
    if (avail <= 0) { notify('No stock to sell!', 'warn'); return; }
    const earned = Production.sell(G, G.activeProduct, avail);
    if (earned > 0) UI.sellEffect(Economy.fmt(earned));
  }

  function switchProduct(id) {
    const res = Production.unlock(G, id);
    if (res.ok) {
      const p = PRODUCTS.find(x => x.id === id);
      notify(res.switched ? `Switched to ${p.name}` : `🆕 Unlocked ${p.name}!`, 'success');
    } else {
      notify(res.reason, 'warn');
    }
  }

  function hireWorker(id) {
    const res = Workers.hire(G, id);
    if (res.ok) notify(`Hired ${res.name} (${Economy.fmt(res.cost)})`, 'success');
    else notify(res.reason, 'warn');
  }

  function buyUpgrade(id) {
    const res = Production.buyUpgrade(G, id);
    if (res.ok) notify(`✅ Upgrade: ${res.name}`, 'success');
    else notify(res.reason, 'warn');
  }

  function buyFront(id) {
    const res = Laundering.buyFront(G, id);
    if (res.ok) notify(`🏪 Opened: ${res.name} (${Economy.fmt(res.cost)})`, 'success');
    else notify(res.reason, 'warn');
  }

  function claimTerritory(id) {
    const res = Map.unlock(G, id);
    if (res.ok) notify(`🗺️ Territory claimed: ${res.name}!`, 'success');
    else notify(res.reason, 'warn');
  }

  function layLow() {
    if (G.layLowCd > 0) { notify(`Lay Low: ${Math.ceil(G.layLowCd)}s cooldown`, 'warn'); return; }
    const cost = 500;
    if ((G.cash+G.cleanCash) < cost) { notify(`Need ${Economy.fmt(cost)}`, 'warn'); return; }
    Production.deductCash(G, cost);
    G.heat = Math.max(0, G.heat - 22);
    G.layLowCd = 120;
    notify('🕶️ Laying low. -22 heat.', 'success');
  }

  function bribe() {
    if (G.bribeCd > 0) { notify(`Bribe: ${Math.ceil(G.bribeCd)}s cooldown`, 'warn'); return; }
    const cost = 2000;
    if ((G.cash+G.cleanCash) < cost) { notify(`Need ${Economy.fmt(cost)}`, 'warn'); return; }
    Production.deductCash(G, cost);
    G.heat = Math.max(0, G.heat - 38);
    G.bribeCd = 300;
    notify('💰 Bribed the cops. -38 heat.', 'success');
  }

  function resolveChoice(accept) { Events.resolveChoice(G, accept, notify); }

  function saveSetting(k, v) { G.settings[k] = v; Settings.apply(G.settings); }

  function manualSave() { G.lastSave = Date.now(); SaveSystem.save(G); notify('💾 Saved!', 'success'); }

  function resetGame() {
    if (!confirm('Reset ALL progress? This cannot be undone!')) return;
    SaveSystem.deleteSave();
    G = fresh();
    Production.recompute(G);
    Settings.apply(G.settings);
    UI.render(G);
    notify('Game reset.', 'info');
  }

  /* Admin */
  function adminCash(n)    { G.cash += n; G.totalEarned += n; }
  function adminHeat(n)    { G.heat = Math.min(100, Math.max(0,n)); }
  function adminUnlockAll(){ PRODUCTS.forEach(p => { G.unlockedProducts[p.id]=true; }); TERRITORIES.forEach(t=>{G.territories[t.id]=true;}); FRONTS.forEach(f=>{G.fronts[f.id]=(G.fronts[f.id]||0)+1;}); Production.recompute(G); notify('Admin: All unlocked','info'); }

  function getState() { return G; }

  return {
    init, getState,
    produce, sellOne, sellAll, switchProduct,
    hireWorker, buyUpgrade, buyFront, claimTerritory,
    layLow, bribe, resolveChoice,
    saveSetting, manualSave, resetGame,
    adminCash, adminHeat, adminUnlockAll,
    notify
  };
})();

window.addEventListener('DOMContentLoaded', () => Game.init());
