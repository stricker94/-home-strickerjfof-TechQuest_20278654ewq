/**
 * Tech Quest — Helpers de UI
 */
const UI = (() => {
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function showScreen(id) {
    $all(".screen").forEach((el) => {
      const on = el.id === id;
      el.classList.toggle("active", on);
      if (on) {
        el.classList.remove("screen-enter");
        void el.offsetWidth;
        el.classList.add("screen-enter");
      }
    });
  }

  function setText(sel, text) {
    const el = $(sel);
    if (el) el.textContent = text;
  }

  function setHTML(sel, html) {
    const el = $(sel);
    if (el) el.innerHTML = html;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function updateMuteButton() {
    const btn = $("#btn-mute");
    if (!btn) return;
    const m = TechAudio.isMuted();
    btn.textContent = m ? "🔇 Silencio" : "🔊 Sonido";
    btn.setAttribute("aria-pressed", m ? "true" : "false");
  }

  function updateHUD(st) {
    const livesWrap = $("#hud-lives-wrap");
    if (livesWrap) livesWrap.hidden = !!st.practice;
    if (!st.practice) {
      setText("#hud-lives", "❤️".repeat(Math.max(0, st.lives)) + (st.lives <= 0 ? "💀" : ""));
    }
    setText("#hud-score", String(st.score));
    setText("#hud-streak", String(st.streak));
    setText("#hud-hints", String(st.hintsLeft));
    setText("#hud-progress", (st.qIndex + 1) + " / " + st.totalQ);
    const timerWrap = $("#hud-timer-wrap");
    if (timerWrap) {
      timerWrap.hidden = !st.timed;
      if (st.timed) {
        setText("#hud-timer", Math.max(0, st.timeLeft) + "s");
        timerWrap.classList.toggle("urgent", st.timeLeft <= 5);
      }
    }
    let label = "—";
    if (st.mode === "marathon") label = "🏃 Maratón";
    else if (st.mode === "boss") {
      const w = getWorldById(st.worldId);
      label = "👹 Boss" + (w ? " · " + w.icon + " " + w.name : "");
    } else if (st.mode === "timer") {
      const w = getWorldById(st.worldId);
      label = "⏱️ Cronómetro" + (w ? " · " + w.name : "");
    } else if (st.practice) {
      const w = getWorldById(st.worldId);
      label = "📚 Práctica" + (w ? " · " + w.name : "");
    } else {
      const w = getWorldById(st.worldId);
      if (w) label = w.icon + " " + w.name + (st.level ? " · Nv." + st.level : "");
    }
    setText("#hud-world", label);
  }

  function getHighScore() {
    try { return parseInt(localStorage.getItem(GAME_CONFIG.storageKey) || "0", 10) || 0; }
    catch (_) { return 0; }
  }

  function saveHighScore(score) {
    const prev = getHighScore();
    if (score > prev) {
      try { localStorage.setItem(GAME_CONFIG.storageKey, String(score)); } catch (_) {}
      return true;
    }
    return false;
  }

  function toast(msg) {
    let el = $("#tq-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "tq-toast";
      el.className = "tq-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function flashFeedback(ok) {
    const panel = $("#screen-feedback .panel");
    if (!panel) return;
    panel.classList.remove("flash-ok", "flash-bad");
    void panel.offsetWidth;
    panel.classList.add(ok ? "flash-ok" : "flash-bad");
  }

  return {
    $, $all, showScreen, setText, setHTML, escapeHtml, shuffle,
    updateMuteButton, updateHUD, getHighScore, saveHighScore, toast, flashFeedback
  };
})();
