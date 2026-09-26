/**
 * Tech Quest — Progreso, logros, estadísticas y niveles
 */
const Progress = (() => {
  function parse(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      const val = raw ? JSON.parse(raw) : null;
      // Datos corruptos o de otro tipo (p. ej. "null") no deben romper el juego
      return val && typeof val === "object" ? val : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (_) {}
  }

  const LEVELS_KEY = GAME_CONFIG.storageLevels || "techQuestLevelClears";

  function defaultUnlocks() {
    const u = {};
    WORLDS.forEach((w, i) => { u[w.id] = i === 0; });
    if (WORLDS[0]) u[WORLDS[0].id] = true;
    return u;
  }

  function getUnlocks() {
    const u = Object.assign(defaultUnlocks(), parse(GAME_CONFIG.storageUnlocks, {}));
    if (WORLDS[0]) u[WORLDS[0].id] = true;
    return u;
  }

  function isUnlocked(id) { return !!getUnlocks()[id]; }

  function unlockWorld(id) {
    const u = getUnlocks();
    if (u[id]) return false;
    u[id] = true;
    save(GAME_CONFIG.storageUnlocks, u);
    return true;
  }

  function unlockNextAfter(id) {
    const i = WORLDS.findIndex((w) => w.id === id);
    if (i >= 0 && i < WORLDS.length - 1) return unlockWorld(WORLDS[i + 1].id);
    return false;
  }

  function getLevelClears() {
    return parse(LEVELS_KEY, {});
  }

  function isLevelCleared(worldId, level) {
    const c = getLevelClears();
    return !!(c[worldId] && c[worldId][String(level)]);
  }

  function levelsPerWorld() {
    return (GAME_CONFIG && GAME_CONFIG.levelsPerWorld) || 5;
  }

  function markLevelCleared(worldId, level) {
    const c = getLevelClears();
    if (!c[worldId]) c[worldId] = {};
    c[worldId][String(level)] = Date.now();
    save(LEVELS_KEY, c);
    const maxL = levelsPerWorld();
    // Completing the top level clears the world and unlocks next world
    if (level >= maxL) {
      markWorldCompleted(worldId);
      unlockNextAfter(worldId);
    } else if (level === 1) {
      unlockWorld(worldId);
    }
  }

  function isLevelUnlocked(worldId, level) {
    const idx = WORLDS.findIndex((w) => w.id === worldId);
    const worldOpen = isUnlocked(worldId) || idx === 0;
    if (!worldOpen) return false;
    if (level <= 1) return true;
    return isLevelCleared(worldId, level - 1);
  }

  function worldProgressPct(worldId) {
    const maxL = levelsPerWorld();
    let cleared = 0;
    for (let L = 1; L <= maxL; L++) if (isLevelCleared(worldId, L)) cleared++;
    return Math.round((cleared / maxL) * 100);
  }

  function allLevelsCleared(worldId) {
    const maxL = levelsPerWorld();
    for (let L = 1; L <= maxL; L++) if (!isLevelCleared(worldId, L)) return false;
    return true;
  }

  function countClearedLevels() {
    const maxL = levelsPerWorld();
    let n = 0;
    WORLDS.forEach((w) => {
      for (let L = 1; L <= maxL; L++) if (isLevelCleared(w.id, L)) n++;
    });
    return n;
  }

  function getAchievements() { return parse(GAME_CONFIG.storageAchievements, {}); }

  function unlockAchievement(id) {
    const a = getAchievements();
    if (a[id]) return false;
    a[id] = Date.now();
    save(GAME_CONFIG.storageAchievements, a);
    return true;
  }

  function getBossWins() { return parse(GAME_CONFIG.storageBoss, {}); }

  function markBossWin(id) {
    const b = getBossWins();
    b[id] = true;
    save(GAME_CONFIG.storageBoss, b);
  }

  function allBossesBeaten() { return WORLDS.every((w) => getBossWins()[w.id]); }

  function getCompleted() { return parse("techQuestCompletedWorlds", {}); }

  function markWorldCompleted(id) {
    const c = getCompleted();
    c[id] = true;
    save("techQuestCompletedWorlds", c);
  }

  function allWorldsCompleted() { return WORLDS.every((w) => getCompleted()[w.id] || allLevelsCleared(w.id)); }

  function defaultStats() {
    return {
      gamesPlayed: 0, gamesWon: 0, correct: 0, wrong: 0, bestStreak: 0,
      hintsUsed: 0, marathonWins: 0, timerWins: 0, bossWins: 0, levelsCleared: 0
    };
  }

  function getStats() { return Object.assign(defaultStats(), parse(GAME_CONFIG.storageStats, {})); }

  function patchStats(fn) {
    const s = getStats();
    fn(s);
    save(GAME_CONFIG.storageStats, s);
  }

  function recordAnswer(ok) { patchStats((s) => { if (ok) s.correct++; else s.wrong++; }); }
  function recordStreak(n) { patchStats((s) => { if (n > s.bestStreak) s.bestStreak = n; }); }
  function recordHint() { patchStats((s) => { s.hintsUsed++; }); }
  function recordGameStart() { patchStats((s) => { s.gamesPlayed++; }); }
  function recordGameEnd(meta) {
    patchStats((s) => {
      if (meta.victory) s.gamesWon++;
      if (meta.mode === "marathon" && meta.victory) s.marathonWins++;
      if (meta.mode === "timer" && meta.victory) s.timerWins++;
      if (meta.mode === "boss" && meta.victory) s.bossWins++;
      if (meta.levelCleared) s.levelsCleared = (s.levelsCleared || 0) + 1;
    });
  }

  // Preguntas falladas pendientes de repaso: { id: veces fallada }
  const MISSED_KEY = GAME_CONFIG.storageMissed || "techQuestMissed";

  function getMissed() { return parse(MISSED_KEY, {}); }

  function recordMissed(id, ok) {
    if (!id) return;
    const m = getMissed();
    if (ok) {
      if (!(id in m)) return;
      delete m[id];
    } else {
      m[id] = (m[id] || 0) + 1;
    }
    save(MISSED_KEY, m);
  }

  function resetAll() {
    const keys = [
      GAME_CONFIG.storageKey, GAME_CONFIG.storageUnlocks, GAME_CONFIG.storageAchievements,
      GAME_CONFIG.storageStats, GAME_CONFIG.storageBoss, LEVELS_KEY, MISSED_KEY,
      "techQuestCompletedWorlds"
    ];
    keys.forEach((k) => {
      try { localStorage.removeItem(k); } catch (_) {}
    });
  }

  return {
    getMissed, recordMissed, resetAll,
    getUnlocks, isUnlocked, unlockWorld, unlockNextAfter,
    getLevelClears, isLevelCleared, markLevelCleared, isLevelUnlocked,
    levelsPerWorld, worldProgressPct, allLevelsCleared, countClearedLevels,
    getAchievements, unlockAchievement,
    getBossWins, markBossWin, allBossesBeaten,
    getCompleted, markWorldCompleted, allWorldsCompleted,
    getStats, recordAnswer, recordStreak, recordHint, recordGameStart, recordGameEnd
  };
})();
