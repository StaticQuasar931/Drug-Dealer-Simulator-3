/* Events - Random event system */
const Events = (() => {

  const EVENT_CHANCE_PER_MINUTE = 0.15; // 15% chance each minute
  let _timeSinceLastEvent = 0;
  let _activeEvents = [];
  let _pendingChoice = null;

  function tick(state, deltaSeconds, notifyFn) {
    // Advance active event timers
    _activeEvents = _activeEvents.filter(ev => {
      ev.remaining -= deltaSeconds;
      if (ev.remaining <= 0) {
        // Remove effect
        removeEventEffect(state, ev);
        notifyFn('Event ended: ' + ev.name, 'info');
        return false;
      }
      return true;
    });

    // Also tick temporary click mult
    if (state.tempClickMult && state.tempClickMultExpiry) {
      if (Date.now() > state.tempClickMultExpiry) {
        state.clickMultiplier /= state.tempClickMult;
        state.tempClickMult = null;
        state.tempClickMultExpiry = null;
      }
    }

    _timeSinceLastEvent += deltaSeconds;
    // Check every 60s for a new event
    if (_timeSinceLastEvent >= 60) {
      _timeSinceLastEvent = 0;
      if (Math.random() < EVENT_CHANCE_PER_MINUTE) {
        triggerRandomEvent(state, notifyFn);
      }
    }
  }

  function triggerRandomEvent(state, notifyFn) {
    const pool = GAME_DATA.events;
    const totalWeight = pool.reduce((s, e) => s + e.weight, 0);
    let rand = Math.random() * totalWeight;
    let chosen = null;
    for (const ev of pool) {
      rand -= ev.weight;
      if (rand <= 0) { chosen = ev; break; }
    }
    if (!chosen) chosen = pool[0];

    applyEvent(state, chosen, notifyFn);
    state.stats.totalEvents = (state.stats.totalEvents || 0) + 1;
  }

  function applyEvent(state, ev, notifyFn) {
    if (ev.type === 'choice') {
      _pendingChoice = ev;
      notifyFn('EVENT: ' + ev.desc, 'event', ev);
      return;
    }

    const effect = ev.effect;
    switch (effect.type) {
      case 'incomeMult':
        state.eventMods.incomeMult = (state.eventMods.incomeMult || 1) * effect.value;
        if (ev.duration > 0) {
          _activeEvents.push({ ...ev, remaining: ev.duration });
        }
        break;

      case 'heatAdd':
        state.heat = Math.min(100, state.heat + effect.value);
        break;

      case 'cashBonus':
        const bonus = Economy.getClickValue(state) * effect.value * 10;
        state.cash += bonus;
        state.totalEarned += bonus;
        break;

      case 'loseWorker':
        const lost = Workers.loseRandomWorker(state);
        if (lost) notifyFn('Lost worker: ' + lost, 'danger');
        break;

      case 'clickMult':
        if (effect.temp) {
          state.clickMultiplier *= effect.value;
          state.tempClickMult = effect.value;
          state.tempClickMultExpiry = Date.now() + effect.temp * 1000;
        }
        break;

      case 'blackout':
        state.eventMods.blackout = true;
        if (ev.duration > 0) {
          _activeEvents.push({ ...ev, remaining: ev.duration });
        }
        break;
    }

    const typeClass = ev.type === 'positive' ? 'success' : ev.type === 'negative' ? 'danger' : 'info';
    notifyFn(ev.icon + ' ' + ev.name + ': ' + ev.desc, typeClass);
  }

  function removeEventEffect(state, ev) {
    const effect = ev.effect;
    switch (effect.type) {
      case 'incomeMult':
        state.eventMods.incomeMult = Math.max(1, (state.eventMods.incomeMult || 1) / effect.value);
        break;
      case 'blackout':
        delete state.eventMods.blackout;
        break;
    }
  }

  function resolveChoice(state, accept, notifyFn) {
    if (!_pendingChoice) return;
    const ev = _pendingChoice;
    _pendingChoice = null;

    if (accept) {
      // Pay the bribe
      const bribeAmount = ev.effect.value;
      if (state.cash + state.cleanCash >= bribeAmount) {
        if (state.cash >= bribeAmount) state.cash -= bribeAmount;
        else { state.cleanCash -= bribeAmount - state.cash; state.cash = 0; }
        notifyFn('Paid $' + bribeAmount.toLocaleString() + ' bribe. Heat cleared.', 'success');
      } else {
        notifyFn('Can\'t afford bribe! Heat rising.', 'danger');
        state.heat = Math.min(100, state.heat + 25);
      }
    } else {
      state.heat = Math.min(100, state.heat + 25);
      notifyFn('Refused the deal. +25 heat.', 'danger');
    }
  }

  function hasPendingChoice() { return !!_pendingChoice; }
  function getPendingChoice() { return _pendingChoice; }
  function getActiveEvents() { return _activeEvents; }

  return { tick, triggerRandomEvent, applyEvent, resolveChoice, hasPendingChoice, getPendingChoice, getActiveEvents };
})();
