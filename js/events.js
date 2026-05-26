'use strict';
/* ── Events ── */
const Events = (() => {

  const EVENT_RATE = 1 / 90; // ~1 event per 90 seconds
  let _timer  = 0;
  let _active = []; // { ...event, remaining }
  let _choice = null;

  function tick(state, dt, notify) {
    // Advance active timed events
    _active = _active.filter(ev => {
      ev.remaining -= dt;
      if (ev.remaining <= 0) {
        _removeMod(state, ev);
        notify(`${ev.icon} ${ev.name} ended.`, 'info');
        return false;
      }
      return true;
    });

    // Try to fire a new event
    _timer += dt;
    if (_timer >= (1 / EVENT_RATE)) {
      _timer = 0;
      if (Math.random() < 0.75) _fire(state, notify); // 75% chance when timer fires
    }
  }

  function _fire(state, notify) {
    const pool  = EVENTS;
    const total = pool.reduce((s,e) => s+e.w, 0);
    let r = Math.random() * total;
    let ev = pool[0];
    for (const e of pool) { r -= e.w; if (r <= 0) { ev = e; break; } }
    _apply(state, ev, notify);
    state.stats.totalEvents = (state.stats.totalEvents||0) + 1;
  }

  function _apply(state, ev, notify) {
    if (ev.type === 'choice') {
      _choice = ev;
      notify(`🚨 EVENT: ${ev.desc}`, 'choice', ev);
      return;
    }
    const fx = ev.effect;
    if (fx.priceMult   !== undefined) {
      state.mods.priceMult   = (state.mods.priceMult||1) * fx.priceMult;
      if (ev.duration > 0) _active.push({ ...ev, remaining: ev.duration });
    }
    if (fx.produceMult !== undefined) {
      state.mods.produceMult = (state.mods.produceMult||1) * fx.produceMult;
      if (ev.duration > 0) _active.push({ ...ev, remaining: ev.duration });
    }
    if (fx.heat)       state.heat = Math.min(100, state.heat + fx.heat);
    if (fx.cashBonus)  {
      const bonus = Economy.getSellPrice(state, state.activeProduct) * fx.cashBonus;
      state.cash += bonus; state.totalEarned += bonus;
    }
    if (fx.loseWorker) {
      const lost = Workers.loseOne(state);
      if (lost) notify(`👮 ${lost} got arrested!`, 'danger');
    }
    const cls = ev.type==='good' ? 'success' : ev.type==='bad' ? 'danger' : 'info';
    notify(`${ev.icon} ${ev.name}: ${ev.desc}`, cls);
  }

  function _removeMod(state, ev) {
    const fx = ev.effect;
    if (fx.priceMult   !== undefined) state.mods.priceMult   = Math.max(0.1, (state.mods.priceMult||1)/fx.priceMult);
    if (fx.produceMult !== undefined) state.mods.produceMult = Math.max(0.1, (state.mods.produceMult||1)/fx.produceMult);
  }

  function resolveChoice(state, accept, notify) {
    if (!_choice) return;
    const ev = _choice; _choice = null;
    if (accept) {
      const cost = ev.effect.bribe || 0;
      if ((state.cash + state.cleanCash) >= cost) {
        Production.deductCash(state, cost);
        notify(`✅ Paid ${Economy.fmt(cost)}. Heat cleared.`, 'success');
      } else {
        state.heat = Math.min(100, state.heat + 30);
        notify(`❌ Can\'t afford! +30 heat.`, 'danger');
      }
    } else {
      state.heat = Math.min(100, state.heat + (ev.effect.bribe ? 30 : 20));
      notify('❌ Refused. Heat rising.', 'danger');
    }
  }

  function getActive()  { return _active; }
  function hasChoice()  { return !!_choice; }
  function getChoice()  { return _choice; }

  return { tick, resolveChoice, getActive, hasChoice, getChoice };
})();
