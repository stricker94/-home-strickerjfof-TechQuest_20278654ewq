#!/usr/bin/env node
/**
 * Tech Quest — Pruebas de extremo a extremo en Chromium (Playwright).
 * Abre index.html como archivo local y juega de verdad: cada pregunta de
 * cada nivel y cada boss, más los casos límite que ya causaron bugs.
 *
 * Uso: npm test          (todas las pruebas)
 *      npm test -- quick (omite el barrido completo de 540 preguntas)
 */
const path = require("path");
const { chromium } = require("playwright");

const INDEX = "file://" + path.join(__dirname, "..", "index.html");
const QUICK = process.argv.includes("quick");
// El juego ignora toques en los primeros 350 ms de cada pregunta
const HUMAN_DELAY = 380;

let failures = 0;
function check(cond, msg) {
  if (cond) console.log("  ✓ " + msg);
  else {
    failures++;
    console.log("  ✗ " + msg);
  }
}

async function newPage(browser) {
  const page = await browser.newPage();
  page.errors = [];
  page.on("pageerror", (e) => page.errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  await page.goto(INDEX);
  return page;
}

const isActive = (page, id) => page.$eval("#" + id, (e) => e.classList.contains("active"));

function goMenu(page) {
  return page.evaluate(() => {
    const b = document.querySelector(".screen.active [data-action=menu], .screen.active [data-action=quit]");
    if (b) b.click();
  });
}

/** Pregunta original (sin barajar) que se está mostrando. */
function currentQuestion(page) {
  return page.evaluate(() => {
    const text = document.querySelector("#question-text").textContent;
    for (const w of WORLDS) for (const q of w.questions.concat(w.boss || [])) if (q.q === text) return q;
    return null;
  });
}

async function answerCorrectly(page, q) {
  if (q.options) {
    const want = q.options[q.answer];
    for (const btn of await page.$$("#options .option-btn")) {
      if ((await btn.$eval(".opt-text", (e) => e.textContent)) === want) {
        await btn.click();
        return;
      }
    }
    throw new Error("opción correcta no encontrada: " + q.id);
  }
  if (q.type === "tf") return page.keyboard.press(q.answer ? "v" : "f");
  if (q.type === "fill") {
    await page.fill("#fill-input", q.answer.toUpperCase());
    return page.keyboard.press("Enter");
  }
  if (q.type === "match") {
    for (let i = 0; i < q.pairs.length; i++) {
      await page.click(`.match-item[data-side=left][data-i="${i}"]`);
      await page.click(`.match-item[data-side=right][data-i="${i}"]`);
    }
    return page.click("#btn-submit");
  }
  if (q.type === "order") {
    for (let pos = 0; pos < q.answer.length; pos++) {
      const want = q.items[q.answer[pos]];
      for (;;) {
        const texts = await page.$$eval(".order-text", (els) => els.map((e) => e.textContent));
        const at = texts.indexOf(want);
        if (at === pos) break;
        await page.click(`.icon-btn[data-dir="-1"][data-idx="${at}"]`);
      }
    }
    return page.click("#btn-submit");
  }
  throw new Error("tipo desconocido " + q.type);
}

/** Contesta mal sin importar el tipo. */
async function answerWrong(page, q) {
  if (q.options) {
    const want = q.options[q.answer];
    for (const btn of await page.$$("#options .option-btn")) {
      if ((await btn.$eval(".opt-text", (e) => e.textContent)) !== want) return btn.click();
    }
  }
  if (q.type === "tf") return page.keyboard.press(q.answer ? "f" : "v");
  if (q.type === "fill") {
    await page.fill("#fill-input", "respuesta-incorrecta");
    return page.keyboard.press("Enter");
  }
  if (q.type === "match") {
    const n = q.pairs.length;
    for (let i = 0; i < n; i++) {
      await page.click(`.match-item[data-side=left][data-i="${i}"]`);
      await page.click(`.match-item[data-side=right][data-i="${(i + 1) % n}"]`);
    }
    return page.click("#btn-submit");
  }
  if (q.type === "order") {
    // Poner primero el elemento que debería ir al final
    const last = q.items[q.answer[q.answer.length - 1]];
    for (;;) {
      const texts = await page.$$eval(".order-text", (els) => els.map((e) => e.textContent));
      const at = texts.indexOf(last);
      if (at === 0) break;
      await page.click(`.icon-btn[data-dir="-1"][data-idx="${at}"]`);
    }
    return page.click("#btn-submit");
  }
}

/**
 * Juega hasta que termina la partida. Verifica que cada respuesta muestre la
 * pantalla de resultado y que Enter avance exactamente una pregunta.
 */
async function playRun(page, { wrong = false } = {}) {
  let answered = 0;
  let problems = [];
  while (await isActive(page, "screen-play")) {
    await page.waitForTimeout(HUMAN_DELAY);
    const q = await currentQuestion(page);
    if (!q) throw new Error("no se encontró la pregunta en los datos");
    if (wrong) await answerWrong(page, q);
    else await answerCorrectly(page, q);
    answered++;
    if (!(await isActive(page, "screen-feedback"))) {
      problems.push(q.id + ": no apareció el resultado");
      break;
    }
    const title = await page.textContent("#feedback-title");
    if (!wrong && title !== "¡Correcto!") problems.push(q.id + ": marcada como incorrecta");
    if (wrong && title === "¡Correcto!") problems.push(q.id + ": respuesta incorrecta aceptada");
    const before = parseInt(await page.textContent("#hud-progress"), 10);
    await page.keyboard.press("Enter");
    if (await isActive(page, "screen-play")) {
      const after = parseInt(await page.textContent("#hud-progress"), 10);
      if (after !== before + 1) problems.push(q.id + ": Enter avanzó de " + before + " a " + after);
    }
  }
  return { answered, problems };
}

async function testFullSweep(browser) {
  console.log("Barrido completo: todos los niveles en Práctica y todos los Boss");
  const page = await newPage(browser);
  const worlds = await page.evaluate(() => WORLDS.map((w) => w.id));
  let total = 0;
  const problems = [];
  for (const w of worlds) {
    for (let L = 1; L <= 5; L++) {
      await goMenu(page);
      await page.click("#screen-menu [data-action=practice]");
      await page.click(`[data-world=${w}]`);
      await page.click(`[data-level="${L}"]`);
      const r = await playRun(page);
      total += r.answered;
      problems.push(...r.problems);
    }
  }
  await page.evaluate(() => {
    const u = {};
    WORLDS.forEach((w) => { u[w.id] = true; });
    localStorage.setItem("techQuestUnlocks", JSON.stringify(u));
  });
  for (const w of worlds) {
    await goMenu(page);
    await page.click("#screen-menu [data-action=boss]");
    await page.click(`[data-world=${w}]`);
    const r = await playRun(page);
    total += r.answered;
    problems.push(...r.problems);
  }
  const expected = await page.evaluate(() => WORLDS.reduce((n, w) => n + w.questions.length + (w.boss || []).length, 0));
  check(total === expected, `se respondieron ${total} de ${expected} preguntas`);
  check(problems.length === 0, "todas correctas y Enter avanza de una en una" + (problems.length ? ": " + problems.slice(0, 5).join("; ") : ""));
  check(page.errors.length === 0, "sin errores de JavaScript " + page.errors.join(" | "));
  await page.close();
}

async function testCampaign(browser) {
  console.log("Aventura: progreso, desbloqueos y resumen final");
  const page = await newPage(browser);
  check(await page.$eval("#btn-review", (e) => e.disabled), "Repasar errores deshabilitado sin errores");
  await page.click("#screen-menu [data-action=boss]");
  const lockedBoss = await page.$eval('.world-card:not([data-world="linux"])', (e) => e.disabled);
  check(lockedBoss, "el Boss de un mundo bloqueado no se puede jugar");
  await goMenu(page);
  await page.click("#screen-menu [data-action=play]");
  await page.click("[data-world=linux]");
  check(await page.$eval("#level-grid .level-card:nth-child(2)", (e) => e.disabled), "nivel 2 bloqueado al inicio");
  await page.click('[data-level="1"]');
  const r = await playRun(page);
  check(r.problems.length === 0, "nivel 1 completo sin fallos " + r.problems.join("; "));
  const summary = await page.textContent("#end-summary");
  check(!summary.includes("\\n") && summary.includes("\n"), "resumen con saltos de línea reales");
  check(summary.includes("Modo: Aventura"), "modo en español en el resumen");
  check(/Nuevo récord/.test(summary), "Aventura cuenta para el récord");
  await page.click("#screen-end [data-action=play]");
  await page.click("[data-world=linux]");
  check(!(await page.$eval("#level-grid .level-card:nth-child(2)", (e) => e.disabled)), "nivel 2 desbloqueado tras ganar el 1");
  check(page.errors.length === 0, "sin errores de JavaScript " + page.errors.join(" | "));
  await page.close();
}

async function testReviewAndReset(browser) {
  console.log("Repaso de errores y borrar progreso");
  const page = await newPage(browser);
  await page.click("#screen-menu [data-action=practice]");
  await page.click("[data-world=linux]");
  await page.click('[data-level="1"]');
  const r = await playRun(page, { wrong: true });
  check(r.problems.length === 0, "ninguna respuesta incorrecta se acepta " + r.problems.join("; "));
  const items = await page.$$eval("#end-review-list li", (els) => els.length);
  check(items === r.answered, `la pantalla final lista los ${r.answered} errores (${items})`);
  check(!/Nuevo récord/.test(await page.textContent("#end-summary")), "Práctica no cuenta para el récord");
  await page.click("#screen-end [data-action=menu]");
  check((await page.textContent("#menu-missed")) === String(r.answered), "el menú muestra los errores pendientes");
  await page.click("#btn-review");
  check((await page.textContent("#hud-world")).includes("Repaso"), "modo Repaso iniciado");
  const r2 = await playRun(page);
  check(r2.problems.length === 0 && r2.answered === r.answered, "el Repaso muestra las preguntas falladas");
  await page.click("#screen-end [data-action=menu]");
  check((await page.textContent("#menu-missed")) === "0", "acertarlas vacía la lista de errores");
  await page.click("#screen-menu [data-action=stats]");
  await page.click("[data-action=reset-progress]");
  const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => k !== "techQuestMuted"));
  check(keys.length === 0, "borrar progreso limpia el almacenamiento " + keys.join(","));
  check(page.errors.length === 0, "sin errores de JavaScript " + page.errors.join(" | "));
  await page.close();
}

/** Juega preguntas hasta encontrar la de id dado; devuelve false si la partida acaba antes. */
async function playUntil(page, id) {
  while (await isActive(page, "screen-play")) {
    await page.waitForTimeout(HUMAN_DELAY);
    const q = await currentQuestion(page);
    if (q.id === id) return true;
    await answerCorrectly(page, q);
    await page.keyboard.press("Enter");
  }
  return false;
}

async function testEdgeCases(browser) {
  console.log("Casos límite de entrada");
  const page = await newPage(browser);

  // Doble toque en Continuar no debe contestar la siguiente pregunta
  await page.click("#screen-menu [data-action=marathon]");
  let accidental = 0;
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(HUMAN_DELAY);
    await answerCorrectly(page, await currentQuestion(page));
    const stillFeedback = await page.evaluate(() => {
      document.querySelector("#btn-next-feedback").click();
      const o = document.querySelector("#options .option-btn, .tf-btn");
      if (o) o.click();
      return document.querySelector("#screen-feedback").classList.contains("active");
    });
    if (stillFeedback) accidental++;
  }
  check(accidental === 0, "doble toque en Continuar no contesta la siguiente");

  // Guion largo de teclados móviles en una respuesta con --
  await goMenu(page);
  await page.click("#screen-menu [data-action=practice]");
  await page.click("[data-world=linux]");
  await page.click('[data-level="4"]');
  if (await playUntil(page, "lxL4c")) {
    await page.fill("#fill-input", "du -h —max-depth=1");
    await page.keyboard.press("Enter");
    check((await page.textContent("#feedback-title")) === "¡Correcto!", "acepta — en lugar de --");
    // Clic en Sonido y luego Enter: debe avanzar, no alternar el sonido
    const before = await page.textContent("#btn-mute");
    await page.click("#btn-mute");
    const muted = await page.textContent("#btn-mute");
    await page.keyboard.press("Enter");
    check(before !== muted && (await page.textContent("#btn-mute")) === muted, "Enter tras clic en Sonido no vuelve a alternarlo");
    check(!(await isActive(page, "screen-feedback")), "Enter tras clic en Sonido avanza");
  } else {
    check(false, "no se encontró la pregunta lxL4c");
  }

  // Letras h/m escritas en la respuesta no son atajos
  await goMenu(page);
  await page.click("#screen-menu [data-action=practice]");
  await page.click("[data-world=database]");
  await page.click('[data-level="5"]');
  let found = false;
  while (await isActive(page, "screen-play")) {
    await page.waitForTimeout(HUMAN_DELAY);
    const q = await currentQuestion(page);
    if (q.type === "fill") {
      const mute = await page.textContent("#btn-mute");
      await page.focus("#fill-input");
      await page.keyboard.type("hm");
      check((await page.inputValue("#fill-input")) === "hm", "se puede escribir h y m en la respuesta");
      check((await page.textContent("#btn-mute")) === mute && (await page.$eval("#hint-box", (e) => e.hidden)), "h/m no activan pista ni sonido al escribir");
      found = true;
      break;
    }
    await answerCorrectly(page, q);
    await page.keyboard.press("Enter");
  }
  if (!found) check(false, "no apareció una pregunta de completar");
  check(page.errors.length === 0, "sin errores de JavaScript " + page.errors.join(" | "));
  await page.close();

  // Datos guardados dañados no rompen el juego
  const broken = await newPage(browser);
  await broken.evaluate(() => {
    ["techQuestLevelClears", "techQuestUnlocks", "techQuestStats", "techQuestAchievements", "techQuestBossWins", "techQuestMissed"]
      .forEach((k) => localStorage.setItem(k, "null"));
    localStorage.setItem("techQuestCompletedWorlds", "{roto");
  });
  await broken.reload();
  await broken.click("#screen-menu [data-action=play]");
  await broken.click("[data-world=linux]");
  await broken.click('[data-level="1"]');
  check(await isActive(broken, "screen-play"), "arranca con almacenamiento dañado");
  check(broken.errors.length === 0, "sin errores de JavaScript con datos dañados " + broken.errors.join(" | "));
  await broken.close();
}

/** Simula que el jugador cambia de pestaña o de app (true) y que vuelve (false). */
function setHidden(page, hidden) {
  return page.evaluate((h) => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => h });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => (h ? "hidden" : "visible") });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}

async function testPauseAndFocus(browser) {
  console.log("Cronómetro en segundo plano y foco al ordenar");
  const page = await newPage(browser);
  const seconds = async () => parseInt(await page.textContent("#hud-timer"), 10);

  for (const [mode, label] of [["timer", "Cronómetro"], ["boss", "Boss"]]) {
    await goMenu(page);
    await page.click(`#screen-menu [data-action=${mode}]`);
    await page.click("[data-world=linux]");
    if (mode === "timer") await page.click('[data-level="1"]');
    await page.waitForTimeout(1100);
    await setHidden(page, true);
    const hiddenAt = await seconds();
    await page.waitForTimeout(3200);
    check((await seconds()) === hiddenAt && (await isActive(page, "screen-play")), `${label}: el tiempo se pausa con la pestaña oculta`);
    await setHidden(page, false);
    await page.waitForTimeout(2200);
    const now = await seconds();
    check(now < hiddenAt && now >= hiddenAt - 3, `${label}: el tiempo sigue al volver (${hiddenAt}s → ${now}s)`);
  }

  // Mover un paso con el teclado deja el foco en ese paso
  const target = await page.evaluate(() => {
    for (const w of WORLDS) for (const q of w.questions) if (q.type === "order" && q.items.length >= 4) return { world: w.id, level: q.level || 1, id: q.id };
    return null;
  });
  await goMenu(page);
  await page.click("#screen-menu [data-action=practice]");
  await page.click(`[data-world=${target.world}]`);
  await page.click(`[data-level="${target.level}"]`);
  if (await playUntil(page, target.id)) {
    const focusedStep = () => page.evaluate(() => {
      const b = document.activeElement;
      const li = b && b.closest(".order-item");
      return li ? { idx: [...li.parentNode.children].indexOf(li), text: li.querySelector(".order-text").textContent, dir: b.dataset.dir } : null;
    });
    const texts = () => page.$$eval(".order-text", (els) => els.map((e) => e.textContent));
    const start = await texts();
    await page.focus('.icon-btn[data-dir="1"][data-idx="0"]');
    await page.keyboard.press("Enter");
    let f = await focusedStep();
    check(f && f.idx === 1 && f.text === start[0] && f.dir === "1", "tras bajar un paso el foco sigue en ▼ de ese paso");
    await page.keyboard.press("Space");
    f = await focusedStep();
    check(f && f.idx === 2 && f.text === start[0], "se puede seguir bajándolo sin volver a navegar");
    // Subirlo hasta arriba: ▲ queda deshabilitado y el foco pasa a ▼
    await page.keyboard.press("Shift+Tab");
    for (let i = 0; i < 2; i++) await page.keyboard.press("Enter");
    f = await focusedStep();
    check(f && f.idx === 0 && f.text === start[0] && f.dir === "1", "al llegar arriba el foco pasa a ▼ del mismo paso");
  } else {
    check(false, "no se encontró la pregunta " + target.id);
  }
  check(page.errors.length === 0, "sin errores de JavaScript " + page.errors.join(" | "));
  await page.close();
}

async function testKeyboardScreens(browser) {
  console.log("Foco al cambiar de pantalla con teclado");
  const page = await newPage(browser);
  const focused = () => page.evaluate(() => {
    const a = document.activeElement;
    return a ? a.id || a.getAttribute("data-level") || a.getAttribute("data-world") || a.tagName : null;
  });
  await page.focus("#screen-menu [data-action=practice]");
  await page.keyboard.press("Enter");
  check((await focused()) === "worlds-title", "al elegir modo el foco pasa al título de Mundos");
  await page.keyboard.press("Tab");
  check((await focused()) === "linux", "Tab lleva al primer mundo");
  await page.keyboard.press("Enter");
  check((await focused()) === "levels-title", "al elegir mundo el foco pasa al título de Niveles");
  await page.keyboard.press("Tab");
  check((await focused()) === "1", "Tab lleva al nivel 1");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(HUMAN_DELAY);
  const f = await focused();
  check(f === "question-text" || f === "fill-input", "al empezar el foco queda en la pregunta (" + f + ")");
  await answerCorrectly(page, await currentQuestion(page));
  await page.keyboard.press("Enter");
  await page.waitForTimeout(HUMAN_DELAY);
  const f2 = await focused();
  check(f2 === "question-text" || f2 === "fill-input", "tras Continuar el foco queda en la nueva pregunta (" + f2 + ")");
  // El botón de sonido está fuera de las pantallas: no se le quita el foco
  await page.focus("#btn-mute");
  await page.evaluate(() => UI.showScreen("screen-play"));
  check((await focused()) === "btn-mute", "no roba el foco del botón de sonido");
  check((await page.getAttribute("#hud-timer-wrap", "aria-live")) === "off", "el cronómetro no se anuncia cada segundo");
  check(page.errors.length === 0, "sin errores de JavaScript " + page.errors.join(" | "));
  await page.close();
}

async function testHints(browser) {
  console.log("Pistas por tipo de pregunta");
  const page = await newPage(browser);
  const hints = async () => parseInt(await page.textContent("#hud-hints"), 10);
  // Buscar una pregunta de V/F y una de ordenar en modos con pistas
  let sawTF = false, sawOrder = false;
  for (const world of ["linux", "windows", "networking", "printers"]) {
    if (sawTF && sawOrder) break;
    const levels = await page.evaluate((w) => [...new Set(getWorldById(w).questions.map((q) => q.level || 1))], world);
    for (const L of levels) {
      if (sawTF && sawOrder) break;
      // Práctica oculta las pistas; se juega el mismo nivel en Cronómetro sin límite de tiempo
      await goMenu(page);
      await page.click("#screen-menu [data-action=timer]");
      await page.click(`[data-world=${world}]`);
      await page.click(`[data-level="${L}"]`);
      await page.evaluate(() => { GAME_CONFIG.timerSeconds = 9999; });
      while (await isActive(page, "screen-play")) {
        await page.waitForTimeout(HUMAN_DELAY);
        const q = await currentQuestion(page);
        if (q.type === "tf" && !sawTF) {
          sawTF = true;
          const before = await hints();
          check(await page.$eval("#btn-hint", (e) => e.disabled), "V/F: el botón de pista está deshabilitado");
          await page.keyboard.press("h");
          check((await hints()) === before && (await page.$eval("#hint-box", (e) => e.hidden)), "V/F: la tecla H no gasta una pista");
        } else if (q.type === "order" && !sawOrder && (await hints()) > 0) {
          sawOrder = true;
          const before = await hints();
          await page.click("#btn-hint");
          const first = await page.$eval(".order-text", (e) => e.textContent);
          check(first === q.items[q.answer[0]], "Ordenar: la pista sube el primer paso");
          check((await hints()) === before - 1, "Ordenar: la pista cuesta una");
          check(await page.$eval("#btn-hint", (e) => e.disabled), "tras usar la pista el botón queda deshabilitado");
        }
        await answerCorrectly(page, q);
        await page.keyboard.press("Enter");
      }
    }
  }
  check(sawTF && sawOrder, "se encontraron preguntas de V/F y de ordenar");
  check(page.errors.length === 0, "sin errores de JavaScript " + page.errors.join(" | "));
  await page.close();
}

(async () => {
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
  try {
    await testCampaign(browser);
    await testReviewAndReset(browser);
    await testEdgeCases(browser);
    await testPauseAndFocus(browser);
    await testKeyboardScreens(browser);
    await testHints(browser);
    if (!QUICK) await testFullSweep(browser);
  } finally {
    await browser.close();
  }
  console.log(failures ? `\n${failures} prueba(s) fallaron` : "\nTodas las pruebas pasaron");
  process.exit(failures ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
