/**
 * Tech Quest — SFX sintetizados con Web Audio API (sin CDN, offline)
 */
const TechAudio = (() => {
  let ctx = null;
  let muted = false;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function loadMute() {
    try {
      muted = localStorage.getItem(GAME_CONFIG.storageMuted) === "1";
    } catch (_) {
      muted = false;
    }
  }

  function saveMute() {
    try {
      localStorage.setItem(GAME_CONFIG.storageMuted, muted ? "1" : "0");
    } catch (_) {}
  }

  function isMuted() {
    return muted;
  }

  function setMuted(v) {
    muted = !!v;
    saveMute();
  }

  function toggleMute() {
    setMuted(!muted);
    return muted;
  }

  function tone(freq, start, dur, type, gainVal, slideTo) {
    const c = getCtx();
    if (!c || muted) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, c.currentTime + start);
    if (slideTo != null) {
      osc.frequency.linearRampToValueAtTime(slideTo, c.currentTime + start + dur);
    }
    g.gain.setValueAtTime(0.0001, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(gainVal, c.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(c.currentTime + start);
    osc.stop(c.currentTime + start + dur + 0.05);
  }

  function noiseBurst(start, dur, gainVal) {
    const c = getCtx();
    if (!c || muted) return;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1200;
    g.gain.setValueAtTime(gainVal, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
    src.connect(f);
    f.connect(g);
    g.connect(c.destination);
    src.start(c.currentTime + start);
  }

  function playClick() {
    tone(880, 0, 0.06, "square", 0.08);
  }

  function playCorrect() {
    tone(523.25, 0, 0.1, "square", 0.12);
    tone(659.25, 0.1, 0.1, "square", 0.12);
    tone(783.99, 0.2, 0.18, "square", 0.14);
  }

  function playWrong() {
    tone(220, 0, 0.15, "sawtooth", 0.1, 140);
    noiseBurst(0.05, 0.12, 0.06);
  }

  function playLevelComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => tone(f, i * 0.12, 0.2, "square", 0.12));
    tone(1318.5, 0.5, 0.35, "triangle", 0.1);
  }

  function playGameOver() {
    tone(392, 0, 0.2, "sawtooth", 0.1);
    tone(311, 0.22, 0.25, "sawtooth", 0.1);
    tone(233, 0.48, 0.45, "sawtooth", 0.12, 180);
  }

  function playAchievement() {
    tone(659.25, 0, 0.1, "triangle", 0.11);
    tone(783.99, 0.1, 0.1, "triangle", 0.11);
    tone(987.77, 0.2, 0.12, "triangle", 0.12);
    tone(1318.5, 0.35, 0.28, "square", 0.1);
  }

  function playTick() {
    tone(1200, 0, 0.04, "square", 0.05);
  }

  function playUrgentTick() {
    tone(1600, 0, 0.05, "square", 0.07);
  }

  function unlock() {
    getCtx();
  }

  loadMute();

  return {
    unlock,
    playClick,
    playCorrect,
    playWrong,
    playLevelComplete,
    playGameOver,
    playAchievement,
    playTick,
    playUrgentTick,
    isMuted,
    setMuted,
    toggleMute
  };
})();
