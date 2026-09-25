/**
 * Tech Quest — Contenido educativo (es-MX)
 * Mundos, preguntas y desafíos
 */

const GAME_CONFIG = {
  maxLives: 3,
  hintsPerWorld: 2,
  pointsCorrect: 100,
  pointsStreakBonus: 25,
  pointsHintPenalty: 30,
  storageKey: "techQuestHighScore",
  storageMuted: "techQuestMuted",
  storageUnlocks: "techQuestUnlocks",
  storageAchievements: "techQuestAchievements",
  storageStats: "techQuestStats",
  storageBoss: "techQuestBossWins",
  storageLevels: "techQuestLevelClears",
  levelsPerWorld: 5,
  marathonCount: 20,
  timerSeconds: 25,
  bossTimerSeconds: 20,
  unlockScoreThreshold: 600
};

const WORLDS = [
  {
    id: "linux",
    name: "Linux básico",
    icon: "🐧",
    color: "#00ff88",
    description: "Comandos, permisos, procesos y el sistema de archivos.",
    questions: [
      {
        id: "lx01",
        type: "mc",
        q: "¿Qué comando lista el contenido de un directorio?",
        options: ["ls", "cd", "pwd", "cat"],
        answer: 0,
        explain: "ls (list) muestra archivos y carpetas. Usa -l para formato largo y -a para incluir ocultos."
      },
      {
        id: "lx02",
        type: "mc",
        q: "¿Qué comando cambia el directorio de trabajo actual?",
        options: ["mv", "cd", "cp", "rm"],
        answer: 1,
        explain: "cd (change directory) te mueve entre carpetas. cd .. sube un nivel; cd ~ va al home."
      },
      {
        id: "lx03",
        type: "fill",
        q: "Escribe el comando para crear un directorio llamado 'proyectos':",
        answer: "mkdir proyectos",
        accept: ["mkdir proyectos", "mkdir ./proyectos"],
        explain: "mkdir crea directorios. mkdir -p crea rutas anidadas si no existen."
      },
      {
        id: "lx04",
        type: "mc",
        q: "En permisos Unix, ¿qué significa el bit de lectura (r)?",
        options: [
          "Ejecutar el archivo",
          "Ver el contenido / listar el directorio",
          "Modificar el propietario",
          "Montar el sistema de archivos"
        ],
        answer: 1,
        explain: "r = read. En archivos permite leer; en directorios, listar entradas."
      },
      {
        id: "lx05",
        type: "order",
        q: "Ordena los pasos para instalar un paquete con apt (de primero a último):",
        items: [
          "sudo apt update",
          "sudo apt install nombre-paquete",
          "Confirmar con Y si se pide",
          "Verificar con apt list --installed | grep nombre"
        ],
        answer: [0, 1, 2, 3],
        explain: "Primero actualizas índices (update), luego instalas, confirmas y opcionalmente verificas."
      },
      {
        id: "lx06",
        type: "mc",
        q: "¿Qué hace chmod 755 archivo.sh?",
        options: [
          "Solo lectura para todos",
          "Dueño: rwx; grupo y otros: r-x",
          "Borra el archivo",
          "Cambia el dueño a root"
        ],
        answer: 1,
        explain: "7=rwx, 5=r-x. El dueño puede todo; grupo/otros leen y ejecutan. Típico en scripts."
      },
      {
        id: "lx07",
        type: "identify",
        q: "¿Qué herramienta o comando usas para ver procesos en ejecución?",
        options: ["ps / top / htop", "chmod", "apt", "mkdir"],
        answer: 0,
        explain: "ps lista procesos; top/htop muestran uso en tiempo real. kill termina un proceso por PID."
      },
      {
        id: "lx08",
        type: "mc",
        q: "¿Dónde suelen estar los archivos de configuración del sistema en Linux?",
        options: ["/home", "/etc", "/tmp", "/dev"],
        answer: 1,
        explain: "/etc contiene configs del sistema (red, servicios, usuarios, etc.)."
      },
      {
        id: "lx09",
        type: "match",
        q: "Relaciona comando con su función:",
        pairs: [
          { left: "pwd", right: "Muestra la ruta actual" },
          { left: "cat", right: "Muestra contenido de un archivo" },
          { left: "rm", right: "Elimina archivos" },
          { left: "whoami", right: "Muestra el usuario actual" }
        ],
        explain: "pwd = print working directory; cat concatena/muestra; rm remueve; whoami indica tu usuario."
      },
      {
        id: "lx10",
        type: "fill",
        q: "Comando para cambiar permisos a 644 en config.txt:",
        answer: "chmod 644 config.txt",
        accept: ["chmod 644 config.txt", "chmod 0644 config.txt"],
        explain: "644 = dueño rw, grupo/otros solo lectura. Común en archivos de configuración."
      },
      {
        id: "lx11",
        type: "mc",
        q: "¿Qué comando muestra información de un usuario y sus grupos?",
        options: ["id", "ls", "df", "ping"],
        answer: 0,
        explain: "id muestra UID, GID y grupos. También: groups, getent passwd."
      },
      {
        id: "lx12",
        type: "mc",
        q: "¿Qué representa / en el sistema de archivos Linux?",
        options: [
          "La carpeta del usuario",
          "La raíz (root) del árbol de directorios",
          "Solo dispositivos USB",
          "El swap"
        ],
        answer: 1,
        explain: "Todo cuelga de /. No hay letras de unidad como en Windows; /home, /var, /usr están bajo /."
      }
    ]
  },
  {
    id: "windows",
    name: "Windows intermedio",
    icon: "🪟",
    color: "#00aaff",
    description: "Servicios, Event Viewer, PowerShell y administración.",
    questions: [
      {
        id: "wn01",
        type: "mc",
        q: "¿Dónde revisas errores y avisos del sistema en Windows?",
        options: ["Paint", "Visor de eventos (Event Viewer)", "Bloc de notas", "Explorador de archivos"],
        answer: 1,
        explain: "Event Viewer (eventvwr.msc) registra Application, Security y System. Útil para diagnosticar fallos."
      },
      {
        id: "wn02",
        type: "mc",
        q: "¿Qué utilidad muestra CPU, memoria y procesos en tiempo real?",
        options: ["cmd", "Administrador de tareas", "Regedit", "msconfig"],
        answer: 1,
        explain: "Task Manager (Ctrl+Shift+Esc): procesos, rendimiento, inicio y usuarios."
      },
      {
        id: "wn03",
        type: "fill",
        q: "Comando en cmd/PowerShell para ver la IP local (forma corta):",
        answer: "ipconfig",
        accept: ["ipconfig", "ipconfig /all"],
        explain: "ipconfig muestra adaptadores e IPs. /all añade DNS, MAC y DHCP."
      },
      {
        id: "wn04",
        type: "mc",
        q: "En PowerShell, ¿qué cmdlet lista servicios?",
        options: ["Get-Service", "Get-Process", "Get-Content", "Set-Location"],
        answer: 0,
        explain: "Get-Service lista servicios. Start-Service / Stop-Service / Restart-Service los controlan."
      },
      {
        id: "wn05",
        type: "order",
        q: "Ordena pasos para reiniciar un servicio con services.msc:",
        items: [
          "Abrir services.msc",
          "Localizar el servicio",
          "Clic derecho → Reiniciar",
          "Verificar que el estado sea En ejecución"
        ],
        answer: [0, 1, 2, 3],
        explain: "También puedes usar Restart-Service NombreEnPowerShell."
      },
      {
        id: "wn06",
        type: "identify",
        q: "¿Qué comando prueba conectividad ICMP a un host?",
        options: ["ping", "dir", "cls", "copy"],
        answer: 0,
        explain: "ping envía ecos ICMP. Si falla, revisa red, firewall o DNS."
      },
      {
        id: "wn07",
        type: "mc",
        q: "¿Qué tipo de cuenta de Windows tiene privilegios elevados por defecto?",
        options: ["Usuario estándar", "Administrador", "Invitado", "Cuenta local sin contraseña"],
        answer: 1,
        explain: "Las cuentas Administrador (o con rol admin) pueden instalar software y cambiar sistema. UAC pide elevación."
      },
      {
        id: "wn08",
        type: "match",
        q: "Relaciona herramienta con uso:",
        pairs: [
          { left: "services.msc", right: "Administrar servicios" },
          { left: "eventvwr.msc", right: "Ver registros de eventos" },
          { left: "taskmgr", right: "Administrador de tareas" },
          { left: "compmgmt.msc", right: "Administración de equipos" }
        ],
        explain: "Muchas consolas MMC (.msc) se abren con Win+R y el nombre del snap-in."
      },
      {
        id: "wn09",
        type: "mc",
        q: "¿Qué hace Get-Process en PowerShell?",
        options: [
          "Lista procesos en ejecución",
          "Formatea el disco",
          "Crea usuarios",
          "Instala Windows Update"
        ],
        answer: 0,
        explain: "Get-Process es el equivalente moderno a tasklist. Stop-Process termina un proceso."
      },
      {
        id: "wn10",
        type: "fill",
        q: "Comando para ver rutas DNS y liberar/renovar DHCP (libera):",
        answer: "ipconfig /release",
        accept: ["ipconfig /release", "ipconfig /release *"],
        explain: "Después suele usarse ipconfig /renew. /flushdns limpia la caché DNS."
      },
      {
        id: "wn11",
        type: "mc",
        q: "Un servicio en estado 'Detenido' que debería estar activo…",
        options: [
          "No afecta a nada",
          "Puede impedir funciones (impresión, red, actualizaciones)",
          "Solo afecta al escritorio",
          "Significa que el PC está apagado"
        ],
        answer: 1,
        explain: "Servicios críticos (Spooler, DHCP Client, Windows Update) deben estar en ejecución según necesidad."
      },
      {
        id: "wn12",
        type: "mc",
        q: "¿Dónde gestionas cuentas locales de usuario en Windows Pro?",
        options: [
          "lusrmgr.msc / Configuración → Cuentas",
          "Solo en Paint",
          "Solo con ping",
          "En el Visor de eventos únicamente"
        ],
        answer: 0,
        explain: "Usuarios y grupos locales (lusrmgr.msc) o Configuración. En dominio se usan AD/GP."
      }
    ]
  },
  {
    id: "printers",
    name: "Impresoras",
    icon: "🖨️",
    color: "#ff66aa",
    description: "Drivers, spooler, colas, red e IPP — nivel intermedio–avanzado.",
    questions: [
      {
        id: "pr01",
        type: "mc",
        q: "¿Qué servicio de Windows gestiona la cola de impresión?",
        options: ["Spooler (Print Spooler)", "BITS", "Windows Audio", "Themes"],
        answer: 0,
        explain: "Print Spooler (spoolsv.exe) encola trabajos. Si falla, reinícialo en services.msc."
      },
      {
        id: "pr02",
        type: "mc",
        q: "Un driver de impresora incorrecto suele causar…",
        options: [
          "Mejor calidad siempre",
          "Errores, caracteres basura o que no imprima",
          "Más RAM en el PC",
          "Que el monitor se apague"
        ],
        answer: 1,
        explain: "Instala el driver del fabricante o el genérico correcto (PCL/PS/IPP) según el modelo."
      },
      {
        id: "pr03",
        type: "order",
        q: "Ordena el diagnóstico básico cuando no imprime:",
        items: [
          "Verificar alimentación y conexión (USB/red)",
          "Comprobar que es la impresora predeterminada",
          "Revisar cola / reiniciar Spooler",
          "Probar página de prueba / reinstalar driver"
        ],
        answer: [0, 1, 2, 3],
        explain: "De lo físico a lo lógico: cable/papel → cola → driver → red."
      },
      {
        id: "pr04",
        type: "mc",
        q: "IPP en impresión en red significa…",
        options: [
          "Internet Printing Protocol",
          "Internal Paper Protocol",
          "IP Private Printer",
          "Ink Pressure Pump"
        ],
        answer: 0,
        explain: "IPP (suele puerto 631) permite imprimir por IP/hostname. AirPrint y muchas MFP lo usan."
      },
      {
        id: "pr05",
        type: "identify",
        q: "¿Qué indica un LED o mensaje de 'Toner bajo'?",
        options: [
          "El cartucho de tóner está casi agotado",
          "Falta papel únicamente",
          "El Spooler está detenido",
          "La IP está mal"
        ],
        answer: 0,
        explain: "Sustituye o agita el cartucho según el modelo. No confundir con 'Atasco de papel'."
      },
      {
        id: "pr06",
        type: "match",
        q: "Relaciona tipo de conexión con característica:",
        pairs: [
          { left: "USB", right: "Conexión directa al PC" },
          { left: "Ethernet", right: "IP fija o DHCP en LAN" },
          { left: "Wi-Fi", right: "Misma red inalámbrica" },
          { left: "Cola compartida", right: "PC servidor comparte la impresora" }
        ],
        explain: "En oficinas suele preferirse red (Ethernet/Wi-Fi) para varios usuarios."
      },
      {
        id: "pr07",
        type: "fill",
        q: "Nombre del servicio de cola de impresión en Windows (inglés):",
        answer: "Print Spooler",
        accept: ["print spooler", "Print Spooler", "Spooler", "spooler"],
        explain: "Nombre para mostrar: Print Spooler. Nombre corto a veces Spooler."
      },
      {
        id: "pr08",
        type: "mc",
        q: "Trabajos atascados en la cola. Acción frecuente:",
        options: [
          "Borrar trabajos / reiniciar Spooler / limpiar C:\\Windows\\System32\\spool\\PRINTERS",
          "Formatear el disco C:",
          "Desinstalar Windows",
          "Cambiar la resolución del monitor"
        ],
        answer: 0,
        explain: "Detén Spooler, vacía la carpeta de spool, inicia Spooler de nuevo. Con cuidado y permisos admin."
      },
      {
        id: "pr09",
        type: "mc",
        q: "Para agregar impresora por IP en Windows suele usarse:",
        options: [
          "Puerto TCP/IP estándar (o IPP) con la IP del dispositivo",
          "Solo Bluetooth del ratón",
          "Un cable HDMI",
          "Regedit obligatorio"
        ],
        answer: 0,
        explain: "Configuración → Impresoras → Agregar → TCP/IP o hostname. Verifica ping a la IP primero."
      },
      {
        id: "pr10",
        type: "mc",
        q: "Atasco de papel: primer paso seguro:",
        options: [
          "Abrir tapas, retirar papel en la dirección del paso (sin forzar)",
          "Meter más papel con fuerza",
          "Golpear la impresora",
          "Ignorar y reimprimir 50 veces"
        ],
        answer: 0,
        explain: "Sigue las guías del fabricante. Revisa rodillos y sensores después del atasco."
      },
      {
        id: "pr11",
        type: "mc",
        q: "Una impresora de red no aparece. ¿Qué revisar primero a nivel red?",
        options: [
          "Misma VLAN/subred, IP, ping y firewall",
          "Solo el tema de Windows",
          "La versión de Excel",
          "El volumen de audio"
        ],
        answer: 0,
        explain: "Sin conectividad IP no habrá descubrimiento ni puerto 9100/IPP. Revisa también discovery (mDNS/WS-Discovery)."
      },
      {
        id: "pr12",
        type: "order",
        q: "Ordena pasos para instalar impresora de red por IP:",
        items: [
          "Obtener IP de la impresora (panel o DHCP)",
          "Hacer ping a la IP desde el PC",
          "Agregar impresora TCP/IP o IPP",
          "Instalar/seleccionar driver y página de prueba"
        ],
        answer: [0, 1, 2, 3],
        explain: "Validar red antes de drivers evita horas de frustración."
      }
    ]
  },
  {
    id: "networks",
    name: "Redes e infraestructura",
    icon: "🌐",
    color: "#ffaa00",
    description: "TCP/IP, DNS, DHCP, subredes, firewall, Wi-Fi y VPN.",
    questions: [
      {
        id: "net01",
        type: "mc",
        q: "¿Qué protocolo resuelve nombres de dominio a direcciones IP?",
        options: ["DNS", "FTP", "SMTP", "ARP"],
        answer: 0,
        explain: "DNS traduce ejemplo.com → IP. Sin DNS navegas solo por IP numérica."
      },
      {
        id: "net02",
        type: "mc",
        q: "DHCP principalmente…",
        options: [
          "Asigna IP, máscara, gateway y DNS automáticamente",
          "Encripta discos",
          "Compila código",
          "Gestiona impresoras USB"
        ],
        answer: 0,
        explain: "DHCP entrega configuración IP por lease. El servidor evita conflictos de IP."
      },
      {
        id: "net03",
        type: "mc",
        q: "Diferencia clave: switch vs router",
        options: [
          "Switch: capa 2 LAN; Router: enruta entre redes (capa 3)",
          "Son exactamente lo mismo",
          "Router solo sirve Wi-Fi doméstico",
          "Switch solo funciona con fibra"
        ],
        answer: 0,
        explain: "El switch conecta hosts en la misma red; el router conecta redes distintas y suele hacer NAT."
      },
      {
        id: "net04",
        type: "fill",
        q: "Puerto TCP por defecto de HTTPS:",
        answer: "443",
        accept: ["443"],
        explain: "HTTP usa 80; HTTPS (TLS) usa 443. El candado indica cifrado, no necesariamente sitio 'seguro' al 100%."
      },
      {
        id: "net05",
        type: "mc",
        q: "En IPv4, ¿cuántos bits tiene una dirección?",
        options: ["32", "64", "128", "8"],
        answer: 0,
        explain: "IPv4 = 32 bits (ej. 192.168.1.10). IPv6 = 128 bits."
      },
      {
        id: "net06",
        type: "match",
        q: "Relaciona concepto con definición:",
        pairs: [
          { left: "Gateway", right: "Salida hacia otras redes" },
          { left: "Máscara", right: "Define red vs host" },
          { left: "Firewall", right: "Filtra tráfico según reglas" },
          { left: "VPN", right: "Túnel cifrado hacia otra red" }
        ],
        explain: "Juntos forman la base de acceso seguro y segmentación."
      },
      {
        id: "net07",
        type: "mc",
        q: "¿Qué cable de red UTP es común en Gigabit Ethernet?",
        options: ["Cat5e / Cat6", "HDMI", "VGA", "USB-A a Lightning"],
        answer: 0,
        explain: "Cat5e soporta 1 Gbps; Cat6/Cat6a mejores márgenes. RJ-45 es el conector."
      },
      {
        id: "net08",
        type: "order",
        q: "Ordena el flujo típico al abrir https://sitio.com:",
        items: [
          "Consulta DNS → obtiene IP",
          "TCP handshake al puerto 443",
          "TLS handshake (certificado)",
          "HTTP GET cifrado y respuesta"
        ],
        answer: [0, 1, 2, 3],
        explain: "DNS → TCP → TLS → HTTP. Fallos en cualquiera rompen la carga de la página."
      },
      {
        id: "net09",
        type: "mc",
        q: "Una máscara /24 equivale a…",
        options: ["255.255.255.0", "255.255.0.0", "255.0.0.0", "255.255.255.255"],
        answer: 0,
        explain: "/24 = 24 bits de red → ~254 hosts útiles. Muy usada en LAN domésticas/oficina."
      },
      {
        id: "net10",
        type: "identify",
        q: "¿Qué dispositivo suele hacer NAT hacia Internet en casa?",
        options: ["Router / gateway doméstico", "Monitor", "Teclado", "Impresora solo USB"],
        answer: 0,
        explain: "El router casero traduce IPs privadas a la IP pública del ISP (NAT/PAT)."
      },
      {
        id: "net11",
        type: "mc",
        q: "Wi-Fi 2.4 GHz vs 5 GHz (idea general):",
        options: [
          "2.4: más alcance, más interferencia; 5: más velocidad, menos alcance",
          "5 GHz siempre más lento",
          "2.4 no existe",
          "Son protocolos de impresión"
        ],
        answer: 0,
        explain: "Elige banda según distancia e interferencias. 6 GHz (Wi-Fi 6E) añade otra opción."
      },
      {
        id: "net12",
        type: "fill",
        q: "Protocolo de la capa de transporte orientado a conexión (sigla):",
        answer: "TCP",
        accept: ["TCP", "tcp", "Transmission Control Protocol"],
        explain: "TCP garantiza orden y retransmisión. UDP es más ligero, sin conexión."
      },
      {
        id: "net13",
        type: "mc",
        q: "Un firewall que bloquea el puerto 22…",
        options: [
          "Puede impedir SSH entrante",
          "Borra todos los archivos",
          "Acelera el Wi-Fi automáticamente",
          "Instala antivirus"
        ],
        answer: 0,
        explain: "Puerto 22 = SSH. Reglas de firewall controlan qué servicios son alcanzables."
      }
    ]
  },
  {
    id: "programming",
    name: "Programación básica",
    icon: "💻",
    color: "#bb88ff",
    description: "Variables, control de flujo, web básica, depuración y git.",
    questions: [
      {
        id: "pg01",
        type: "mc",
        q: "Una variable es…",
        options: [
          "Un nombre que guarda un valor en memoria",
          "Un cable de red",
          "Un tipo de impresora",
          "Un permiso de Linux"
        ],
        answer: 0,
        explain: "Ej.: let edad = 20; puedes leer y (si no es const) reasignar el valor."
      },
      {
        id: "pg02",
        type: "mc",
        q: "¿Qué estructura ejecuta código solo si una condición es verdadera?",
        options: ["if / else", "solo console.log", "CDN", "DHCP"],
        answer: 0,
        explain: "if (condición) { … } else { … }. También switch y operadores ternarios."
      },
      {
        id: "pg03",
        type: "mc",
        q: "Un bucle for sirve para…",
        options: [
          "Repetir un bloque un número controlado de veces",
          "Apagar el servidor DNS",
          "Crear usuarios de Windows",
          "Montar particiones"
        ],
        answer: 0,
        explain: "for (let i = 0; i < n; i++) { … }. while repite mientras la condición sea true."
      },
      {
        id: "pg04",
        type: "fill",
        q: "En JavaScript, palabra clave moderna para declarar variable de bloque reasignable:",
        answer: "let",
        accept: ["let"],
        explain: "let y const tienen alcance de bloque. Evita var en código nuevo."
      },
      {
        id: "pg05",
        type: "match",
        q: "Relaciona tecnología web con rol:",
        pairs: [
          { left: "HTML", right: "Estructura del contenido" },
          { left: "CSS", right: "Estilo y diseño" },
          { left: "JavaScript", right: "Comportamiento interactivo" },
          { left: "Git", right: "Control de versiones" }
        ],
        explain: "HTML+CSS+JS forman el front-end clásico; Git guarda historial del código."
      },
      {
        id: "pg06",
        type: "mc",
        q: "Una función es…",
        options: [
          "Un bloque reutilizable con nombre que puede recibir parámetros",
          "Un tipo de switch de red",
          "Un driver de impresora",
          "Una IP pública"
        ],
        answer: 0,
        explain: "function saludar(nombre) { return 'Hola ' + nombre; } — DRY: Don't Repeat Yourself."
      },
      {
        id: "pg07",
        type: "order",
        q: "Ordena un flujo básico de git para guardar cambios:",
        items: [
          "git status (revisar)",
          "git add archivo",
          "git commit -m \"mensaje\"",
          "git push (si hay remoto)"
        ],
        answer: [0, 1, 2, 3],
        explain: "add prepara el stage; commit guarda snapshot local; push envía al remoto."
      },
      {
        id: "pg08",
        type: "identify",
        q: "¿Qué herramienta del navegador ayuda a depurar JS?",
        options: ["DevTools / consola", "Paint", "Event Viewer", "apt"],
        answer: 0,
        explain: "F12 → Console, Sources, Network. console.log y breakpoints son tus amigos."
      },
      {
        id: "pg09",
        type: "mc",
        q: "¿Qué hace git branch?",
        options: [
          "Lista o crea ramas de desarrollo",
          "Formatea el disco",
          "Instala Node",
          "Abre PowerShell"
        ],
        answer: 0,
        explain: "Las ramas aíslan features. git checkout / git switch cambia de rama."
      },
      {
        id: "pg10",
        type: "fill",
        q: "Etiqueta HTML básica para un párrafo:",
        answer: "<p>",
        accept: ["<p>", "<p></p>", "p"],
        explain: "Los párrafos van en <p>…</p>. Encabezados: <h1>…<h6>."
      },
      {
        id: "pg11",
        type: "mc",
        q: "Un error 'undefined is not a function' suele indicar…",
        options: [
          "Llamaste algo que no es una función (variable undefined/mal nombre)",
          "Que la red está caída siempre",
          "Que falta tóner",
          "Que chmod falló"
        ],
        answer: 0,
        explain: "Revisa nombres, imports y si el valor existe antes de invocarlo."
      },
      {
        id: "pg12",
        type: "mc",
        q: "CSS: ¿qué propiedad cambia el color del texto?",
        options: ["color", "margin", "display", "flex-direction"],
        answer: 0,
        explain: "color afecta el texto; background-color el fondo. Usa contraste alto para accesibilidad."
      },
      {
        id: "pg13",
        type: "order",
        q: "Ordena la depuración mínima de un bug:",
        items: [
          "Reproducir el error",
          "Leer el mensaje / stack trace",
          "Aislar la causa (hipótesis)",
          "Corregir y verificar"
        ],
        answer: [0, 1, 2, 3],
        explain: "Sin reproducir, no sabes si lo arreglaste. Los mensajes de error son pistas valiosas."
      }
    ]
  }
];

function getWorldById(id) {
  return WORLDS.find((w) => w.id === id);
}

function countAllQuestions() {
  return WORLDS.reduce((n, w) => n + w.questions.length + (w.boss ? w.boss.length : 0), 0);
}

function getAllPoolQuestions() {
  const pool = [];
  WORLDS.forEach((w) => {
    w.questions.forEach((q) => pool.push(Object.assign({ _worldId: w.id }, q)));
  });
  return pool;
}

const ACHIEVEMENTS = [
  { id: "first_win", icon: "🏁", name: "Primera victoria", desc: "Completa un mundo por primera vez." },
  { id: "streak5", icon: "🔥", name: "Racha x5", desc: "Consigue una racha de 5 aciertos." },
  { id: "streak10", icon: "⚡", name: "Racha x10", desc: "Consigue una racha de 10 aciertos." },
  { id: "no_hints", icon: "🧠", name: "Sin pistas", desc: "Gana un mundo normal sin usar pistas." },
  { id: "all_worlds", icon: "🌍", name: "Maestro de mundos", desc: "Completa el nivel 5 (Maestro) de todos los mundos." },
  { id: "marathon", icon: "🏃", name: "Maratonista", desc: "Termina el modo Maratón." },
  { id: "boss_slayer", icon: "👹", name: "Cazador de jefes", desc: "Derrota un Desafío Boss." },
  { id: "all_bosses", icon: "👑", name: "Rey de jefes", desc: "Derrota el boss de cada mundo." },
  { id: "timer_ace", icon: "⏱️", name: "Contrarreloj", desc: "Gana una partida en modo Cronómetro." },
  { id: "support_hero", icon: "🎫", name: "Héroe de soporte", desc: "Completa el mundo Soporte IT." },
  { id: "level_master", icon: "⭐", name: "Maestro de niveles", desc: "Completa 25 niveles en total." },
  { id: "security_hero", icon: "🛡️", name: "Escudo digital", desc: "Completa el nivel 5 de Ciberseguridad." },
  { id: "hardware_hero", icon: "🔧", name: "Manitas de hardware", desc: "Completa el nivel 5 de Hardware." },
  { id: "cloud_hero", icon: "☁️", name: "Nómada cloud", desc: "Completa el nivel 5 de Cloud / servicios." },
  { id: "database_hero", icon: "🗄️", name: "DBA aprendiz", desc: "Completa el nivel 5 de Base de datos." },
  { id: "world_maestro", icon: "🏅", name: "Maestro de un mundo", desc: "Completa los 5 niveles de un mismo mundo." },
  { id: "all_levels", icon: "🌌", name: "Completista", desc: "Completa los 5 niveles de todos los mundos." }
];
