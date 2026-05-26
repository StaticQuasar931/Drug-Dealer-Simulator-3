/* Settings - Graphics quality and preferences */
const Settings = (() => {

  const DEFAULTS = {
    graphics: 'balanced',     // low | balanced | high
    animationIntensity: 'medium', // none | low | medium | high
    soundVolume: 0,
    musicEnabled: false,
    showFloatingText: true,
    darkMode: true,
    notifications: true
  };

  function apply(settings) {
    const s = Object.assign({}, DEFAULTS, settings);
    const root = document.documentElement;

    // Graphics quality → CSS class
    document.body.classList.remove('gfx-low', 'gfx-balanced', 'gfx-high');
    document.body.classList.add('gfx-' + s.graphics);

    // Animation intensity
    document.body.classList.remove('anim-none', 'anim-low', 'anim-medium', 'anim-high');
    document.body.classList.add('anim-' + s.animationIntensity);

    // Update rate (used by game loop)
    const updateRates = { low: 500, balanced: 250, high: 100 };
    window.__gameUpdateRate = updateRates[s.graphics] || 250;

    // Dark mode
    if (s.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  function getDefaults() { return { ...DEFAULTS }; }

  return { apply, getDefaults, DEFAULTS };
})();
