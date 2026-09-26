# Tech Quest — Aventura IT

Juego educativo de IT en español (es-MX): Linux, Windows, impresoras, redes,
programación, soporte, ciberseguridad, hardware, cloud y bases de datos.
10 mundos × 5 niveles, más un Desafío Boss por mundo.

## Cómo jugar

Abre `index.html` en el navegador. No necesita servidor, internet ni dependencias;
el progreso se guarda en `localStorage`.

Modos: Aventura, Práctica (sin vidas), Maratón (20 preguntas mezcladas),
Cronómetro, Boss y Repasar errores. Atajos: `1`–`4`, `V`/`F`, `Enter`, `H` (pista), `M` (silencio), `Esc`.

## Estructura

| Archivo | Qué contiene |
| --- | --- |
| `js/data.js` | Configuración, mundos base y logros |
| `js/content-expand.js` | Preguntas extra y bosses |
| `js/levels-expand.js` | Niveles 1–3 y relleno de mundos |
| `js/levels5-expand.js` | Niveles 4–5 y mundos Cloud / Base de datos |
| `js/game.js` | Lógica de partida y modos |
| `js/progress.js`, `js/ui.js`, `js/audio.js` | Progreso, helpers de interfaz y sonido |

## Agregar preguntas

Tipos soportados: `mc`, `identify`, `scenario` (con `options` y `answer` = índice),
`tf` (`answer` booleano), `fill` (`answer` texto y `accept` **arreglo** de variantes),
`match` (`pairs`) y `order` (`items` y `answer` = orden correcto de índices).
Las opciones se barajan al jugar, así que puedes escribir la correcta en cualquier posición.

Antes de subir cambios, valida el contenido:

```sh
node tools/validate-content.js
```

El mismo chequeo corre en GitHub Actions en cada push y pull request.
