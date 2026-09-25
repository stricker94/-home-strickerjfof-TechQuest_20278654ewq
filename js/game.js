/**
 * Tech Quest — Lógica principal (modos, boss, progresión, logros)
 */
(function () {
  const state = {
    mode: "campaign",
    practice: false,
    timed: false,
    worldId: null,
    level: null,
    questions: [],
    qIndex: 0,
    lives: 3,
    score: 0,
    streak: 0,
    bestStreakRun: 0,
    hintsLeft: 2,
    hintsUsedRun: 0,
    totalQ: 0,
    answered: false,
    matchSelections: {},
    orderItems: [],
    hintUsedThisQ: false,
    correctCount: 0,
    wrongCount: 0,
    timeLeft: 0,
    timerId: null,
    pendingAchievements: []
  };

  let worldPickMode = "campaign";
  let selectedWorldForLevels = null;

  function init() {
    bindEvents();
    refreshMenu();
    UI.showScreen("screen-menu");
    UI.updateMuteButton();
    TechAudio.unlock();
  }

  function bindEvents() {
    document.addEventListener("pointerdown", () => TechAudio.unlock(), { passive: true });

    document.body.addEventListener("click", (e) => {
      const t = e.target.closest("[data-action]");
      if (!t) return;
      onAction(t.getAttribute("data-action"), t);
    });

    document.addEventListener("keydown", (e) => {
      const playOn = document.getElementById("screen-play")?.classList.contains("active");
      const fbOn = document.getElementById("screen-feedback")?.classList.contains("active");

      if (e.key === "Escape" && (playOn || fbOn)) confirmQuit();

      if (playOn && !state.answered && /^[1-4]$/.test(e.key)) {
        const btn = document.querySelector(`#options .option-btn[data-index="${+e.key - 1}"]`);
        if (btn && !btn.disabled) btn.click();
      }

      if (e.key === "Enter") {
        if (playOn) {
          const sub = document.querySelector("#btn-submit:not([disabled])");
          if (sub && !sub.hidden) sub.click();
        }
        if (fbOn) document.querySelector("#btn-next-feedback")?.click();
      }

      if ((e.key === "h" || e.key === "H") && playOn && !state.practice) {
        document.querySelector("#btn-hint:not([disabled])")?.click();
      }

      if (e.key === "m" || e.key === "M") onAction("mute");

      if (playOn && !state.answered) {
        if (e.key === "v" || e.key === "V") document.querySelector('.tf-btn[data-val="true"]')?.click();
        if (e.key === "f" || e.key === "F") document.querySelector('.tf-btn[data-val="false"]')?.click();
      }
    });
  }

  function onAction(action, el) {
    switch (action) {
      case "mute":
        TechAudio.toggleMute();
        UI.updateMuteButton();
        TechAudio.playClick();
        break;
      case "play":
        TechAudio.playClick();
        worldPickMode = "campaign";
        renderWorlds();
        UI.showScreen("screen-worlds");
        break;
      case "practice":
        TechAudio.playClick();
        worldPickMode = "practice";
        renderWorlds();
        UI.showScreen("screen-worlds");
        break;
      case "marathon":
        TechAudio.playClick();
        beginMarathon();
        break;
      case "timer":
        TechAudio.playClick();
        worldPickMode = "timer";
        renderWorlds();
        UI.showScreen("screen-worlds");
        break;
      case "boss":
        TechAudio.playClick();
        worldPickMode = "boss";
        renderWorlds();
        UI.showScreen("screen-worlds");
        break;
      case "howto":
        TechAudio.playClick();
        UI.showScreen("screen-howto");
        break;
      case "stats":
        TechAudio.playClick();
        renderStats();
        UI.showScreen("screen-stats");
        break;
      case "achievements":
        TechAudio.playClick();
        renderAchievements();
        UI.showScreen("screen-achievements");
        break;
      case "menu":
        TechAudio.playClick();
        clearTimer();
        refreshMenu();
        UI.showScreen("screen-menu");
        break;
      case "pick-world": {
        TechAudio.playClick();
        const id = el.getAttribute("data-world");
        if (worldPickMode === "boss") {
          beginBoss(id);
        } else {
          selectedWorldForLevels = id;
          renderLevels(id);
          UI.showScreen("screen-levels");
        }
        break;
      }
      case "pick-level": {
        TechAudio.playClick();
        const id = el.getAttribute("data-world") || selectedWorldForLevels;
        const level = parseInt(el.getAttribute("data-level"), 10);
        if (worldPickMode === "practice") beginPractice(id, level);
        else if (worldPickMode === "timer") beginTimer(id, level);
        else beginCampaign(id, level);
        break;
      }
      case "back-worlds":
        TechAudio.playClick();
        renderWorlds();
        UI.showScreen("screen-worlds");
        break;
      case "hint":
        useHint();
        break;
      case "submit":
        submitAnswer();
        break;
      case "next":
        TechAudio.playClick();
        advance();
        break;
      case "quit":
        TechAudio.playClick();
        confirmQuit();
        break;
      case "retry":
        TechAudio.playClick();
        retry();
        break;
      default:
        break;
    }
  }

  function confirmQuit() {
    if (confirm("¿Volver al menú? Se perderá el progreso de esta partida.")) {
      clearTimer();
      refreshMenu();
      UI.showScreen("screen-menu");
    }
  }

  function retry() {
    if (state.mode === "marathon") beginMarathon();
    else if (state.mode === "boss") beginBoss(state.worldId);
    else if (state.mode === "timer") beginTimer(state.worldId, state.level);
    else if (state.practice) beginPractice(state.worldId, state.level);
    else if (state.worldId) beginCampaign(state.worldId, state.level);
    else {
      refreshMenu();
      UI.showScreen("screen-menu");
    }
  }

  function countQuestions() {
    return WORLDS.reduce((n, w) => n + w.questions.length + (w.boss ? w.boss.length : 0), 0);
  }

  function refreshMenu() {
    UI.setText("#menu-highscore", String(UI.getHighScore()));
    UI.setText("#menu-total-q", String(countQuestions()));
    UI.setText("#menu-worlds", String(WORLDS.length));
    const unlocked = Progress.getAchievements();
    UI.setText("#menu-ach-count", Object.keys(unlocked).length + " / " + ACHIEVEMENTS.length);
    const wrap = UI.$("#menu-badges");
    if (wrap) {
      wrap.innerHTML = ACHIEVEMENTS.map((a) => {
        const on = !!unlocked[a.id];
        return `<span class="mini-badge ${on ? "on" : ""}" title="${UI.escapeHtml(a.name)}">${a.icon}</span>`;
      }).join("");
    }
  }

  function renderWorlds() {
    const title = UI.$("#worlds-title");
    const map = {
      campaign: "Aventura — elige mundo",
      practice: "Práctica (sin vidas)",
      timer: "Cronómetro — elige mundo",
      boss: "Desafío Boss 👹"
    };
    if (title) title.textContent = map[worldPickMode] || "Mundos";

    UI.$("#world-grid").innerHTML = WORLDS.map((w, i) => {
      if (worldPickMode === "boss" && !(w.boss && w.boss.length)) return "";
      const open =
        worldPickMode !== "campaign" || Progress.isUnlocked(w.id) || i === 0;
      const pct = Progress.worldProgressPct(w.id);
      const maxL = (Progress.levelsPerWorld && Progress.levelsPerWorld()) || GAME_CONFIG.levelsPerWorld || 5;
      const stars = Array.from({ length: maxL }, (_, i) => Progress.isLevelCleared(w.id, i + 1) ? "⭐" : "☆").join("");
      const boss = Progress.getBossWins()[w.id];
      return `<button type="button" class="world-card ${open ? "" : "locked"}"
        style="--accent:${w.color}"
        ${open ? `data-action="pick-world" data-world="${w.id}"` : "disabled"}>
        <span class="world-num">Mundo ${i + 1}${boss ? " 👑" : ""}</span>
        <span class="world-icon">${w.icon}</span>
        <span class="world-name">${UI.escapeHtml(w.name)}${open ? "" : " 🔒"}</span>
        <span class="world-desc">${UI.escapeHtml(w.description)}</span>
        <span class="world-progress">${stars} · ${pct}%</span>
        <span class="world-count">${w.questions.length} retos · ${maxL} niveles${w.boss ? " · boss" : ""}</span>
      </button>`;
    }).join("");
  }

  function renderLevels(worldId) {
    const w = getWorldById(worldId);
    if (!w) return;
    const title = UI.$("#levels-title");
    const sub = UI.$("#levels-world-sub");
    if (title) title.textContent = "Niveles — " + w.icon + " " + w.name;
    if (sub) {
      const modeLabel = { campaign: "Aventura", practice: "Práctica", timer: "Cronómetro" }[worldPickMode] || "";
      sub.textContent = modeLabel + " · Progreso del mundo: " + Progress.worldProgressPct(worldId) + "%";
    }
    const maxL = (Progress.levelsPerWorld && Progress.levelsPerWorld()) || GAME_CONFIG.levelsPerWorld || 5;
    const labels = window.LEVEL_LABELS || {
      1: { name: "Básico", icon: "1️⃣" },
      2: { name: "Intermedio", icon: "2️⃣" },
      3: { name: "Avanzado", icon: "3️⃣" },
      4: { name: "Experto", icon: "4️⃣" },
      5: { name: "Maestro", icon: "5️⃣" }
    };
    const counts = typeof countLevelsForWorld === "function" ? countLevelsForWorld(worldId) : {};
    UI.$("#level-grid").innerHTML = Array.from({ length: maxL }, (_, i) => i + 1)
      .map((L) => {
        const open = worldPickMode === "practice" || worldPickMode === "timer" || Progress.isLevelUnlocked(worldId, L);
        const cleared = Progress.isLevelCleared(worldId, L);
        const n = counts[L] || 0;
        return `<button type="button" class="level-card ${open ? "" : "locked"} ${cleared ? "cleared" : ""}"
          style="--accent:${w.color}"
          ${open ? `data-action="pick-level" data-world="${worldId}" data-level="${L}"` : "disabled"}>
          <span class="level-icon">${(labels[L] && labels[L].icon) || ("🔢")}</span>
          <span class="level-name">Nivel ${L}: ${(labels[L] && labels[L].name) || ("Nv." + L)}${cleared ? " ⭐" : ""}${open ? "" : " 🔒"}</span>
          <span class="level-count">${n} desafíos</span>
          <span class="level-state">${cleared ? "Completado" : open ? "Disponible" : "Bloqueado"}</span>
        </button>`;
      })
      .join("");
  }

  function startRun(opts) {
    clearTimer();
    state.mode = opts.mode;
    state.practice = !!opts.practice;
    state.timed = !!opts.timed;
    state.worldId = opts.worldId || null;
    state.level = opts.level != null ? opts.level : null;
    state.questions = opts.questions;
    state.qIndex = 0;
    state.lives = opts.practice ? 99 : GAME_CONFIG.maxLives;
    state.score = 0;
    state.streak = 0;
    state.bestStreakRun = 0;
    state.hintsLeft = opts.practice ? 0 : opts.mode === "boss" ? 1 : GAME_CONFIG.hintsPerWorld;
    state.hintsUsedRun = 0;
    state.totalQ = opts.questions.length;
    state.answered = false;
    state.correctCount = 0;
    state.wrongCount = 0;
    state.pendingAchievements = [];
    Progress.recordGameStart();
    UI.showScreen("screen-play");
    showQuestion();
  }

  function questionsFor(worldId, level) {
    let qs;
    if (typeof getQuestionsForLevel === "function" && level) {
      qs = getQuestionsForLevel(worldId, level).slice();
    } else {
      const w = getWorldById(worldId);
      qs = (w ? w.questions : []).filter((q) => (q.level || 1) === level);
    }
    return UI.shuffle(qs);
  }

  function beginCampaign(worldId, level) {
    level = level || 1;
    if (!Progress.isUnlocked(worldId)) {
      UI.toast("Mundo bloqueado. Completa el anterior.");
      return;
    }
    if (!Progress.isLevelUnlocked(worldId, level)) {
      UI.toast("Nivel bloqueado. Completa el anterior.");
      return;
    }
    const qs = questionsFor(worldId, level);
    if (!qs.length) {
      UI.toast("Este nivel aún no tiene desafíos.");
      return;
    }
    startRun({ mode: "campaign", worldId, level, questions: qs });
  }

  function beginPractice(worldId, level) {
    level = level || 1;
    const qs = questionsFor(worldId, level);
    if (!qs.length) {
      UI.toast("Este nivel aún no tiene desafíos.");
      return;
    }
    startRun({ mode: "practice", practice: true, worldId, level, questions: qs });
  }

  function beginTimer(worldId, level) {
    level = level || 1;
    let qs = questionsFor(worldId, level);
    if (!qs.length) {
      UI.toast("Este nivel aún no tiene desafíos.");
      return;
    }
    qs = qs.slice(0, Math.min(12, qs.length));
    startRun({ mode: "timer", timed: true, worldId, level, questions: qs });
  }

  function beginMarathon() {
    const pool = [];
    WORLDS.forEach((w) => w.questions.forEach((q) => pool.push(q)));
    const qs = UI.shuffle(pool).slice(0, GAME_CONFIG.marathonCount);
    startRun({ mode: "marathon", worldId: null, questions: qs });
  }

  function beginBoss(worldId) {
    const w = getWorldById(worldId);
    if (!w || !w.boss) return;
    startRun({ mode: "boss", timed: true, worldId, questions: w.boss.slice() });
  }

  function currentQ() { return state.questions[state.qIndex]; }

  function clearTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function hud() {
    return {
      mode: state.mode,
      practice: state.practice,
      timed: state.timed,
      worldId: state.worldId,
      level: state.level,
      lives: state.lives,
      score: state.score,
      streak: state.streak,
      hintsLeft: state.hintsLeft,
      qIndex: state.qIndex,
      totalQ: state.totalQ,
      timeLeft: state.timeLeft
    };
  }

  function armTimer() {
    clearTimer();
    if (!state.timed) {
      state.timeLeft = 0;
      UI.updateHUD(hud());
      return;
    }
    state.timeLeft =
      state.mode === "boss" ? GAME_CONFIG.bossTimerSeconds : GAME_CONFIG.timerSeconds;
    UI.updateHUD(hud());
    state.timerId = setInterval(() => {
      if (state.answered) return;
      state.timeLeft--;
      if (state.timeLeft > 0 && state.timeLeft <= 5) {
        if (state.timeLeft <= 3) TechAudio.playUrgentTick();
        else TechAudio.playTick();
      }
      UI.updateHUD(hud());
      if (state.timeLeft <= 0) {
        clearTimer();
        if (!state.answered) finishRound(false, correctLabel(currentQ()), true);
      }
    }, 1000);
  }

  function showQuestion() {
    state.answered = false;
    state.hintUsedThisQ = false;
    state.matchSelections = {};

    const q = currentQ();
    UI.updateHUD(hud());

    const hintBox = UI.$("#hint-box");
    if (hintBox) {
      hintBox.hidden = true;
      hintBox.textContent = "";
    }

    UI.setText("#question-type", typeLabel(q.type));
    UI.setText("#question-text", q.q);

    const area = UI.$("#challenge-area");
    area.innerHTML = "";
    area.className = "challenge-area type-" + q.type;

    const submitBtn = UI.$("#btn-submit");
    const hintBtn = UI.$("#btn-hint");
    if (hintBtn) {
      hintBtn.hidden = state.practice;
      hintBtn.disabled = state.hintsLeft <= 0;
    }
    if (submitBtn) submitBtn.disabled = false;

    if (q.type === "mc" || q.type === "identify" || q.type === "scenario") {
      submitBtn.hidden = true;
      renderChoices(area, q.options);
    } else if (q.type === "tf") {
      submitBtn.hidden = true;
      renderTF(area);
    } else if (q.type === "fill") {
      submitBtn.hidden = false;
      area.innerHTML = `
        <label class="fill-label" for="fill-input">Tu respuesta:</label>
        <input id="fill-input" class="fill-input" type="text" autocomplete="off" spellcheck="false"
          placeholder="Escribe aquí…" aria-label="Respuesta" />
        <p class="fill-tip">Mayúsculas flexibles · Enter para enviar</p>`;
      const input = UI.$("#fill-input");
      setTimeout(() => input && input.focus(), 40);
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          submitAnswer();
        }
      });
    } else if (q.type === "match") {
      submitBtn.hidden = false;
      renderMatch(area, q);
    } else if (q.type === "order") {
      submitBtn.hidden = false;
      renderOrder(area, q);
    }

    armTimer();
  }

  function typeLabel(t) {
    return ({
      mc: "Opción múltiple",
      identify: "Identificar herramienta",
      fill: "Completar comando",
      match: "Emparejar",
      order: "Ordenar pasos",
      tf: "Verdadero / Falso",
      scenario: "Escenario"
    })[t] || t;
  }

  function renderChoices(area, options) {
    const wrap = document.createElement("div");
    wrap.id = "options";
    wrap.className = "options";
    options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.dataset.index = String(i);
      btn.innerHTML = `<span class="opt-key">${i + 1}</span><span class="opt-text">${UI.escapeHtml(opt)}</span>`;
      btn.addEventListener("click", () => {
        if (state.answered) return;
        gradeChoice(i);
      });
      wrap.appendChild(btn);
    });
    area.appendChild(wrap);
  }

  function renderTF(area) {
    const wrap = document.createElement("div");
    wrap.id = "options";
    wrap.className = "options tf-row";
    [["true", "Verdadero", "V"], ["false", "Falso", "F"]].forEach(([val, label, key]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn tf-btn";
      btn.dataset.val = val;
      btn.innerHTML = `<span class="opt-key">${key}</span><span class="opt-text">${label}</span>`;
      btn.addEventListener("click", () => {
        if (state.answered) return;
        gradeTF(val === "true");
      });
      wrap.appendChild(btn);
    });
    area.appendChild(wrap);
  }

  function renderMatch(area, q) {
    const lefts = q.pairs.map((p, i) => ({ text: p.left, i }));
    const rights = UI.shuffle(q.pairs.map((p, i) => ({ text: p.right, i })));
    area.innerHTML = `
      <p class="match-help">Elige izquierda y luego su pareja a la derecha.</p>
      <div class="match-board">
        <div class="match-col">${lefts.map((l) =>
          `<button type="button" class="match-item" data-side="left" data-i="${l.i}">${UI.escapeHtml(l.text)}</button>`
        ).join("")}</div>
        <div class="match-col">${rights.map((r) =>
          `<button type="button" class="match-item" data-side="right" data-i="${r.i}">${UI.escapeHtml(r.text)}</button>`
        ).join("")}</div>
      </div>
      <div class="match-links" id="match-links"></div>`;
    let pending = null;
    area.querySelectorAll(".match-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (state.answered) return;
        TechAudio.playClick();
        const side = btn.dataset.side;
        const i = +btn.dataset.i;
        if (side === "left") {
          area.querySelectorAll('[data-side="left"]').forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
          pending = i;
        } else if (pending != null) {
          Object.keys(state.matchSelections).forEach((k) => {
            if (state.matchSelections[k] === i || +k === pending) delete state.matchSelections[k];
          });
          state.matchSelections[pending] = i;
          pending = null;
          area.querySelectorAll(".match-item").forEach((b) => b.classList.remove("selected"));
          paintMatch();
        }
      });
    });
  }

  function paintMatch() {
    const q = currentQ();
    const links = UI.$("#match-links");
    links.innerHTML = Object.entries(state.matchSelections)
      .map(([l, r]) =>
        `<span class="match-chip">${UI.escapeHtml(q.pairs[+l].left)} ↔ ${UI.escapeHtml(q.pairs[r].right)}</span>`
      )
      .join("");
    UI.$all(".match-item").forEach((btn) => {
      const side = btn.dataset.side;
      const i = +btn.dataset.i;
      const paired =
        side === "left"
          ? state.matchSelections[i] != null
          : Object.values(state.matchSelections).includes(i);
      btn.classList.toggle("paired", paired);
    });
  }

  function renderOrder(area, q) {
    state.orderItems = UI.shuffle(q.items.map((text, orig) => ({ text, orig })));
    const list = document.createElement("ul");
    list.className = "order-list";
    list.id = "order-list";

    function paint() {
      list.innerHTML = "";
      state.orderItems.forEach((item, idx) => {
        const li = document.createElement("li");
        li.className = "order-item";
        li.innerHTML = `
          <span class="order-num">${idx + 1}</span>
          <span class="order-text">${UI.escapeHtml(item.text)}</span>
          <span class="order-controls">
            <button type="button" class="icon-btn" data-dir="-1" data-idx="${idx}" aria-label="Subir" ${idx === 0 ? "disabled" : ""}>▲</button>
            <button type="button" class="icon-btn" data-dir="1" data-idx="${idx}" aria-label="Bajar" ${idx === state.orderItems.length - 1 ? "disabled" : ""}>▼</button>
          </span>`;
        list.appendChild(li);
      });
      list.querySelectorAll("[data-dir]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (state.answered) return;
          TechAudio.playClick();
          const idx = +btn.dataset.idx;
          const j = idx + +btn.dataset.dir;
          if (j < 0 || j >= state.orderItems.length) return;
          const tmp = state.orderItems[idx];
          state.orderItems[idx] = state.orderItems[j];
          state.orderItems[j] = tmp;
          paint();
        });
      });
    }
    area.innerHTML = `<p class="order-help">Ordena con ▲ ▼ (arriba = primero).</p>`;
    area.appendChild(list);
    paint();
  }

  function useHint() {
    if (state.answered || state.hintsLeft <= 0 || state.hintUsedThisQ || state.practice) return;
    TechAudio.playClick();
    state.hintsLeft--;
    state.hintsUsedRun++;
    state.hintUsedThisQ = true;
    state.score = Math.max(0, state.score - GAME_CONFIG.pointsHintPenalty);
    Progress.recordHint();
    UI.updateHUD(hud());
    const hintBtn = UI.$("#btn-hint");
    if (hintBtn) hintBtn.disabled = state.hintsLeft <= 0;

    const q = currentQ();
    const box = UI.$("#hint-box");
    box.hidden = false;
    let tip = "Pista activa.";

    if (q.type === "mc" || q.type === "identify" || q.type === "scenario") {
      const wrong = q.options.map((_, i) => i).filter((i) => i !== q.answer);
      const elim = wrong[Math.floor(Math.random() * wrong.length)];
      tip = "Pista: elimina «" + q.options[elim] + "».";
      const btn = document.querySelector(`#options .option-btn[data-index="${elim}"]`);
      if (btn) {
        btn.disabled = true;
        btn.classList.add("eliminated");
      }
    } else if (q.type === "tf") {
      tip = "Pista: revisa la definición estándar del concepto.";
    } else if (q.type === "fill") {
      const ans = (q.accept && q.accept[0]) || q.answer;
      tip = "Pista: empieza con «" + ans.slice(0, Math.min(4, ans.length)) + "…»";
    } else if (q.type === "match") {
      tip = "Pista: «" + q.pairs[0].left + "» ↔ «" + q.pairs[0].right + "».";
      state.matchSelections[0] = 0;
      paintMatch();
    } else if (q.type === "order") {
      tip = "Pista: el primero es «" + q.items[q.answer[0]] + "».";
    }
    box.textContent = tip;
  }

  function submitAnswer() {
    if (state.answered) return;
    const q = currentQ();
    if (q.type === "fill") {
      const raw = (UI.$("#fill-input")?.value || "").trim();
      if (!raw) {
        UI.$("#fill-input")?.focus();
        return;
      }
      gradeFill(raw);
    } else if (q.type === "match") gradeMatch();
    else if (q.type === "order") gradeOrder();
  }

  function correctLabel(q) {
    if (q.type === "mc" || q.type === "identify" || q.type === "scenario") return q.options[q.answer];
    if (q.type === "tf") return q.answer ? "Verdadero" : "Falso";
    if (q.type === "fill") return q.answer;
    if (q.type === "match") return q.pairs.map((p) => p.left + " → " + p.right).join("; ");
    if (q.type === "order") return q.answer.map((i) => q.items[i]).join(" → ");
    return "";
  }

  function gradeChoice(index) {
    const q = currentQ();
    const ok = index === q.answer;
    UI.$all("#options .option-btn").forEach((btn) => {
      btn.disabled = true;
      const i = +btn.dataset.index;
      if (i === q.answer) btn.classList.add("correct");
      if (i === index && !ok) btn.classList.add("wrong");
    });
    finishRound(ok, q.options[q.answer]);
  }

  function gradeTF(val) {
    const q = currentQ();
    const ok = val === q.answer;
    UI.$all(".tf-btn").forEach((btn) => {
      btn.disabled = true;
      const v = btn.dataset.val === "true";
      if (v === q.answer) btn.classList.add("correct");
      if (v === val && !ok) btn.classList.add("wrong");
    });
    finishRound(ok, q.answer ? "Verdadero" : "Falso");
  }

  function norm(s) { return s.trim().toLowerCase().replace(/\s+/g, " "); }

  function gradeFill(raw) {
    const q = currentQ();
    const accept = (q.accept || [q.answer]).map(norm);
    finishRound(accept.includes(norm(raw)), q.answer);
  }

  function gradeMatch() {
    const q = currentQ();
    const n = q.pairs.length;
    if (Object.keys(state.matchSelections).length < n) {
      alert("Empareja todos los ítems antes de comprobar.");
      return;
    }
    let ok = true;
    for (let i = 0; i < n; i++) if (state.matchSelections[i] !== i) ok = false;
    finishRound(ok, correctLabel(q));
  }

  function gradeOrder() {
    const q = currentQ();
    const player = state.orderItems.map((x) => x.orig);
    const ok = player.length === q.answer.length && player.every((v, i) => v === q.answer[i]);
    finishRound(ok, correctLabel(q));
  }

  function grant(id) {
    if (Progress.unlockAchievement(id)) {
      state.pendingAchievements.push(id);
      TechAudio.playAchievement();
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      if (a) UI.toast("Logro: " + a.icon + " " + a.name);
    }
  }

  function finishRound(ok, correctText, timedOut) {
    clearTimer();
    state.answered = true;
    const sub = UI.$("#btn-submit");
    const hint = UI.$("#btn-hint");
    if (sub) sub.disabled = true;
    if (hint) hint.disabled = true;

    Progress.recordAnswer(ok);
    let gained = 0;

    if (ok) {
      TechAudio.playCorrect();
      state.streak++;
      state.correctCount++;
      if (state.streak > state.bestStreakRun) state.bestStreakRun = state.streak;
      Progress.recordStreak(state.streak);
      gained =
        GAME_CONFIG.pointsCorrect +
        (state.streak > 1 ? GAME_CONFIG.pointsStreakBonus * (state.streak - 1) : 0);
      if (state.mode === "boss") gained = Math.round(gained * 1.5);
      if (state.hintUsedThisQ) gained = Math.max(20, gained - GAME_CONFIG.pointsHintPenalty);
      if (state.timed && state.timeLeft > 0) gained += Math.min(50, state.timeLeft * 2);
      state.score += gained;
      if (state.streak >= 5) grant("streak5");
      if (state.streak >= 10) grant("streak10");
    } else {
      TechAudio.playWrong();
      state.streak = 0;
      state.wrongCount++;
      if (!state.practice) state.lives--;
    }

    UI.updateHUD(hud());
    showFeedback(ok, gained, correctText, currentQ().explain, timedOut);
  }

  function showFeedback(ok, gained, correctText, explain, timedOut) {
    UI.showScreen("screen-feedback");
    UI.flashFeedback(ok);
    UI.$("#feedback-icon").textContent = ok ? "✅" : timedOut ? "⏰" : "❌";
    const title = UI.$("#feedback-title");
    if (ok) {
      title.textContent = "¡Correcto!";
      title.className = "ok";
      UI.setText("#feedback-detail", "+" + gained + " pts" + (state.streak > 1 ? " · Racha x" + state.streak : ""));
    } else {
      title.textContent = timedOut ? "¡Tiempo agotado!" : "Incorrecto";
      title.className = "bad";
      UI.setText(
        "#feedback-detail",
        "Respuesta: " + correctText + (state.practice ? "" : " · Vidas: " + Math.max(0, state.lives))
      );
    }
    UI.setText("#feedback-explain", explain || "");
    const ach = UI.$("#feedback-ach");
    if (ach) {
      if (state.pendingAchievements.length) {
        ach.hidden = false;
        ach.textContent =
          "¡Logro! " +
          state.pendingAchievements
            .map((id) => {
              const a = ACHIEVEMENTS.find((x) => x.id === id);
              return a ? a.icon + " " + a.name : id;
            })
            .join(" · ");
        state.pendingAchievements = [];
      } else ach.hidden = true;
    }
    UI.$("#btn-next-feedback")?.focus();
  }

  function advance() {
    if (!state.practice && state.lives <= 0) {
      endGame(false);
      return;
    }
    state.qIndex++;
    if (state.qIndex >= state.totalQ) {
      endGame(true);
      return;
    }
    UI.showScreen("screen-play");
    showQuestion();
  }

  function endGame(victory) {
    clearTimer();
    const isNew = UI.saveHighScore(state.score);
    const world = state.worldId ? getWorldById(state.worldId) : null;
    const levelCleared = !!(victory && state.mode === "campaign" && state.worldId && state.level);
    Progress.recordGameEnd({ victory, mode: state.mode, levelCleared });

    if (victory) {
      if (state.mode === "campaign" && state.worldId && state.level) {
        Progress.markLevelCleared(state.worldId, state.level);
        grant("first_win");
        if (state.hintsUsedRun === 0) grant("no_hints");
        const maxL = (Progress.levelsPerWorld && Progress.levelsPerWorld()) || GAME_CONFIG.levelsPerWorld || 5;
        if (state.worldId === "support" && state.level >= maxL) grant("support_hero");
        if (state.worldId === "security" && state.level >= maxL) grant("security_hero");
        if (state.worldId === "hardware" && state.level >= maxL) grant("hardware_hero");
        if (state.worldId === "cloud" && state.level >= maxL) grant("cloud_hero");
        if (state.worldId === "database" && state.level >= maxL) grant("database_hero");
        if (Progress.allLevelsCleared(state.worldId)) grant("world_maestro");
        if (Progress.countClearedLevels() >= 25) grant("level_master");
        if (Progress.allWorldsCompleted()) grant("all_worlds");
        if (WORLDS.every((w) => Progress.allLevelsCleared(w.id))) grant("all_levels");
      }
      if (state.mode === "marathon") grant("marathon");
      if (state.mode === "timer") grant("timer_ace");
      if (state.mode === "boss" && state.worldId) {
        Progress.markBossWin(state.worldId);
        grant("boss_slayer");
        if (Progress.allBossesBeaten()) grant("all_bosses");
      }
    }

    UI.showScreen("screen-end");
    UI.$("#end-icon").textContent = victory ? (state.mode === "boss" ? "👹" : "🏆") : "💀";
    let titleTxt = victory ? "¡Completado!" : "Game Over";
    if (victory && state.mode === "boss") titleTxt = "¡Boss derrotado!";
    if (victory && state.mode === "marathon") titleTxt = "¡Maratón terminada!";
    const title = UI.$("#end-title");
    title.textContent = titleTxt;
    title.className = victory ? "ok" : "bad";

    const totalAns = state.correctCount + state.wrongCount;
    const acc = totalAns ? Math.round((state.correctCount / totalAns) * 100) : 0;
    UI.setText(
      "#end-summary",
      (world ? world.icon + " " + world.name + (state.level ? " · Nivel " + state.level : "") + "\\n" : state.mode === "marathon" ? "Maratón mixta\\n" : "") +
        "Modo: " + state.mode +
        "\\nPuntuación: " + state.score + (isNew ? " · ¡Nuevo récord!" : "") +
        "\\nAciertos: " + state.correctCount + "/" + totalAns + " (" + acc + "%)" +
        "\\nMejor racha: " + state.bestStreakRun +
        (state.practice ? "" : " · Vidas: " + Math.max(0, state.lives))
    );
    UI.setText("#end-highscore", String(UI.getHighScore()));

    const unlockEl = UI.$("#end-unlock");
    if (unlockEl) {
      if (victory && state.mode === "campaign" && world && state.level) {
        const maxL = (Progress.levelsPerWorld && Progress.levelsPerWorld()) || GAME_CONFIG.levelsPerWorld || 5;
        if (state.level < maxL) {
          unlockEl.hidden = false;
          unlockEl.textContent = "Desbloqueado: Nivel " + (state.level + 1) + " de " + world.name;
        } else {
          const idx = WORLDS.findIndex((w) => w.id === world.id);
          if (idx >= 0 && idx < WORLDS.length - 1) {
            unlockEl.hidden = false;
            unlockEl.textContent = "Mundo desbloqueado: " + WORLDS[idx + 1].icon + " " + WORLDS[idx + 1].name;
          } else {
            unlockEl.hidden = false;
            unlockEl.textContent = "¡Dominaste " + world.name + " (" + maxL + "/" + maxL + " niveles)!";
          }
        }
      } else unlockEl.hidden = true;
    }

    if (victory) TechAudio.playLevelComplete();
    else TechAudio.playGameOver();
  }

  function renderStats() {
    const s = Progress.getStats();
    const total = s.correct + s.wrong;
    const pct = total ? Math.round((s.correct / total) * 100) : 0;
    UI.setHTML(
      "#stats-body",
      `<ul class="stats-list">
        <li><strong>Partidas:</strong> ${s.gamesPlayed} (ganadas ${s.gamesWon})</li>
        <li><strong>Respuestas:</strong> ${s.correct} bien / ${s.wrong} mal (${pct}% acierto)</li>
        <li><strong>Mejor racha:</strong> ${s.bestStreak}</li>
        <li><strong>Pistas usadas:</strong> ${s.hintsUsed}</li>
        <li><strong>Maratones ganadas:</strong> ${s.marathonWins}</li>
        <li><strong>Cronómetro ganados:</strong> ${s.timerWins}</li>
        <li><strong>Boss (partidas ganadas):</strong> ${s.bossWins}</li>
        <li><strong>Niveles completados:</strong> ${Progress.countClearedLevels()} / ${WORLDS.length * 3}</li>
        <li><strong>Récord puntos:</strong> ${UI.getHighScore()}</li>
      </ul>`
    );
  }

  function renderAchievements() {
    const unlocked = Progress.getAchievements();
    UI.setHTML(
      "#achievements-grid",
      ACHIEVEMENTS.map((a) => {
        const on = !!unlocked[a.id];
        return `<div class="ach-card ${on ? "unlocked" : "locked"}">
          <span class="ach-icon">${a.icon}</span>
          <span class="ach-name">${UI.escapeHtml(a.name)}</span>
          <span class="ach-desc">${UI.escapeHtml(a.desc)}</span>
          <span class="ach-state">${on ? "Desbloqueado" : "Bloqueado"}</span>
        </div>`;
      }).join("")
    );
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
