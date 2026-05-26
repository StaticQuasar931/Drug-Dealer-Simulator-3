'use strict';
/* ── UI — render, effects, modals ── */
const UI = (() => {

  let _rTab = 'workers'; // right panel tab
  let _floatId = 0;
  let _initialized = false;

  /* ══════════ INIT ══════════ */
  function init() {
    if (_initialized) return;
    _initialized = true;

    // Right-panel tabs
    document.querySelectorAll('[data-rtab]').forEach(btn => {
      btn.addEventListener('click', () => {
        _rTab = btn.dataset.rtab;
        document.querySelectorAll('[data-rtab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _renderRightPanel(Game.getState());
      });
    });

    // Produce / Sell buttons
    document.getElementById('produce-btn')?.addEventListener('click', () => Game.produce());
    document.getElementById('sell-one-btn')?.addEventListener('click', () => Game.sellOne());
    document.getElementById('sell-all-btn')?.addEventListener('click', () => Game.sellAll());

    // Heat actions
    document.getElementById('lay-low-btn')?.addEventListener('click', () => Game.layLow());
    document.getElementById('bribe-btn')?.addEventListener('click', () => Game.bribe());
    document.getElementById('lay-low-btn-f')?.addEventListener('click', () => Game.layLow());
    document.getElementById('bribe-btn-f')?.addEventListener('click', () => Game.bribe());

    // Header actions
    document.getElementById('save-btn')?.addEventListener('click', () => Game.manualSave());
    document.getElementById('settings-btn')?.addEventListener('click', () => toggleModal('settings-modal'));

    // Product list — event delegation
    document.getElementById('product-list')?.addEventListener('click', e => {
      const card = e.target.closest('[data-product-id]');
      if (card) Game.switchProduct(card.dataset.productId);
    });

    // Right panel — event delegation (reattached each render via _bindRight)
    _setupRightDelegation();

    // Admin
    _setupAdmin();

    // Modal backdrops
    document.querySelectorAll('.modal-backdrop').forEach(el => {
      el.addEventListener('click', e => { if (e.target === el) el.classList.add('hidden'); });
    });

    // Event choice buttons
    document.getElementById('choice-accept')?.addEventListener('click', () => Game.resolveChoice(true));
    document.getElementById('choice-refuse')?.addEventListener('click', () => Game.resolveChoice(false));
  }

  function _setupRightDelegation() {
    const panel = document.getElementById('right-panel-content');
    if (!panel) return;
    panel.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn || btn.disabled) return;
      const { action, id } = btn.dataset;
      if (action === 'hire')      Game.hireWorker(id);
      if (action === 'upgrade')   Game.buyUpgrade(id);
      if (action === 'front')     Game.buyFront(id);
      if (action === 'territory') Game.claimTerritory(id);
    });
  }

  function _setupAdmin() {
    const konami = [38,38,40,40,37,39,37,39,66,65];
    let idx = 0;
    document.addEventListener('keydown', e => {
      idx = e.keyCode === konami[idx] ? idx + 1 : 0;
      if (idx === konami.length) { idx = 0; toggleModal('admin-modal'); }
    });
    document.getElementById('admin-1k')?.addEventListener('click',       () => Game.adminCash(1000));
    document.getElementById('admin-1m')?.addEventListener('click',       () => Game.adminCash(1000000));
    document.getElementById('admin-1b')?.addEventListener('click',       () => Game.adminCash(1000000000));
    document.getElementById('admin-heat0')?.addEventListener('click',    () => Game.adminHeat(0));
    document.getElementById('admin-heat100')?.addEventListener('click',  () => Game.adminHeat(100));
    document.getElementById('admin-unlock')?.addEventListener('click',   () => Game.adminUnlockAll());
    document.getElementById('admin-reset')?.addEventListener('click',    () => Game.resetGame());
  }

  /* ══════════ MAIN RENDER ══════════ */
  function render(state) {
    _renderHeader(state);
    _renderCenter(state);
    _renderProductList(state);
    _renderRightPanel(state);
    _renderHeat(state);
    _renderEventChoice(state);
  }

  /* ── Header ── */
  function _renderHeader(state) {
    _t('hdr-dirty',   Economy.fmt(state.cash));
    _t('hdr-clean',   Economy.fmt(state.cleanCash));
    _t('hdr-earned',  Economy.fmt(state.totalEarned));
    _t('hdr-income',  Economy.fmt(Economy.getAutoSellRate(state) * Economy.getSellPrice(state, state.activeProduct)) + '/s');
    _t('hdr-launder', Economy.fmt(Economy.getLaunderRate(state)) + '/s');

    // Mini heat chip
    const h = state.heat;
    const chip = document.getElementById('hdr-heat');
    if (chip) {
      const [label, cls] = h < 25 ? ['😎 Cool','heat-cool'] :
                           h < 50 ? ['👀 Notice','heat-warm'] :
                           h < 75 ? ['🚨 Hot','heat-hot'] :
                           h < 90 ? ['🔴 Danger','heat-danger'] :
                                    ['💀 RAID!','heat-raid'];
      chip.textContent = label;
      chip.className = 'hdr-heat-chip ' + cls;
    }
  }

  /* ── Center produce/sell panel ── */
  function _renderCenter(state) {
    const prod = PRODUCTS.find(p => p.id === state.activeProduct);
    if (!prod) return;

    // Drug icon
    const iconEl = document.getElementById('active-drug-icon');
    if (iconEl) iconEl.innerHTML = ICONS[prod.id] || prod.emoji;

    // Name + flavor
    _t('active-drug-name',   prod.name);
    _t('active-drug-tier',   'Tier ' + prod.tier + ' · ' + (CATEGORIES[prod.cat]?.name || prod.cat));
    _t('active-drug-flavor', prod.flavor);

    // Progress bar
    const progress = Math.min(1, state.production.progress || 0);
    const bar = document.getElementById('produce-bar-fill');
    if (bar) bar.style.width = (progress * 100).toFixed(1) + '%';

    const barRate = Economy.getProduceBarRate(state);
    const pText = progress >= 1
      ? '✓ Ready to produce!'
      : barRate > 0
        ? `${(progress * 100).toFixed(0)}% — ~${((1 - progress) / barRate).toFixed(1)}s`
        : `${(progress * 100).toFixed(0)}% — click PRODUCE`;
    _t('produce-bar-label', pText);

    // Stock + sell info
    const stock = Math.floor(state.stock[state.activeProduct] || 0);
    const price = Economy.getSellPrice(state, state.activeProduct);
    _t('stock-count',   stock.toLocaleString() + ' units');
    _t('sell-price-val', Economy.fmt(price) + ' / unit');
    _t('total-val',      stock > 0 ? 'Total: ' + Economy.fmt(price * stock) : '');

    // Sell buttons
    const noStock = stock <= 0;
    const sellOne = document.getElementById('sell-one-btn');
    const sellAll = document.getElementById('sell-all-btn');
    if (sellOne) sellOne.disabled = noStock;
    if (sellAll) { sellAll.disabled = noStock; _t('sell-all-label', `Sell All (${stock})`); }

    // Market ticker
    const mod = Economy.getPriceMod();
    const pct = Math.round((mod - 1) * 100);
    const ticker = document.getElementById('market-ticker');
    if (ticker) {
      if (pct > 5)       ticker.innerHTML = `Market: <span class="price-up">▲ +${pct}% HOT</span>`;
      else if (pct < -5) ticker.innerHTML = `Market: <span class="price-down">▼ ${pct}% Slow</span>`;
      else               ticker.textContent = 'Market: Normal';
    }

    // Action button cooldowns
    const ll = state.layLowCd > 0;
    const br = state.bribeCd  > 0;
    ['lay-low-btn','lay-low-btn-f'].forEach(id => {
      const b = document.getElementById(id);
      if (!b) return;
      b.disabled = ll;
      b.textContent = ll ? `Lay Low (${Math.ceil(state.layLowCd)}s)` : '🕶️ Lay Low';
    });
    ['bribe-btn','bribe-btn-f'].forEach(id => {
      const b = document.getElementById(id);
      if (!b) return;
      b.disabled = br;
      b.textContent = br ? `Bribe (${Math.ceil(state.bribeCd)}s)` : '💰 Bribe';
    });

    // Active events
    const evEl = document.getElementById('active-events');
    if (evEl) {
      const active = Events.getActive();
      evEl.innerHTML = active.map(ev =>
        `<span class="event-badge">${ev.icon} ${ev.name} (${Math.ceil(ev.remaining)}s)</span>`
      ).join('');
    }
  }

  /* ── Left: product list ── */
  function _renderProductList(state) {
    const list = document.getElementById('product-list');
    if (!list) return;

    let html = '';
    const catOrder = ['vapes','weed','psychedelics','pills','hard','black_market'];

    for (const cat of catOrder) {
      const prods = PRODUCTS.filter(p => p.cat === cat);
      const meta  = CATEGORIES[cat] || { name: cat, color:'#888', emoji:'📦' };

      // Category header — only show if any product is visible
      const anyVisible = prods.some(p => {
        if (p.unlockCost === 0) return true;
        return state.totalEarned >= p.unlockCost * 0.5 || state.unlockedProducts[p.id];
      });
      if (!anyVisible) continue;

      html += `<div class="cat-header" style="border-left-color:${meta.color}">${meta.emoji} ${meta.name}</div>`;

      for (const p of prods) {
        const unlocked = !!state.unlockedProducts[p.id];
        const isActive = state.activeProduct === p.id;
        const canSee   = p.unlockCost === 0 || state.totalEarned >= p.unlockCost * 0.5 || unlocked;
        if (!canSee) continue;

        const canUnlock = state.totalEarned >= p.unlockCost;
        const stock = Math.floor(state.stock[p.id] || 0);

        let cls = 'product-card';
        if (isActive)              cls += ' product-card--active';
        else if (!unlocked)        cls += ' product-card--locked';
        if (!unlocked && canUnlock) cls += ' product-card--can-unlock';

        const statusLabel = isActive
          ? '<span class="prod-badge prod-badge--active">ACTIVE</span>'
          : unlocked
            ? '<span class="prod-badge">Switch</span>'
            : canUnlock
              ? '<span class="prod-badge prod-badge--unlock">Unlock</span>'
              : `<span class="prod-badge prod-badge--cost">${Economy.fmt(p.unlockCost)}</span>`;

        const stockBadge = unlocked && stock > 0
          ? `<span class="prod-stock">${stock}</span>` : '';

        html += `<div class="${cls}" data-product-id="${p.id}">
          <div class="product-card__icon" style="background:${p.color}22">${ICONS[p.id] || p.emoji}</div>
          <div class="product-card__info">
            <div class="product-card__name">${p.name}${stockBadge}</div>
            <div class="product-card__price">${Economy.fmt(p.basePrice)}/unit${isActive ? ' · T'+p.tier : ''}</div>
          </div>
          <div class="product-card__action">${statusLabel}</div>
        </div>`;
      }
    }

    list.innerHTML = html;
  }

  /* ── Right panel ── */
  function _renderRightPanel(state) {
    const panel = document.getElementById('right-panel-content');
    if (!panel) return;

    switch (_rTab) {
      case 'workers':     panel.innerHTML = _buildWorkers(state);      break;
      case 'upgrades':    panel.innerHTML = _buildUpgrades(state);     break;
      case 'fronts':      panel.innerHTML = _buildFronts(state);       break;
      case 'territories': panel.innerHTML = _buildTerritories(state);  break;
      case 'stats':       panel.innerHTML = _buildStats(state);        break;
      case 'achievements':panel.innerHTML = _buildAchievements(state); break;
    }
  }

  function _buildWorkers(state) {
    const total = Workers.total(state);
    let html = `<div class="section-title">Workers <span class="section-count">${total} total</span></div>`;

    for (const w of WORKERS) {
      const count = state.workers[w.id] || 0;
      const cost  = Economy.workerCost(w.id, count);
      const canAfford = (state.cash + state.cleanCash) >= cost;
      const visible = canAfford || count > 0 || state.totalEarned >= cost * 0.15;
      if (!visible) continue;

      const effects = [];
      if (w.produceRate > 0) effects.push(`+${w.produceRate}/s produce`);
      if (w.sellRate    > 0) effects.push(`+${w.sellRate}/s sell`);
      if (w.heatReduce  > 0) effects.push(`-${w.heatReduce} heat/s`);
      if (w.launderRate > 0) effects.push(`+${Economy.fmt(w.launderRate)}/s launder`);

      html += `<button class="worker-card${canAfford ? '' : ' faded'}" data-action="hire" data-id="${w.id}"${canAfford ? '' : ' disabled'}>
        <span class="card-icon">${w.emoji}</span>
        <span class="card-body">
          <span class="card-name">${w.name}<span class="card-count">[${count}]</span></span>
          <span class="card-desc">${effects.join(' · ')}</span>
        </span>
        <span class="card-cost${canAfford ? ' can-afford' : ''}">${Economy.fmt(cost)}</span>
      </button>`;
    }
    return html;
  }

  function _buildUpgrades(state) {
    let html = '<div class="section-title">Upgrades</div>';
    let anyVisible = false;

    for (const upg of UPGRADES) {
      const bought = !!state.upgrades[upg.id];
      const meetsReq = _upgradeReqMet(state, upg);
      const canAfford = (state.cash + state.cleanCash) >= upg.cost;
      if (!bought && !meetsReq) continue;
      anyVisible = true;

      if (bought) {
        html += `<div class="upgrade-card upgrade-card--bought">
          <span class="card-icon">${upg.emoji}</span>
          <span class="card-body">
            <span class="card-name">${upg.name}</span>
            <span class="card-desc">${upg.desc}</span>
          </span>
          <span class="card-cost owned">✓</span>
        </div>`;
      } else {
        html += `<button class="upgrade-card${canAfford ? '' : ' faded'}" data-action="upgrade" data-id="${upg.id}"${canAfford ? '' : ' disabled'}>
          <span class="card-icon">${upg.emoji}</span>
          <span class="card-body">
            <span class="card-name">${upg.name}</span>
            <span class="card-desc">${upg.desc}</span>
          </span>
          <span class="card-cost${canAfford ? ' can-afford' : ''}">${Economy.fmt(upg.cost)}</span>
        </button>`;
      }
    }

    if (!anyVisible) html += '<div class="empty-hint">Earn more to unlock upgrades.</div>';
    return html;
  }

  function _upgradeReqMet(state, upg) {
    const req = upg.req;
    if (!req) return true;
    if (req.totalEarned && state.totalEarned < req.totalEarned * 0.5) return false;
    if (req.workers) {
      for (const [wId, needed] of Object.entries(req.workers)) {
        if ((state.workers[wId] || 0) < Math.ceil(needed * 0.5)) return false;
      }
    }
    return true;
  }

  function _buildFronts(state) {
    const laundRate = Economy.getLaunderRate(state);
    const eff = Math.round((state.launderEfficiency || 0.80) * 100);
    let html = `<div class="section-title">Laundering Fronts</div>
    <div class="launder-summary">
      <span>💧 Rate: ${Economy.fmt(laundRate)}/s</span>
      <span>✂️ Keep: ${eff}%</span>
    </div>`;

    for (const f of FRONTS) {
      const count    = state.fronts[f.id] || 0;
      const cost     = Laundering.frontCost(state, f.id);
      const canAfford = (state.cash + state.cleanCash) >= cost;
      const visible  = canAfford || count > 0 || state.totalEarned >= cost * 0.15;
      if (!visible) continue;

      html += `<button class="front-card${canAfford ? '' : ' faded'}" data-action="front" data-id="${f.id}"${canAfford ? '' : ' disabled'}>
        <span class="card-icon">${f.emoji}</span>
        <span class="card-body">
          <span class="card-name">${f.name}<span class="card-count">[${count}]</span></span>
          <span class="card-desc">${Economy.fmt(f.rate)}/s each${count > 0 ? ' · '+Economy.fmt(f.rate*count)+'/s total' : ''}</span>
        </span>
        <span class="card-cost${canAfford ? ' can-afford' : ''}">${Economy.fmt(cost)}</span>
      </button>`;
    }
    return html;
  }

  function _buildTerritories(state) {
    let html = `<div class="section-title">Territories <span class="section-count">${Map.count(state)}/${TERRITORIES.length}</span></div>`;

    for (const t of TERRITORIES) {
      const owned = !!state.territories[t.id];
      const canUnlock = state.totalEarned >= t.unlockCost;
      const claimFee  = Math.floor(t.unlockCost * 0.1);
      const canAfford = owned || claimFee === 0 || (state.cash + state.cleanCash) >= claimFee;

      const bonusLines = Object.entries(t.bonus)
        .filter(([,v]) => v !== 1)
        .map(([k,v]) => {
          const pct = v > 1 ? `+${Math.round((v-1)*100)}%` : `-${Math.round((1-v)*100)}%`;
          const labels = { sellPrice:'sell price', produceSpeed:'produce speed', sellRate:'auto-sell rate', heatMult:'heat gen' };
          return pct + ' ' + (labels[k] || k);
        }).join(', ');

      html += `<button class="territory-card${owned ? ' owned' : canUnlock && canAfford ? '' : ' faded'}"
          data-action="territory" data-id="${t.id}"${owned || !canUnlock ? ' disabled' : ''}>
        <span class="card-icon">${t.emoji}</span>
        <span class="card-body">
          <span class="card-name">${t.name}</span>
          <span class="card-desc">${bonusLines || 'Starting territory'}</span>
          ${!owned && t.unlockCost > 0 ? `<span class="card-req">Req: ${Economy.fmt(t.unlockCost)} earned</span>` : ''}
        </span>
        <span class="card-cost${owned ? ' owned' : canUnlock && canAfford ? ' can-afford' : ''}">
          ${owned ? '✓ Owned' : canUnlock ? Economy.fmt(claimFee)+' claim' : Economy.fmt(t.unlockCost)+' needed'}
        </span>
      </button>`;
    }
    return html;
  }

  function _buildStats(state) {
    const sellRate = Economy.getAutoSellRate(state);
    const sellPrice = Economy.getSellPrice(state, state.activeProduct);
    return `<div class="section-title">Statistics</div>
    <div class="stats-grid">
      <div class="stat-row"><span class="stat-label">Total Sales</span><span class="stat-val">${(state.stats.totalSales||0).toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">Total Earned</span><span class="stat-val">${Economy.fmt(state.totalEarned)}</span></div>
      <div class="stat-row"><span class="stat-label">Total Laundered</span><span class="stat-val">${Economy.fmt(state.totalLaundered||0)}</span></div>
      <div class="stat-row"><span class="stat-label">Units Produced</span><span class="stat-val">${(state.stats.totalProduced||0).toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">Auto-Sell Rate</span><span class="stat-val">${sellRate.toFixed(2)}/s</span></div>
      <div class="stat-row"><span class="stat-label">Income Rate</span><span class="stat-val">${Economy.fmt(sellRate*sellPrice)}/s</span></div>
      <div class="stat-row"><span class="stat-label">Launder Rate</span><span class="stat-val">${Economy.fmt(Economy.getLaunderRate(state))}/s</span></div>
      <div class="stat-row"><span class="stat-label">Heat Reduction</span><span class="stat-val">${Economy.getHeatReduction(state).toFixed(1)}/s</span></div>
      <div class="stat-row"><span class="stat-label">Workers</span><span class="stat-val">${Workers.total(state)}</span></div>
      <div class="stat-row"><span class="stat-label">Raids Survived</span><span class="stat-val">${state.stats.raidsSurvived||0}</span></div>
      <div class="stat-row"><span class="stat-label">Events Triggered</span><span class="stat-val">${state.stats.totalEvents||0}</span></div>
      <div class="stat-row"><span class="stat-label">Achievements</span><span class="stat-val">${Achievements.earnedCount(state)}/${ACHIEVEMENTS.length}</span></div>
      <div class="stat-row"><span class="stat-label">Play Time</span><span class="stat-val">${Economy.fmtTime(state.totalPlayTime||0)}</span></div>
    </div>`;
  }

  function _buildAchievements(state) {
    const earned = Achievements.earnedCount(state);
    let html = `<div class="section-title">Achievements <span class="section-count">${earned}/${ACHIEVEMENTS.length}</span></div>`;

    for (const a of ACHIEVEMENTS) {
      const got = !!state.achievements[a.id];
      const rewardStr = Object.entries(a.reward)
        .map(([k,v]) => k === 'cash' ? '+'+Economy.fmt(v) : k === 'sellPrice' ? `×${v} sell price` : k === 'produceSpeed' ? `×${v} produce` : k === 'heatMult' ? `-${Math.round((1-v)*100)}% heat` : k === 'launderRate' ? `×${v} launder` : '')
        .filter(Boolean).join(', ');

      html += `<div class="ach-card${got ? ' ach-card--earned' : ''}">
        <span class="ach-icon">${got ? a.icon : '🔒'}</span>
        <span class="card-body">
          <span class="card-name">${a.name}</span>
          <span class="card-desc">${got ? a.desc : '???'}</span>
          ${rewardStr ? `<span class="card-req">Reward: ${rewardStr}</span>` : ''}
        </span>
      </div>`;
    }
    return html;
  }

  /* ── Heat panel ── */
  function _renderHeat(state) {
    const h = state.heat;
    const fill = document.getElementById('heat-bar-fill');
    if (fill) {
      fill.style.width = h.toFixed(1) + '%';
      fill.className = 'heat-bar-fill ' + (
        h < 25 ? 'heat-cool' : h < 50 ? 'heat-warm' : h < 75 ? 'heat-hot' : h < 90 ? 'heat-danger' : 'heat-raid'
      );
    }
    _t('heat-pct', h.toFixed(0) + '%');
    const stages = ['😎 Safe','👀 Suspicious','🚨 Investigated','🔴 Surveillance','💀 RAID RISK'];
    const stage  = h < 25 ? 0 : h < 50 ? 1 : h < 75 ? 2 : h < 90 ? 3 : 4;
    _t('heat-stage', stages[stage]);
  }

  /* ── Event choice ── */
  function _renderEventChoice(state) {
    const box = document.getElementById('event-choice-box');
    if (!box) return;
    if (Events.hasChoice()) {
      const ev = Events.getChoice();
      box.classList.remove('hidden');
      _t('choice-desc', ev ? ev.desc : '');
      _t('choice-cost', ev?.effect?.bribe ? `Pay ${Economy.fmt(ev.effect.bribe)}` : 'Accept');
    } else {
      box.classList.add('hidden');
    }
  }

  /* ══════════ EFFECTS ══════════ */

  function produceEffect(qty) {
    const bar = document.getElementById('produce-bar-fill');
    if (bar) {
      bar.classList.remove('bar-pulse');
      void bar.offsetWidth;
      bar.classList.add('bar-pulse');
    }
    _floatText(document.getElementById('produce-btn'), '+' + qty + ' batch', 'float-produce');
  }

  function sellEffect(fmtAmt) {
    _floatText(document.getElementById('sell-all-btn') || document.getElementById('sell-one-btn'), '+' + fmtAmt, 'float-cash');
  }

  function raidFlash() {
    document.body.classList.add('raid-flash');
    setTimeout(() => document.body.classList.remove('raid-flash'), 900);
  }

  function _floatText(anchor, text, cls) {
    if (!anchor) return;
    const state = Game.getState();
    if (state.settings?.floatText === false) return;
    const rect = anchor.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = cls || 'float-cash';
    el.textContent = text;
    el.style.left = rect.left + rect.width / 2 + 'px';
    el.style.top  = rect.top + 'px';
    el.id = 'ft' + (_floatId++);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  /* ══════════ NOTIFICATIONS ══════════ */

  function addNotif(msg, type = 'info', extra = null) {
    const log = document.getElementById('notif-log');
    if (!log) return;

    const el = document.createElement('div');
    el.className = 'notif notif--' + type;
    const ts = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' });
    el.innerHTML = `<span class="notif-time">${ts}</span><span class="notif-msg">${msg}</span>`;
    log.prepend(el);
    while (log.children.length > 50) log.removeChild(log.lastChild);

    if (type === 'achievement') _achievementPopup(msg);
    if (type === 'raid') raidFlash();
  }

  function _achievementPopup(msg) {
    const el = document.createElement('div');
    el.className = 'ach-popup';
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('ach-popup--show'));
    setTimeout(() => {
      el.classList.remove('ach-popup--show');
      setTimeout(() => el.remove(), 400);
    }, 3200);
  }

  /* ══════════ MODALS ══════════ */

  function showWarning() {
    const m = document.getElementById('content-warning-modal');
    if (!m) return;
    m.classList.remove('hidden');
    document.getElementById('cw-continue')?.addEventListener('click', () => {
      m.classList.add('hidden');
      localStorage.setItem('dds3_warned', '1');
    });
    document.getElementById('cw-more')?.addEventListener('click', () => {
      document.getElementById('cw-extra')?.classList.toggle('hidden');
    });
  }

  function toggleModal(id) {
    document.getElementById(id)?.classList.toggle('hidden');
  }

  /* ── Helpers ── */
  function _t(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  return {
    init, render, addNotif,
    produceEffect, sellEffect, raidFlash,
    showWarning, toggleModal
  };
})();
