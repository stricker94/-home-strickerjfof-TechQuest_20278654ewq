# TechQuest — Instrucciones paso a paso

Guía práctica para jugar, publicar y mantener TechQuest por tu cuenta.
Repositorio: https://github.com/stricker94/-home-strickerjfof-TechQuest_20278654ewq

---

## 1. Jugar en tu computadora

1. Entra al repositorio en GitHub.
2. Presiona el botón verde **Code** y luego **Download ZIP**.
3. Descomprime el ZIP en una carpeta.
4. Abre la carpeta y haz doble clic en `index.html`. Se abre en tu navegador.

No necesita internet ni instalar nada. Tu progreso (niveles, récord, logros y errores)
se guarda en ese navegador. Si abres el juego en otro navegador o en modo incógnito,
empiezas de cero.

## 2. Jugar en el celular (publicarlo con GitHub Pages)

1. En el repositorio, entra a **Settings** y luego a **Pages** (menú izquierdo).
2. En **Build and deployment**, en **Source**, elige **Deploy from a branch**.
3. En **Branch**, elige `main` y la carpeta `/ (root)`. Presiona **Save**.
4. Espera uno o dos minutos y recarga la página de Settings → Pages.
   Arriba aparecerá el enlace, parecido a:
   `https://stricker94.github.io/-home-strickerjfof-TechQuest_20278654ewq/`
5. Abre ese enlace en el celular. En Chrome, menú **⋮** → **Agregar a la pantalla
   principal** para tenerlo como app.

Nota: GitHub Pages gratis solo funciona si el repositorio es **público**. Si es
privado, cámbialo en Settings → General → Danger Zone → Change visibility, o juega
con el ZIP del paso 1.

Cada vez que se hace merge a `main`, la página se actualiza sola en uno o dos minutos.

## 3. Cómo se juega

| Modo | Qué es |
| --- | --- |
| ▶ Aventura | 10 mundos × 5 niveles. Terminar un nivel desbloquea el siguiente; el nivel 5 desbloquea el siguiente mundo. Tienes 3 vidas. |
| 📚 Práctica | Cualquier mundo y nivel, sin vidas y sin pistas. No cuenta para el récord. |
| 🏃 Maratón | 20 preguntas mezcladas de todos los mundos. |
| ⏱️ Cronómetro | 25 segundos por pregunta. El tiempo se pausa si cambias de app o de pestaña. |
| 👹 Boss | Incidente difícil con 20 segundos por pregunta, uno por mundo desbloqueado. |
| 🔁 Repasar errores | Vuelves a jugar lo que fallaste; cada pregunta sale de la lista al acertarla. También aparece como botón al terminar una partida. |

Atajos de teclado: `1`–`4` elegir opción, `V`/`F` verdadero o falso, `Enter` comprobar o
continuar, `H` pista, `M` sonido, `Esc` salir.

Pistas: 2 por partida (1 en Boss), máximo una por pregunta. No hay pista en
Verdadero/Falso, así que ahí no se gasta. En emparejar y ordenar, la pista acomoda
lo primero que tengas mal; si ya está todo bien, no se cobra.

Para empezar de cero: **Stats** → **Borrar progreso**.

## 4. Agregar o corregir preguntas

Las preguntas están en la carpeta `js/`:

| Archivo | Qué tiene |
| --- | --- |
| `js/data.js` | Mundos base, configuración y logros |
| `js/content-expand.js` | Preguntas extra y los Boss |
| `js/levels-expand.js` | Niveles 1 a 3 |
| `js/levels5-expand.js` | Niveles 4 y 5, y los mundos Cloud y Base de datos |

Pasos:

1. Abre el archivo del nivel que quieres en GitHub y presiona el lápiz ✏️ para editar.
2. Busca una pregunta del mismo tipo y cópiala completa (de `{` a `},`).
3. Pégala debajo y cambia:
   - `id`: debe ser **único** (por ejemplo `lxL4z`).
   - `level`: de 1 a 5.
   - `q`: el enunciado.
   - `explain`: la explicación que se muestra al contestar.
   - Los campos de la respuesta según el tipo (tabla abajo).
4. Abajo, en **Commit changes**, elige **Create a new branch** y abre el pull request.
5. Espera a que CI termine en verde (paso 5) antes de hacer el merge.

| Tipo | Campos |
| --- | --- |
| `mc`, `identify`, `scenario` | `options`: lista de opciones. `answer`: número de la correcta, empezando en 0. |
| `tf` | `answer`: `true` o `false`. |
| `fill` | `answer`: texto correcto. `accept`: lista de otras respuestas válidas, por ejemplo `["ls -la", "ls -al"]`. |
| `match` | `pairs`: lista de `{ "left": "...", "right": "..." }`. |
| `order` | `items`: los pasos. `answer`: el orden correcto de los índices, por ejemplo `[2, 0, 1]`. |

Las opciones se barajan al jugar, así que la correcta puede ir en cualquier posición.

## 5. Revisar que nada se rompió (CI)

Cada pull request corre dos revisiones automáticas en GitHub (pestaña **Checks** del PR):

- **validate**: revisa que todas las preguntas estén bien escritas (ids repetidos,
  respuestas fuera de rango, falta de explicación, etc.).
- **Jugar en Chromium**: abre el juego en un navegador y contesta las 540 preguntas,
  además de probar vidas, pistas, cronómetro, teclado y progreso guardado.

Si alguna sale en rojo ❌, entra a **Details**: el mensaje dice qué pregunta o qué
prueba falló. Corrige y vuelve a guardar en la misma rama; CI corre otra vez solo.
Haz el merge solo cuando las dos estén en verde ✅.

## 6. Correr las revisiones en tu computadora (opcional)

Necesitas Node.js 20 o más nuevo (https://nodejs.org).

```sh
npm install
npx playwright install chromium
node tools/validate-content.js   # solo revisa las preguntas (segundos)
node tools/e2e.js quick          # pruebas rápidas (1 a 2 minutos)
npm test                         # todo, incluidas las 540 preguntas (varios minutos)
```

## 7. Pedirle cambios a Claude

1. Escribe lo que quieres en el proyecto (por ejemplo "agrega 10 preguntas de redes
   nivel 3" o "arregla X").
2. Claude hace los cambios en una rama, abre un pull request y lo lleva a CI en verde.
3. Te pregunta "¿Hago el merge del PR #N?". Contesta **sí** para publicarlo.
4. Si usas GitHub Pages, en uno o dos minutos ya está en tu celular.
