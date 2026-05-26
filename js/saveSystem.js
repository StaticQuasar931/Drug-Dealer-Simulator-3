/* Save System - localStorage persistence with multiple slots */
const SaveSystem = (() => {

  const SAVE_KEY  = 'dds3_save';
  const SLOT_KEY  = 'dds3_slot';
  const MAX_SLOTS = 3;

  function _encode(obj) {
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))); }
    catch(e) { return JSON.stringify(obj); }
  }

  function _decode(str) {
    try { return JSON.parse(decodeURIComponent(escape(atob(str)))); }
    catch(e) {
      try { return JSON.parse(str); }
      catch(e2) { return null; }
    }
  }

  function getCurrentSlot() {
    return parseInt(localStorage.getItem(SLOT_KEY) || '0', 10);
  }

  function setCurrentSlot(n) {
    localStorage.setItem(SLOT_KEY, String(n));
  }

  function slotKey(n) {
    return SAVE_KEY + '_' + n;
  }

  function save(state, slot) {
    const s = (slot !== undefined) ? slot : getCurrentSlot();
    const payload = {
      v: 1,
      ts: Date.now(),
      data: state
    };
    try {
      localStorage.setItem(slotKey(s), _encode(payload));
      return true;
    } catch(e) {
      console.warn('Save failed:', e);
      return false;
    }
  }

  function load(slot) {
    const s = (slot !== undefined) ? slot : getCurrentSlot();
    const raw = localStorage.getItem(slotKey(s));
    if (!raw) return null;
    const payload = _decode(raw);
    if (!payload || !payload.data) return null;
    return payload;
  }

  function deleteSave(slot) {
    const s = (slot !== undefined) ? slot : getCurrentSlot();
    localStorage.removeItem(slotKey(s));
  }

  function getSlotMeta() {
    const slots = [];
    for (let i = 0; i < MAX_SLOTS; i++) {
      const raw = localStorage.getItem(slotKey(i));
      if (raw) {
        const payload = _decode(raw);
        if (payload && payload.data) {
          slots.push({
            slot: i,
            timestamp: payload.ts,
            totalEarned: payload.data.totalEarned || 0,
            playTime: payload.data.totalPlayTime || 0
          });
        } else {
          slots.push({ slot: i, empty: true });
        }
      } else {
        slots.push({ slot: i, empty: true });
      }
    }
    return slots;
  }

  function hasAnySave() {
    for (let i = 0; i < MAX_SLOTS; i++) {
      if (localStorage.getItem(slotKey(i))) return true;
    }
    return false;
  }

  return { save, load, deleteSave, getSlotMeta, getCurrentSlot, setCurrentSlot, hasAnySave, MAX_SLOTS };
})();
