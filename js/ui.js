/* UI - Rendering, panels, notifications, modals */
const UI = (() => {

  let _activeTab   = 'products';
  let _activeRTab  = 'workers';
  let _initialized = false;
  let _floatId     = 0;

  /* ── Init ── */
  function init(state) {
    if (_initialized) return;
    _initialized = true;

    // Tab buttons
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        _activeTab = btn.dataset.tab;
        document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render(Game.getState());
      });
    });

    document.querySelectorAll('[data-rtab]').forEach(btn => {
      btn.addEventListener('click', () => {
        _activeRTab = btn.dataset.rtab;
        document.querySelectorAll('[data-rtab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render(Game.getState());
      });
    });

    // Deal button
    document.getElementById('deal-btn')?.addEventListener('click', () => {
      Game.deal();
    });

    // Action buttons
    document.getElementById('lay-low-btn')?.addEventListener('click', () => Game.layLow());
    document.getElementById('bribe-btn')?.addEventListener('click', () => Game.bribe());

    // Settings panel
    document.getElementById('settings-btn')?.addEventListener('click', () => toggleModal('settings-modal'));
    document.getElementById('save-btn')?.addEventListener('click', () => Game.manualSave());

    // Admin panel (hidden - accessed by konami code or clicking title 7 times)
    setupAdminAccess();

    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) el.classList.add('hidden');
      });
    });
  }

  /* ── Main render ── */
  function render(state) {
    renderHeader(state);
    renderDealButton(state);
    renderLeftPanel(state);
    renderRightPanel(state);
    renderHeatBar(state);
    renderActionButtons(state);
  }

  /* ── Header ── */
  function renderHeader(state) {
    setText('dirty-cash',    Economy.formatCash(state.cash));
    setText('clean-cash',    Economy.formatCash(state.cleanCash));
    setText('total-earned',  Economy.formatCash(state.totalEarned));

    const wIncome = Economy.getWorkerIncome(state);
    const laundRate = Economy.getLaunderRate(state);
    setText('income-rate',   Economy.formatCash(wIncome) + '/s');
    setText('launder-rate',  Economy.formatCash(laundRate) + '/s');

    const achCount = Achievements.getEarnedCount(state);
    setText('ach-count', achCount + '/' + GAME_DATA.achievements.length);
  }

  /* ── Deal button ── */
  function renderDealButton(state) {
    const btn = document.getElementById('deal-btn');
    if (!btn) return;

    const item = GAME_DATA.items.find(i => i.id === state.activeItem);
    if (!item) return;

    const val = Economy.getClickValue(state);
    setText('deal-item-name',  item.name);
    setText('deal-click-val',  '+' + Economy.formatCash(val) + ' per deal');

    // Heat indicator on button
    const heatClass = state.heat < 25 ? 'safe' : state.heat < 50 ? 'warm' : state.heat < 75 ? 'hot' : state.heat < 90 ? 'danger' : 'raid';
    btn.className = 'deal-btn deal-btn--' + heatClass;
  }

  /* ── Left panel (tabs: products / upgrades) ── */

  function renderLeftPanel(state) {
    const panel = document.getElementById('left-panel-content');
    if (!panel) return;

    if (_activeTab === 'products') {
      panel.innerHTML = renderProducts(state);
    } else if (_activeTab === 'upgrades') {
      panel.innerHTML = renderUpgrades(state);
    } else if (_activeTab === 'achievements') {
      panel.innerHTML = renderAchievements(state);
    }

    // Attach click handlers after innerHTML
    panel.querySelectorAll('[data-item-id]').forEach(el => {
      el.addEventListener('click', () => Game.unlockItem(el.dataset.itemId));
    });
    panel.querySelectorAll('[data-upgrade-id]').forEach(el => {
      el.addEventListener('click', () => Game.buyUpgrade(el.dataset.upgradeId));
    });
  }

  function renderProducts(state) {
    let html = '<div class="section-title">Products</div>';
    const totalEarned = state.totalEarned;

    for (const item of GAME_DATA.items) {
      const unlocked   = !!state.unlockedItems[item.id];
      const isActive   = state.activeItem === item.id;
      const canAfford  = item.unlockCash === 0 || (state.cash + state.cleanCash) >= item.unlockCash;
      const canSee     = totalEarned >= item.unlockCash * 0.5 || unlocked;

      if (!canSee && item.unlockCash > 0) continue;

      let cls = 'item-card';
      if (isActive) cls += ' item-card--active';
      if (!unlocked) cls += ' item-card--locked';
      if (!canAfford && !unlocked) cls += ' item-card--unaffordable';

      const costLabel = unlocked
        ? (isActive ? '✓ Active' : 'Switch')
        : (item.unlockCash === 0 ? 'Free' : Economy.formatCash(item.unlockCash));

      const tierBadge = item.tier > 1 ? `<span class="tier-badge">T${item.tier}</span>` : '';
      const catColor  = { weed: '#4CAF50', psychedelic: '#9C27B0', party: '#FF4081', hard: '#F44336', contraband: '#FF9800' }[item.category] || '#888';

      html += `<div class="item-card" data-item-id="${item.id}" style="border-left: 3px solid ${catColor}">
        <div class="item-card__icon" style="background:${item.color}20">${item.icon}</div>
        <div class="item-card__info">
          <div class="item-card__name">${item.name} ${tierBadge}</div>
          <div class="item-card__desc">${item.desc}</div>
          <div class="item-card__stats">
            <span class="stat-val">${Economy.formatCash(item.clickValue)}/deal</span>
            <span class="stat-heat">🔥 ${item.heatPerClick}/click</span>
          </div>
        </div>
        <div class="item-card__cost ${isActive ? 'active' : ''}">${costLabel}</div>
      </div>`;
    }
    return html;
  }

  function renderUpgrades(state) {
    let html = '<div class="section-title">Upgrades</div>';

    for (const upg of GAME_DATA.upgrades) {
      const bought    = !!state.upgrades[upg.id];
      const canAfford = (state.cash + state.cleanCash) >= upg.cost;
      const meetsReq  = bought || checkUpgradeReq(state, upg);

      if (!meetsReq && !canAfford) continue;

      let cls = 'upgrade-card';
      if (bought)    cls += ' upgrade-card--bought';
      if (!canAfford && !bought) cls += ' upgrade-card--unaffordable';

      html += `<div class="${cls}" data-upgrade-id="${upg.id}">
        <div class="upgrade-card__icon">${upg.icon}</div>
        <div class="upgrade-card__info">
          <div class="upgrade-card__name">${upg.name}</div>
          <div class="upgrade-card__desc">${upg.desc}</div>
        </div>
        <div class="upgrade-card__cost">${bought ? '✓' : Economy.formatCash(upg.cost)}</div>
      </div>`;
    }
    return html;
  }

  function checkUpgradeReq(state, upg) {
    const req = upg.req;
    if (!req) return true;
    if (req.cash && state.totalEarned < req.cash) return false;
    if (req.workers) {
      for (const [wId, needed] of Object.entries(req.workers)) {
        if ((state.workers[wId] || 0) < needed) return false;
      }
    }
    return true;
  }

  function renderAchievements(state) {
    let html = '<div class="section-title">Achievements (' + Achievements.getEarnedCount(state) + '/' + GAME_DATA.achievements.length + ')</div>';

    for (const ach of GAME_DATA.achievements) {
      const earned = !!state.achievements[ach.id];
      let cls = 'ach-card';
      if (earned) cls += ' ach-card--earned';

      const rewardStr = Object.entries(ach.reward)
        .map(([k, v]) => k === 'cash' ? '+' + Economy.formatCash(v) : '+' + v + 'x ' + k)
        .join(', ');

      html += `<div class="${cls}">
        <div class="ach-card__icon ${earned ? '' : 'ach-locked'}">${earned ? ach.icon : '🔒'}</div>
        <div class="ach-card__info">
          <div class="ach-card__name">${ach.name}</div>
          <div class="ach-card__desc">${ach.desc}</div>
          ${rewardStr ? `<div class="ach-card__reward">Reward: ${rewardStr}</div>` : ''}
        </div>
      </div>`;
    }
    return html;
  }

  /* ── Right panel tabs ── */
  function renderRightPanel(state) {
    const panel = document.getElementById('right-panel-content');
    if (!panel) return;

    if (_activeRTab === 'workers') {
      panel.innerHTML = renderWorkers(state);
      panel.querySelectorAll('[data-worker-id]').forEach(el => {
        el.addEventListener('click', () => Game.hireWorker(el.dataset.workerId));
      });
    } else if (_activeRTab === 'districts') {
      panel.innerHTML = renderDistricts(state);
      panel.querySelectorAll('[data-district-id]').forEach(el => {
        el.addEventListener('click', () => Game.unlockDistrict(el.dataset.districtId));
      });
    } else if (_activeRTab === 'fronts') {
      panel.innerHTML = renderFronts(state);
      panel.querySelectorAll('[data-front-id]').forEach(el => {
        el.addEventListener('click', () => Game.buyFront(el.dataset.frontId));
      });
    } else if (_activeRTab === 'stats') {
      panel.innerHTML = renderStats(state);
    }
  }

  function renderWorkers(state) {
    let html = '<div class="section-title">Workers</div>';
    const totalWorkers = Workers.getTotalWorkers(state);
    html += `<div class="worker-total">Total crew: ${totalWorkers}</div>`;

    for (const w of GAME_DATA.workers) {
      const count    = state.workers[w.id] || 0;
      const cost     = Economy.getWorkerCost(w.id, count);
      const canAfford = (state.cash + state.cleanCash) >= cost;

      // Only show if affordable within 10× current cash or already owned
      if (cost > (state.cash + state.cleanCash) * 10 && count === 0 && state.totalEarned < cost * 0.1) continue;

      const incomeStr  = w.incomePerSec > 0 ? Economy.formatCash(w.incomePerSec * count) + '/s' : '';
      const heatStr    = w.heatReduce > 0   ? '-' + (w.heatReduce * count).toFixed(1) + ' heat/s' : '';
      const laundStr   = w.launderRate > 0  ? '+' + Economy.formatCash(w.launderRate * count) + '/s clean' : '';
      const effects    = [incomeStr, heatStr, laundStr].filter(Boolean).join(' · ');

      const catColors  = { street: '#4CAF50', production: '#9C27B0', logistics: '#FF9800', finance: '#2196F3', security: '#F44336', elite: '#FFD700' };
      const catColor   = catColors[w.category] || '#888';

      html += `<div class="worker-card ${canAfford ? '' : 'worker-card--unaffordable'}" data-worker-id="${w.id}" style="border-left:3px solid ${catColor}">
        <div class="worker-card__icon">${w.icon}</div>
        <div class="worker-card__info">
          <div class="worker-card__name">${w.name} <span class="worker-count">[${count}]</span></div>
          <div class="worker-card__desc">${w.desc}</div>
          ${effects ? `<div class="worker-card__effects">${effects}</div>` : ''}
        </div>
        <div class="worker-card__cost ${canAfford ? 'can-afford' : ''}">${Economy.formatCash(cost)}</div>
      </div>`;
    }
    return html;
  }

  function renderDistricts(state) {
    let html = '<div class="section-title">Territories</div>';

    for (const d of GAME_DATA.districts) {
      const owned     = !!state.districts[d.id];
      const available = Map.isAvailable(state, d);
      const canAfford = (state.cash + state.cleanCash) >= d.unlockCash || d.unlockCash === 0;

      let cls = 'district-card';
      if (owned)     cls += ' district-card--owned';
      if (!available) cls += ' district-card--locked';

      const bonusLabel = getBonusLabel(d.bonus);
      const costLabel  = owned ? '✓ Claimed' : (d.unlockCash === 0 ? 'Starting Area' : Economy.formatCash(d.unlockCash));

      html += `<div class="${cls}" data-district-id="${d.id}" style="border-color:${d.color}">
        <div class="district-card__icon" style="background:${d.color}30">${d.icon}</div>
        <div class="district-card__info">
          <div class="district-card__name">${d.name}</div>
          <div class="district-card__desc">${d.desc}</div>
          <div class="district-card__bonus">${bonusLabel}</div>
          <div class="district-card__flavor">${d.flavor}</div>
        </div>
        <div class="district-card__cost ${owned ? 'owned' : (canAfford ? 'can-afford' : '')}">${costLabel}</div>
      </div>`;
    }
    return html;
  }

  function getBonusLabel(bonus) {
    if (!bonus || bonus.type === 'none') return 'Starting territory';
    const labels = {
      clickMult:    `+${Math.round((bonus.value - 1) * 100)}% deal value`,
      workerIncome: `+${Math.round((bonus.value - 1) * 100)}% worker income`,
      smuggler:     `+${Math.round((bonus.value - 1) * 100)}% smuggler income`,
      allIncome:    `+${Math.round((bonus.value - 1) * 100)}% all income`,
      heatReduce:   `-${Math.round((1 - bonus.value) * 100)}% heat`
    };
    return labels[bonus.type] || bonus.type;
  }

  function renderFronts(state) {
    let html = '<div class="section-title">Laundering Fronts</div>';
    const totalRate = Economy.getLaunderRate(state);
    html += `<div class="launder-rate-header">Current rate: ${Economy.formatCash(totalRate)}/s (${Math.round((state.launderEfficiency || 0.8) * 100)}% efficiency)</div>`;
    html += `<div class="launder-queue">Dirty cash: ${Economy.formatCash(state.cash)} → Laundering...</div>`;

    for (const f of GAME_DATA.fronts) {
      const count    = state.fronts[f.id] || 0;
      const cost     = Laundering.getFrontCost(state, f.id);
      const canAfford = (state.cash + state.cleanCash) >= cost;
      const totalIncome = f.launderPerSec * count;

      // Show if can eventually afford or already own
      if (cost > (state.cash + state.cleanCash) * 20 && count === 0) continue;

      html += `<div class="front-card ${canAfford ? '' : 'front-card--unaffordable'}" data-front-id="${f.id}" style="border-left:3px solid ${f.color}">
        <div class="front-card__icon" style="background:${f.color}20">${f.icon}</div>
        <div class="front-card__info">
          <div class="front-card__name">${f.name} <span class="front-count">[${count}]</span></div>
          <div class="front-card__desc">${f.desc}</div>
          <div class="front-card__rate">${Economy.formatCash(f.launderPerSec)}/s each${count > 0 ? ' · Total: ' + Economy.formatCash(totalIncome) + '/s' : ''}</div>
        </div>
        <div class="front-card__cost ${canAfford ? 'can-afford' : ''}">${Economy.formatCash(cost)}</div>
      </div>`;
    }
    return html;
  }

  function renderStats(state) {
    const wIncome = Economy.getWorkerIncome(state);
    const clickVal = Economy.getClickValue(state);
    const heatRed = Economy.getHeatReduction(state);
    const laundRate = Economy.getLaunderRate(state);

    return `<div class="section-title">Statistics</div>
    <div class="stats-grid">
      <div class="stat-row"><span class="stat-label">Total Clicks</span><span class="stat-val">${(state.stats.totalClicks||0).toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">Total Earned</span><span class="stat-val">${Economy.formatCash(state.totalEarned)}</span></div>
      <div class="stat-row"><span class="stat-label">Total Laundered</span><span class="stat-val">${Economy.formatCash(state.totalLaundered||0)}</span></div>
      <div class="stat-row"><span class="stat-label">Click Value</span><span class="stat-val">${Economy.formatCash(clickVal)}</span></div>
      <div class="stat-row"><span class="stat-label">Worker Income</span><span class="stat-val">${Economy.formatCash(wIncome)}/s</span></div>
      <div class="stat-row"><span class="stat-label">Launder Rate</span><span class="stat-val">${Economy.formatCash(laundRate)}/s</span></div>
      <div class="stat-row"><span class="stat-label">Heat Reduction</span><span class="stat-val">${heatRed.toFixed(1)}/s</span></div>
      <div class="stat-row"><span class="stat-label">Click Multiplier</span><span class="stat-val">${(state.clickMultiplier||1).toFixed(1)}×</span></div>
      <div class="stat-row"><span class="stat-label">Workers Hired</span><span class="stat-val">${state.stats.totalWorkersHired||0}</span></div>
      <div class="stat-row"><span class="stat-label">Raids Survived</span><span class="stat-val">${state.stats.raidssurvived||0}</span></div>
      <div class="stat-row"><span class="stat-label">Events Triggered</span><span class="stat-val">${state.stats.totalEvents||0}</span></div>
      <div class="stat-row"><span class="stat-label">Max Heat</span><span class="stat-val">${(state.stats.maxHeat||0).toFixed(1)}</span></div>
      <div class="stat-row"><span class="stat-label">Play Time</span><span class="stat-val">${Economy.formatTime(state.totalPlayTime||0)}</span></div>
      <div class="stat-row"><span class="stat-label">Achievements</span><span class="stat-val">${Achievements.getEarnedCount(state)}/${GAME_DATA.achievements.length}</span></div>
    </div>`;
  }

  /* ── Heat bar ── */
  function renderHeatBar(state) {
    const bar = document.getElementById('heat-fill');
    const label = document.getElementById('heat-label');
    const heatPct = state.heat;

    if (bar) {
      bar.style.width = heatPct + '%';
      bar.className = 'heat-fill heat-fill--' + (
        heatPct < 25 ? 'safe' :
        heatPct < 50 ? 'warm' :
        heatPct < 75 ? 'hot'  :
        heatPct < 90 ? 'danger' : 'raid'
      );
    }

    if (label) {
      const stages = ['Safe', 'Suspicious', 'Investigated', 'Surveillance', 'RAID RISK'];
      const stage  = heatPct < 25 ? 0 : heatPct < 50 ? 1 : heatPct < 75 ? 2 : heatPct < 90 ? 3 : 4;
      label.textContent = `Heat: ${heatPct.toFixed(0)}% — ${stages[stage]}`;
    }
  }

  /* ── Action buttons ── */
  function renderActionButtons(state) {
    const llCd = state.layLowCooldown > 0;
    const brCd = state.bribeCooldown  > 0;

    const llText = llCd ? `Lay Low (${Math.ceil(state.layLowCooldown)}s)` : '🕶️ Lay Low (-20 heat, $500)';
    const brText = brCd ? `Bribe (${Math.ceil(state.bribeCooldown)}s)`    : '💰 Bribe (-35 heat, $2k)';
    const llSmall = llCd ? `Lay Low (${Math.ceil(state.layLowCooldown)}s)` : '🕶️ Lay Low';
    const brSmall = brCd ? `Bribe (${Math.ceil(state.bribeCooldown)}s)`    : '💰 Bribe';

    const llBtn = document.getElementById('lay-low-btn');
    const brBtn = document.getElementById('bribe-btn');
    if (llBtn) { llBtn.disabled = llCd; llBtn.textContent = llText; }
    if (brBtn) { brBtn.disabled = brCd; brBtn.textContent = brText; }

    const llBtn2 = document.getElementById('lay-low-btn-2');
    const brBtn2 = document.getElementById('bribe-btn-2');
    if (llBtn2) { llBtn2.disabled = llCd; llBtn2.textContent = llSmall; }
    if (brBtn2) { brBtn2.disabled = brCd; brBtn2.textContent = brSmall; }
  }

  /* ── Notifications ── */
  function addNotification(msg, type = 'info', extra = null) {
    const log = document.getElementById('notification-log');
    if (!log) return;

    const el = document.createElement('div');
    el.className = 'notif notif--' + type;

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (type === 'event' && extra && extra.type === 'choice') {
      el.innerHTML = `<span class="notif-time">${ts}</span>
        <span class="notif-msg">${msg}</span>
        <div class="notif-choices">
          <button class="btn btn--sm btn--success" onclick="Game.resolveEventChoice(true)">Accept (Pay $${extra.effect.value.toLocaleString()})</button>
          <button class="btn btn--sm btn--danger"  onclick="Game.resolveEventChoice(false)">Refuse (+25 heat)</button>
        </div>`;
    } else {
      el.innerHTML = `<span class="notif-time">${ts}</span><span class="notif-msg">${msg}</span>`;
    }

    log.prepend(el);

    // Keep log trimmed
    while (log.children.length > 40) log.removeChild(log.lastChild);

    // Achievement popup
    if (type === 'achievement') showAchievementPopup(msg);
  }

  function showAchievementPopup(msg) {
    const el = document.createElement('div');
    el.className = 'ach-popup';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('ach-popup--visible'), 10);
    setTimeout(() => {
      el.classList.remove('ach-popup--visible');
      setTimeout(() => el.remove(), 500);
    }, 3000);
  }

  /* ── Effects ── */
  function triggerClickEffect(amount) {
    const btn = document.getElementById('deal-btn');
    if (!btn) return;

    // Ripple
    btn.classList.add('deal-btn--clicked');
    setTimeout(() => btn.classList.remove('deal-btn--clicked'), 150);

    // Floating text
    if (Game.getState().settings.showFloatingText !== false) {
      const rect = btn.getBoundingClientRect();
      const el = document.createElement('div');
      el.className = 'float-cash';
      el.textContent = '+' + Economy.formatCash(amount);
      el.style.left = (rect.left + rect.width / 2) + 'px';
      el.style.top  = (rect.top) + 'px';
      el.id = 'fc' + (_floatId++);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }
  }

  function triggerRaidEffect() {
    document.body.classList.add('raid-flash');
    setTimeout(() => document.body.classList.remove('raid-flash'), 1000);
  }

  /* ── Content warning modal ── */
  function showContentWarning() {
    const modal = document.getElementById('content-warning-modal');
    if (modal) modal.classList.remove('hidden');

    document.getElementById('cw-continue')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      localStorage.setItem('dds3_warned', '1');
    });
    document.getElementById('cw-learn-more')?.addEventListener('click', () => {
      document.getElementById('cw-extra')?.classList.toggle('hidden');
    });
  }

  /* ── Settings modal render ── */
  function renderSettingsModal(state) {
    const s = state.settings;
    setVal('setting-graphics',    s.graphics    || 'balanced');
    setVal('setting-anim',        s.animationIntensity || 'medium');
    setVal('setting-float-text',  s.showFloatingText !== false);
    setVal('setting-notifs',      s.notifications !== false);
  }

  /* ── Admin panel ── */
  function setupAdminAccess() {
    // Konami code: Up Up Down Down Left Right Left Right B A
    const konami = [38,38,40,40,37,39,37,39,66,65];
    let kIdx = 0;
    document.addEventListener('keydown', e => {
      if (e.keyCode === konami[kIdx]) {
        kIdx++;
        if (kIdx === konami.length) {
          kIdx = 0;
          toggleModal('admin-modal');
        }
      } else {
        kIdx = 0;
      }
    });

    // Admin actions
    document.getElementById('admin-add-1k')?.addEventListener('click',    () => { Game.adminAddCash(1000); });
    document.getElementById('admin-add-1m')?.addEventListener('click',    () => { Game.adminAddCash(1000000); });
    document.getElementById('admin-add-1b')?.addEventListener('click',    () => { Game.adminAddCash(1000000000); });
    document.getElementById('admin-zero-heat')?.addEventListener('click', () => { Game.adminSetHeat(0); });
    document.getElementById('admin-max-heat')?.addEventListener('click',  () => { Game.adminSetHeat(100); });
    document.getElementById('admin-unlock-all')?.addEventListener('click',() => { Game.adminUnlockAll(); });
    document.getElementById('admin-reset')?.addEventListener('click',     () => { Game.resetGame(); });
  }

  function toggleModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.toggle('hidden');
  }

  /* ── Helpers ── */
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function setVal(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = !!val;
    else el.value = val;
  }

  return {
    init, render,
    addNotification, showAchievementPopup,
    triggerClickEffect, triggerRaidEffect,
    showContentWarning, renderSettingsModal,
    toggleModal
  };

})();
