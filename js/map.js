/* Map - District / Territory management */
const Map = (() => {

  function unlockDistrict(state, districtId) {
    if (state.districts[districtId]) return { success: false, reason: 'Already unlocked' };
    const def = GAME_DATA.districts.find(d => d.id === districtId);
    if (!def) return { success: false, reason: 'Unknown district' };

    if (state.totalEarned < def.unlockCash) {
      return { success: false, reason: `Need ${Economy.formatCash(def.unlockCash)} total earned` };
    }

    const cost = def.unlockCash;
    const totalCash = state.cash + state.cleanCash;
    if (totalCash < cost && cost > 0) {
      return { success: false, reason: `Need ${Economy.formatCash(cost)} cash to claim` };
    }

    if (cost > 0) {
      if (state.cash >= cost) {
        state.cash -= cost;
      } else {
        const rem = cost - state.cash;
        state.cash = 0;
        state.cleanCash = Math.max(0, state.cleanCash - rem);
      }
    }

    state.districts[districtId] = true;
    state.stats.districtsUnlocked = (state.stats.districtsUnlocked || 0) + 1;

    return { success: true, name: def.name, bonus: def.bonus };
  }

  function getUnlockedCount(state) {
    return Object.values(state.districts).filter(Boolean).length;
  }

  function isAvailable(state, districtId) {
    const def = GAME_DATA.districts.find(d => d.id === districtId);
    if (!def) return false;
    return state.totalEarned >= def.unlockCash;
  }

  return { unlockDistrict, getUnlockedCount, isAvailable };
})();
