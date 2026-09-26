#!/usr/bin/env node
/**
 * Tech Quest — Validador de contenido.
 * Carga los archivos de datos igual que el navegador y revisa que cada
 * pregunta tenga una forma que game.js sepa calificar.
 * Uso: node tools/validate-content.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const files = ["data.js", "content-expand.js", "levels-expand.js", "levels5-expand.js"];

const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
files.forEach((f) => {
  let src = fs.readFileSync(path.join(root, "js", f), "utf8");
  // const/let de nivel superior no se exponen en el contexto: publícalos
  if (f === "data.js") src += "\nthis.WORLDS = WORLDS; this.GAME_CONFIG = GAME_CONFIG; this.ACHIEVEMENTS = ACHIEVEMENTS;";
  vm.runInContext(src, ctx, { filename: f });
});

const { WORLDS, GAME_CONFIG, ACHIEVEMENTS } = ctx;
const maxL = GAME_CONFIG.levelsPerWorld || 5;
const CHOICE = ["mc", "identify", "scenario"];
const TYPES = new Set(CHOICE.concat(["tf", "fill", "match", "order"]));
const errors = [];
const seen = {};
const seenText = {};
const err = (where, msg) => errors.push(where + ": " + msg);
const distinct = (arr) => new Set(arr).size === arr.length;

WORLDS.forEach((w) => {
  const perLevel = {};
  const all = w.questions.map((q) => [q, false]).concat((w.boss || []).map((q) => [q, true]));
  all.forEach(([q, isBoss]) => {
    const where = w.id + "/" + q.id;
    if (!q.id) err(where, "sin id");
    else if (seen[q.id]) err(where, "id duplicado (también en " + seen[q.id] + ")");
    else seen[q.id] = where;
    if (!TYPES.has(q.type)) err(where, "tipo desconocido " + q.type);
    if (!q.q) err(where, "sin enunciado");
    else {
      const key = q.q.trim().toLowerCase();
      if (seenText[key]) err(where, "enunciado repetido (también en " + seenText[key] + ")");
      else seenText[key] = where;
    }
    if (!q.explain) err(where, "sin explicación");
    if (!(Number.isInteger(q.level) && q.level >= 1 && q.level <= maxL)) err(where, "nivel inválido " + q.level);
    if (!isBoss) perLevel[q.level] = (perLevel[q.level] || 0) + 1;

    if (CHOICE.includes(q.type)) {
      if (!Array.isArray(q.options) || q.options.length < 2) err(where, "opciones inválidas");
      else {
        if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) err(where, "answer fuera de rango");
        if (!distinct(q.options)) err(where, "opciones repetidas");
      }
    } else if (q.type === "tf") {
      if (typeof q.answer !== "boolean") err(where, "answer debe ser true/false");
    } else if (q.type === "fill") {
      if (typeof q.answer !== "string" || !q.answer.trim()) err(where, "answer debe ser texto");
      if (q.accept != null && !Array.isArray(q.accept)) err(where, "accept debe ser un arreglo");
    } else if (q.type === "match") {
      if (!Array.isArray(q.pairs) || q.pairs.length < 2) err(where, "pairs inválido");
      else {
        if (!distinct(q.pairs.map((p) => p.left))) err(where, "izquierdas repetidas");
        if (!distinct(q.pairs.map((p) => p.right))) err(where, "derechas repetidas");
      }
    } else if (q.type === "order") {
      const a = q.answer;
      const ok = Array.isArray(q.items) && Array.isArray(a) && a.length === q.items.length &&
        a.slice().sort((x, y) => x - y).every((v, i) => v === i);
      if (!ok) err(where, "answer de order debe ser una permutación de los índices de items");
    }
  });
  for (let L = 1; L <= maxL; L++) if (!perLevel[L]) err(w.id, "el nivel " + L + " no tiene preguntas");
  console.log(w.icon + " " + w.id.padEnd(12) + " niveles " + JSON.stringify(perLevel) + " · boss " + (w.boss || []).length);
});

if (!distinct(ACHIEVEMENTS.map((a) => a.id))) err("ACHIEVEMENTS", "ids repetidos");

if (errors.length) {
  console.error("\n" + errors.length + " error(es):");
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log("\nContenido OK · " + Object.keys(seen).length + " preguntas");
