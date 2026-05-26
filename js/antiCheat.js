/* Anti-Cheat - Protects against clock manipulation and save editing */
const AntiCheat = (() => {

  const MAX_OFFLINE_HOURS = 12;        // Cap offline progress
  const MAX_TICK_SECONDS  = 5;         // Cap a single tick
  const SUSPICION_THRESHOLD = 120000;  // 2 min gap triggers check

  let _lastKnownTime = Date.now();
  let _suspicionCount = 0;

  function validateTimeDelta(savedTimestamp, nowTimestamp) {
    if (!savedTimestamp) return { valid: true, elapsed: 0, capped: false };

    let elapsed = (nowTimestamp - savedTimestamp) / 1000; // seconds

    // If clock went backward, someone tampered
    if (elapsed < -10) {
      _suspicionCount++;
      console.warn('[AntiCheat] Clock went backward:', elapsed, 's');
      return { valid: false, elapsed: 0, capped: false, reason: 'clock_backward' };
    }

    // Cap offline progress
    const maxElapsed = MAX_OFFLINE_HOURS * 3600;
    const capped = elapsed > maxElapsed;
    if (capped) elapsed = maxElapsed;

    return { valid: true, elapsed, capped };
  }

  function validateTickDelta(delta) {
    // delta is in seconds since last tick
    if (delta < 0) {
      _suspicionCount++;
      return 0;
    }
    return Math.min(delta, MAX_TICK_SECONDS);
  }

  function checkLargeDelta(delta) {
    // delta in ms
    if (delta > SUSPICION_THRESHOLD) {
      _suspicionCount++;
    }
  }

  function tick() {
    const now = Date.now();
    const gap = now - _lastKnownTime;
    checkLargeDelta(gap);
    _lastKnownTime = now;
    return gap;
  }

  function getSuspicionCount() { return _suspicionCount; }

  function isSuspicious() { return _suspicionCount >= 3; }

  function hashState(state) {
    // Simple djb2 hash for light integrity check
    const str = JSON.stringify({
      cash: Math.floor(state.cash || 0),
      cleanCash: Math.floor(state.cleanCash || 0),
      totalEarned: Math.floor(state.totalEarned || 0)
    });
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
      hash |= 0;
    }
    return (hash >>> 0).toString(16);
  }

  return { validateTimeDelta, validateTickDelta, tick, getSuspicionCount, isSuspicious, hashState };
})();
