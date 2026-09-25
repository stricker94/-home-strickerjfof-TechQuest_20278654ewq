/**
 * Tech Quest — Niveles 1–3 base + mundos (L4–L5 y mundos extra en levels5-expand.js)
 * Se aplica después de data.js y content-expand.js
 */
(function levelsExpand() {
  const LEVEL_LABELS = {
    1: { name: "Básico", icon: "1️⃣" },
    2: { name: "Intermedio", icon: "2️⃣" },
    3: { name: "Avanzado", icon: "3️⃣" },
    4: { name: "Experto", icon: "4️⃣" },
    5: { name: "Maestro", icon: "5️⃣" }
  };

  function ensureLevels(questions) {
    const n = questions.length;
    questions.forEach((q, i) => {
      if (q.level == null) {
        if (i < Math.ceil(n / 3)) q.level = 1;
        else if (i < Math.ceil((2 * n) / 3)) q.level = 2;
        else q.level = 3;
      }
    });
  }

  function add(worldId, questions) {
    const w = getWorldById(worldId);
    if (!w) return;
    w.questions = w.questions.concat(questions);
  }

  function pushWorld(world) {
    if (getWorldById(world.id)) return;
    WORLDS.push(world);
  }

  function questionsForLevel(world, level) {
    return (world.questions || []).filter((q) => q.level === level);
  }

  // Assign levels to existing content first
  WORLDS.forEach((w) => {
    ensureLevels(w.questions);
    if (w.boss) w.boss.forEach((q) => { if (q.level == null) q.level = 3; });
  });

  // ——— Pad existing worlds to ≥10 per level (focus printers/networks) ———
  add("linux", [
    { id: "lxL1a", level: 1, type: "mc", q: "¿Qué comando muestra la ruta del directorio actual?", options: ["pwd", "ls", "cd", "rm"], answer: 0, explain: "pwd = print working directory." },
    { id: "lxL1b", level: 1, type: "tf", q: "El comando 'man ls' muestra la ayuda del comando ls.", answer: true, explain: "man abre el manual. También: ls --help." },
    { id: "lxL1c", level: 1, type: "fill", q: "Comando para copiar archivo.txt a /tmp:", answer: "cp archivo.txt /tmp", accept: ["cp archivo.txt /tmp", "cp archivo.txt /tmp/"], explain: "cp origen destino. Usa -r para copiar directorios." },
    { id: "lxL1d", level: 1, type: "mc", q: "¿Qué hace 'cd ..'?", options: ["Sube un nivel en el árbol de directorios", "Formatea el disco", "Lista procesos", "Instala paquetes"], answer: 0, explain: ".. es el directorio padre." },
    { id: "lxL2a", level: 2, type: "mc", q: "¿Qué hace 'grep -i error log.txt'?", options: ["Busca 'error' sin distinguir mayúsculas en log.txt", "Borra el archivo", "Cambia permisos", "Monta un disco"], answer: 0, explain: "grep filtra líneas. -i ignora mayúsculas." },
    { id: "lxL2b", level: 2, type: "scenario", q: "Necesitas ver quién está conectado al servidor. ¿Comando típico?", options: ["who / w", "mkdir", "apt update", "chmod 777"], answer: 0, explain: "who y w muestran sesiones activas." },
    { id: "lxL2c", level: 2, type: "fill", q: "Comando para cambiar dueño de file.txt a usuario ana:", answer: "chown ana file.txt", accept: ["chown ana file.txt", "chown ana:ana file.txt"], explain: "chown usuario archivo. A menudo requiere sudo." },
    { id: "lxL2d", level: 2, type: "order", q: "Ordena crear y entrar a ~/labs/demo:", items: ["cd ~", "mkdir -p labs/demo", "cd labs/demo", "pwd"], answer: [0, 1, 2, 3], explain: "mkdir -p crea la ruta; luego entras y verificas." },
    { id: "lxL3a", level: 3, type: "mc", q: "Un proceso en estado Z (zombie) indica…", options: ["Proceso terminado cuyo padre aún no hizo wait", "Que falta RAM siempre", "Que apt falló", "Un virus obligatorio"], answer: 0, explain: "Los zombies ocupan una entrada en la tabla de procesos hasta que el padre recolecta el estado." },
    { id: "lxL3b", level: 3, type: "scenario", q: "Servicio no inicia: 'Address already in use'. ¿Primera idea?", options: ["Ver qué proceso usa el puerto (ss/netstat/lsof) y liberarlo", "Solo chmod 777 /", "Borrar /etc", "Desactivar SELinux a ciegas siempre"], answer: 0, explain: "Conflicto de puerto: identifica PID y decide reinicio o cambio de puerto." },
    { id: "lxL3c", level: 3, type: "fill", q: "Comando para ver sockets en escucha (ss forma corta común):", answer: "ss -tulpn", accept: ["ss -tulpn", "ss -tuln", "netstat -tulpn"], explain: "ss es el moderno; -tulpn muestra TCP/UDP listening con procesos." },
    { id: "lxL3d", level: 3, type: "tf", q: "systemctl restart nginx reinicia el servicio nginx en sistemas con systemd.", answer: true, explain: "systemctl controla unidades: start/stop/restart/status/enable." }
  ]);

  add("windows", [
    { id: "wnL1a", level: 1, type: "mc", q: "¿Qué atajo abre el Administrador de tareas?", options: ["Ctrl+Shift+Esc", "Ctrl+S", "Alt+F4", "Win+L"], answer: 0, explain: "Ctrl+Shift+Esc abre Task Manager directamente." },
    { id: "wnL1b", level: 1, type: "tf", q: "Win+I abre Configuración de Windows.", answer: true, explain: "Win+I es el atajo moderno a Settings." },
    { id: "wnL1c", level: 1, type: "fill", q: "Comando para listar archivos en cmd:", answer: "dir", accept: ["dir", "dir /w"], explain: "dir es el equivalente aproximado a ls." },
    { id: "wnL1d", level: 1, type: "identify", q: "¿Dónde ves adaptadores e IP rápidamente?", options: ["ipconfig", "notepad", "mspaint", "calc"], answer: 0, explain: "ipconfig /all da detalle completo." },
    { id: "wnL2a", level: 2, type: "mc", q: "¿Qué hace sfc /scannow?", options: ["Verifica e intenta reparar archivos de sistema", "Formatea el disco", "Crea usuarios", "Instala drivers de red"], answer: 0, explain: "System File Checker. Útil tras corrupción de componentes." },
    { id: "wnL2b", level: 2, type: "scenario", q: "Un servicio crítico está detenido. Herramienta GUI clásica:", options: ["services.msc", "paint", "solitaire", "magnifier"], answer: 0, explain: "También: Get-Service / Restart-Service en PowerShell." },
    { id: "wnL2c", level: 2, type: "order", q: "Ordena liberar y renovar DHCP:", items: ["Abrir cmd/PowerShell como admin si hace falta", "ipconfig /release", "ipconfig /renew", "ipconfig /all para verificar"], answer: [0, 1, 2, 3], explain: "Release suelta el lease; renew pide uno nuevo." },
    { id: "wnL2d", level: 2, type: "fill", q: "Cmdlet para listar procesos:", answer: "Get-Process", accept: ["Get-Process", "get-process"], explain: "Get-Process lista procesos; Stop-Process los termina." },
    { id: "wnL3a", level: 3, type: "mc", q: "El canal seguro con el DC falla tras cambiar la hora mucho. Relacionado con…", options: ["Kerberos sensible al skew de tiempo", "Solo el color del tema", "El Spooler siempre", "Cat6"], answer: 0, explain: "Sincroniza hora (NTP) antes de reintentar join/login de dominio." },
    { id: "wnL3b", level: 3, type: "scenario", q: "GPO no aplica. ¿Chequeo útil?", options: ["gpresult / gpupdate y Event Viewer", "Solo reiniciar impresora", "Cambiar wallpaper", "Desinstalar .NET siempre"], answer: 0, explain: "gpupdate /force y gpresult /h report.html ayudan a diagnosticar." },
    { id: "wnL3c", level: 3, type: "tf", q: "BitLocker cifra volúmenes para proteger datos en reposo.", answer: true, explain: "Útil en laptops. Guarda claves de recuperación de forma segura." },
    { id: "wnL3d", level: 3, type: "match", q: "Empareja herramienta y uso:", pairs: [
      { left: "diskmgmt.msc", right: "Administrar discos/particiones" },
      { left: "devmgmt.msc", right: "Administrador de dispositivos" },
      { left: "eventvwr.msc", right: "Visor de eventos" },
      { left: " Lusrmgr.msc", right: "Usuarios y grupos locales" }
    ], explain: "Las consolas .msc aceleran la administración." }
  ]);

  add("printers", [
    { id: "prL1a", level: 1, type: "mc", q: "Si la impresora no enciende, lo primero es revisar…", options: ["Alimentación y cable de corriente", "El color del tema de Windows", "La versión de Python", "El canal Wi‑Fi 14"], answer: 0, explain: "Siempre empieza por lo físico: corriente, cable, interruptor." },
    { id: "prL1b", level: 1, type: "tf", q: "Una página de prueba ayuda a saber si el fallo es de la impresora o de un documento.", answer: true, explain: "Si la prueba sale y Word no, mira driver/app." },
    { id: "prL1c", level: 1, type: "identify", q: "Indicador típico de papel atascado:", options: ["Mensaje/LED de jam o paper jam", "Solo 'toner OK'", "IP 0.0.0.0 siempre", "Puntuación alta en el juego"], answer: 0, explain: "Abre tapas y retira papel en el sentido del paso sin forzar." },
    { id: "prL1d", level: 1, type: "mc", q: "USB vs red para una sola persona en casa: suele ser más simple…", options: ["USB directo al PC", "Siempre fibra dedicada", "Solo LPR legacy", "Solo puerto 3389"], answer: 0, explain: "USB es plug-and-play. Red brilla cuando hay varios usuarios." },
    { id: "prL1e", level: 1, type: "fill", q: "Nombre del servicio de cola en Windows (inglés corto frecuente):", answer: "Spooler", accept: ["Spooler", "Print Spooler", "spooler"], explain: "Print Spooler gestiona la cola." },
    { id: "prL2a", level: 2, type: "mc", q: "WSD en impresión Windows significa a grandes rasgos…", options: ["Web Services for Devices (descubrimiento)", "Windows Super Driver", "Wide Subnet DHCP", "Wired Serial Dongle"], answer: 0, explain: "WSD ayuda a descubrir dispositivos; a veces se prefiere puerto TCP/IP estándar por estabilidad." },
    { id: "prL2b", level: 2, type: "scenario", q: "Cola en 'Error - imprimiendo' eternamente. Paso frecuente:", options: ["Reiniciar Spooler y limpiar trabajos atascados", "Formatear el DC", "Cambiar MTU a 9000 siempre", "Desactivar IPv4"], answer: 0, explain: "Spooler + carpeta de spool + driver correcto resuelven muchos atascos lógicos." },
    { id: "prL2c", level: 2, type: "order", q: "Ordena agregar impresora TCP/IP:", items: ["Obtener IP de la impresora", "Ping a la IP", "Crear puerto TCP/IP o IPP", "Instalar driver y página de prueba"], answer: [0, 1, 2, 3], explain: "Valida red antes de pelear con drivers." },
    { id: "prL2d", level: 2, type: "mc", q: "SNMP en impresoras de red sirve para…", options: ["Monitorear estado (tóner, bandejas, errores)", "Reemplazar al cable USB siempre", "Cifrar el disco del PC", "Compilar el kernel"], answer: 0, explain: "Muchas consolas de flota leen OID SNMP del dispositivo." },
    { id: "prL2e", level: 2, type: "tf", q: "Un print server puede desplegar drivers a clientes vía point-and-print (con políticas adecuadas).", answer: true, explain: "En dominio facilita estandarizar modelos; revisa restricciones de seguridad modernas." },
    { id: "prL3a", level: 3, type: "mc", q: "AirPrint tipicamente se apoya en…", options: ["mDNS/Bonjour + IPP", "Solo LPT1", "Solo RDP", "Solo WEP"], answer: 0, explain: "Dispositivos Apple descubren la impresora y hablan IPP." },
    { id: "prL3b", level: 3, type: "scenario", q: "Print server imprime a 9100 pero clientes SMB ven acceso denegado. Enfoque:", options: ["Permisos del share/seguridad de impresora + grupos", "Solo cambiar tóner", "Subir la resolución del monitor", "Desactivar Spooler del server"], answer: 0, explain: "Capa de red al dispositivo OK; falla autorización SMB/NTFS/share." },
    { id: "prL3c", level: 3, type: "match", q: "Empareja PDL/idea:", pairs: [
      { left: "PCL", right: "Lenguaje típico HP / amplio en oficina" },
      { left: "PostScript", right: "Lenguaje Adobe; artes gráficas" },
      { left: "PDF direct", right: "Algunas MFP imprimen PDF nativo" },
      { left: "Raw 9100", right: "Bytes al puerto sin cola compleja" }
    ], explain: "Mismatch de PDL = basura en página." },
    { id: "prL3d", level: 3, type: "fill", q: "Puerto LPR/LPD clásico (número):", answer: "515", accept: ["515"], explain: "515/tcp LPR. IPP=631, raw=9100." },
    { id: "prL3e", level: 3, type: "order", q: "Incidente: flota offline tras cambio de VLAN. Ordena:", items: ["Confirmar gateway/máscara nueva en impresoras", "Actualizar puertos TCP/IP o DNS de clientes", "Probar ping y 9100/631 desde print server", "Página de prueba y comunicar a usuarios"], answer: [0, 1, 2, 3], explain: "Cambio de L3 rompe puertos antiguos; actualiza inventario." }
  ]);

  add("networks", [
    { id: "netL1a", level: 1, type: "mc", q: "¿Qué dispositivo suele conectar PCs en la misma LAN a nivel de tramas?", options: ["Switch", "Monitor", "Impresora solo USB", "Teclado"], answer: 0, explain: "El switch reenvía frames en la LAN (capa 2)." },
    { id: "netL1b", level: 1, type: "tf", q: "192.168.0.0/16 es un rango típico de direcciones privadas.", answer: true, explain: "También 10.0.0.0/8 y 172.16.0.0/12 (RFC 1918)." },
    { id: "netL1c", level: 1, type: "fill", q: "Comando Windows para probar eco ICMP a 1.1.1.1:", answer: "ping 1.1.1.1", accept: ["ping 1.1.1.1"], explain: "ping verifica conectividad básica (si ICMP no está filtrado)." },
    { id: "netL1d", level: 1, type: "mc", q: "HTTPS cifra el tráfico web usando típicamente TLS sobre el puerto…", options: ["443", "21", "25", "9100"], answer: 0, explain: "443/tcp. El candado indica cifrado, no inmunidad total." },
    { id: "netL1e", level: 1, type: "identify", q: "¿Qué resuelve nombres a IP?", options: ["DNS", "Spooler", "BIOS", "GPU"], answer: 0, explain: "Sin DNS navegas por IP numérica." },
    { id: "netL2a", level: 2, type: "mc", q: "¿Cuántos hosts útiles aprox. en /26?", options: ["62", "254", "6", "1022"], answer: 0, explain: "2^(32-26)-2 = 62." },
    { id: "netL2b", level: 2, type: "scenario", q: "Dos PCs con IP 192.168.1.10/24 y 192.168.2.10/24 no se hacen ping. ¿Por qué típico?", options: ["Están en subredes distintas sin router entre ellas", "Falta tóner", "Cat5e no existe", "RDP bloquea ping siempre"], answer: 0, explain: "Misma capa L2 no basta si la máscara las separa en redes L3 distintas." },
    { id: "netL2c", level: 2, type: "order", q: "Ordena DHCP DORA:", items: ["Discover", "Offer", "Request", "Ack"], answer: [0, 1, 2, 3], explain: "Descubre → ofrece → pide → confirma." },
    { id: "netL2d", level: 2, type: "fill", q: "Máscara decimal de /24:", answer: "255.255.255.0", accept: ["255.255.255.0"], explain: "/24 = 24 bits de red." },
    { id: "netL2e", level: 2, type: "tf", q: "NAT permite que muchas IPs privadas salgan a Internet con pocas IPs públicas.", answer: true, explain: "PAT/NAT overload es lo habitual en hogares y oficinas." },
    { id: "netL3a", level: 3, type: "mc", q: "Una ACL de firewall que deniega 3389/tcp entrante desde Internet reduce exposición a…", options: ["RDP no autorizado", "Impresión USB local", "Solo audio HDMI", "Actualizaciones de GPU"], answer: 0, explain: "Exponer RDP a Internet es alto riesgo sin VPN/hardening." },
    { id: "netL3b", level: 3, type: "scenario", q: "Usuarios de VLAN invitados no deben ver servidores de finanzas. Solución típica:", options: ["Segmentación VLAN + ACL/firewall inter-VLAN", "Poner todos en /8 plano", "Desactivar Spooler", "Solo subir potencia Wi‑Fi"], answer: 0, explain: "Seguridad por segmentación y mínimo privilegio de red." },
    { id: "netL3c", level: 3, type: "match", q: "Empareja concepto avanzado:", pairs: [
      { left: "Split tunnel", right: "Solo parte del tráfico por VPN" },
      { left: "Full tunnel", right: "Todo el tráfico por VPN" },
      { left: "CDN", right: "Contenido cerca del usuario (edge)" },
      { left: "Proxy", right: "Intermediario HTTP/S de salida" }
    ], explain: "Diseño de salida y rendimiento van juntos." },
    { id: "netL3d", level: 3, type: "fill", q: "Puerto SSH por defecto:", answer: "22", accept: ["22"], explain: "22/tcp SSH. Cambia el puerto solo como capa extra, no como única defensa." },
    { id: "netL3e", level: 3, type: "order", q: "Ordena diagnóstico WAN caída (LAN OK):", items: ["Verificar enlace físico ONT/modem", "Revisar IP WAN/PPP en router", "Probar ping a DNS público desde router", "Abrir ticket ISP con evidencias"], answer: [0, 1, 2, 3], explain: "Separa CPE vs proveedor con datos." }
  ]);

  add("programming", [
    { id: "pgL1a", level: 1, type: "mc", q: "¿Qué es un string?", options: ["Una secuencia de caracteres/texto", "Un cable de red", "Un tipo de tóner", "Una VLAN"], answer: 0, explain: "En JS: 'hola' o \"hola\"." },
    { id: "pgL1b", level: 1, type: "tf", q: "HTML estructura el contenido de una página web.", answer: true, explain: "CSS estiliza; JS añade comportamiento." },
    { id: "pgL1c", level: 1, type: "fill", q: "Etiqueta HTML de enlace (apertura):", answer: "<a>", accept: ["<a>", "<a></a>", "a"], explain: "<a href='...'>texto</a>." },
    { id: "pgL1d", level: 1, type: "mc", q: "Un bucle while se repite…", options: ["Mientras la condición sea verdadera", "Solo una vez siempre", "Nunca", "Solo en DNS"], answer: 0, explain: "Evita condiciones que nunca se vuelven false." },
    { id: "pgL2a", level: 2, type: "mc", q: "¿Qué hace return en una función?", options: ["Devuelve un valor y sale de la función", "Formatea el disco", "Abre el Spooler", "Crea una VLAN"], answer: 0, explain: "Sin return, muchas funciones devuelven undefined (JS)." },
    { id: "pgL2b", level: 2, type: "scenario", q: "Tu código falla solo a veces. Buena práctica:", options: ["Reproducir, aislar, escribir prueba, luego fix", "Ignorar", "Borrar el repo", "Apagar el firewall del ISP"], answer: 0, explain: "Los bugs intermitentes necesitan evidencia y tests." },
    { id: "pgL2c", level: 2, type: "fill", q: "En JS, igualdad estricta:", answer: "===", accept: ["==="], explain: "=== compara valor y tipo." },
    { id: "pgL2d", level: 2, type: "order", q: "Ordena un commit limpio:", items: ["Revisar git status/diff", "git add archivos relevantes", "git commit -m \"mensaje claro\"", "git push si hay remoto"], answer: [0, 1, 2, 3], explain: "Mensajes claros ayudan al equipo futuro (tú incluido)." },
    { id: "pgL3a", level: 3, type: "mc", q: "Una race condition ocurre cuando…", options: ["El resultado depende del orden/tiempo de ejecución concurrente", "Falta papel", "El DNS es /24", "El monitor está en 60 Hz"], answer: 0, explain: "Locks, colas y diseño cuidadoso mitigan carreras." },
    { id: "pgL3b", level: 3, type: "tf", q: "Las pruebas automatizadas reducen regresiones al cambiar código.", answer: true, explain: "CI ejecuta tests en cada cambio." },
    { id: "pgL3c", level: 3, type: "scenario", q: "API devuelve 500 intermitente. ¿Dónde mirar primero?", options: ["Logs del servidor, métricas y trazas de la request", "Solo el CSS", "El tambor de la impresora", "El salvapantallas"], answer: 0, explain: "Correlaciona request-id entre gateway y app." },
    { id: "pgL3d", level: 3, type: "match", q: "Empareja:", pairs: [
      { left: "try/catch", right: "Manejo de excepciones" },
      { left: "JSON", right: "Formato de datos muy usado en APIs" },
      { left: "REST", right: "Estilo de API sobre HTTP" },
      { left: "SQL injection", right: "Ataque por entradas no sanitizadas" }
    ], explain: "Fundamentos de backend y seguridad de apps." }
  ]);

  add("support", [
    { id: "suL1a", level: 1, type: "mc", q: "Al atender un ticket, lo primero suele ser…", options: ["Saludar, identificarte y confirmar el problema", "Colgar", "Pedir la contraseña de domain admin", "Formatear sin backup"], answer: 0, explain: "Rapport + clarificación ahorran tiempo." },
    { id: "suL1b", level: 1, type: "tf", q: "Anotar la hora del error ayuda a buscar en logs.", answer: true, explain: "Correlación temporal es clave." },
    { id: "suL1c", level: 1, type: "mc", q: "P1 suele significar…", options: ["Impacto crítico / urgencia alta", "Pedir wallpaper", "Solo un rumor", "Un cable HDMI"], answer: 0, explain: "Define severidad con impacto × urgencia." },
    { id: "suL1d", level: 1, type: "fill", q: "Sigla del acuerdo de nivel de servicio:", answer: "SLA", accept: ["SLA", "sla"], explain: "Service Level Agreement." },
    { id: "suL2a", level: 2, type: "scenario", q: "Usuario dice 'nada funciona'. Mejor pregunta:", options: ["¿Desde cuándo? ¿Qué app/URL? ¿Solo tu PC u otros?", "¿Reinstalamos Windows ya?", "¿Me das tu MFA seed?", "¿Borramos System32?"], answer: 0, explain: "Acota alcance antes de actuar." },
    { id: "suL2b", level: 2, type: "order", q: "Ordena escalamiento útil a N2:", items: ["Resumir síntoma e impacto", "Listar pasos ya probados", "Adjuntar logs/capturas", "Indicar ventana y contacto del usuario"], answer: [0, 1, 2, 3], explain: "Un handoff pobre duplica trabajo." },
    { id: "suL2c", level: 2, type: "mc", q: "Un workaround es…", options: ["Solución temporal mientras llega el fix definitivo", "Ignorar el ticket", "Borrar evidencias", "Dar admin a todos"], answer: 0, explain: "Documenta el workaround en el ticket/KB." },
    { id: "suL2d", level: 2, type: "tf", q: "Prometer ETA imposible daña la confianza.", answer: true, explain: "Mejor rangos honestos y updates." },
    { id: "suL2e", level: 2, type: "mc", q: "Una KB (knowledge base) bien escrita sirve para…", options: ["Resolver casos repetidos más rápido y con consistencia", "Ocultar incidentes", "Dar admin a todos", "Desactivar logs"], answer: 0, explain: "Documenta pasos verificados y causas conocidas." },
    { id: "suL3a", level: 3, type: "mc", q: "En un major incident, N1 prioriza…", options: ["Comunicación, bridge y runbook / escalación", "Cambiar wallpapers VIP", "Silencio total", "Experimentos sin registro"], answer: 0, explain: "Restaurar servicio + comunicar status." },
    { id: "suL3b", level: 3, type: "scenario", q: "Change falló en prod. Siguiente paso típico:", options: ["Ejecutar rollback según plan y avisar", "Seguir cambiando a ciegas", "Borrar backups", "Culpar al usuario final"], answer: 0, explain: "Todo change serio trae rollback." },
    { id: "suL3c", level: 3, type: "match", q: "Empareja:", pairs: [
      { left: "Incidente", right: "Interrupción no planificada del servicio" },
      { left: "Problema", right: "Causa raíz / investigación más profunda" },
      { left: "Request", right: "Petición de servicio estándar" },
      { left: "CAB", right: "Comité de cambios / aprobaciones" }
    ], explain: "Vocabulario ITIL básico en help desk." },
    { id: "suL3d", level: 3, type: "fill", q: "Sigla de autenticación multifactor (inglés):", answer: "MFA", accept: ["MFA", "mfa", "2FA", "2fa"], explain: "MFA/2FA añade un segundo factor además de la contraseña." },
    { id: "suL3e", level: 3, type: "tf", q: "Después de un major incident conviene una retrospectiva / post-mortem sin culpas.", answer: true, explain: "Las lecciones aprendidas evitan repeticiones." }
  ]);

  // ——— Nuevo mundo: Ciberseguridad ———
  pushWorld({
    id: "security",
    name: "Ciberseguridad",
    icon: "🛡️",
    color: "#ff5566",
    description: "Phishing, contraseñas, MFA, malware y navegación segura.",
    questions: [
      // L1
      { id: "sec01", level: 1, type: "mc", q: "El phishing busca…", options: ["Engañarte para robar credenciales o datos", "Mejorar la velocidad del Wi‑Fi", "Calibrar el monitor", "Limpiar el Spooler"], answer: 0, explain: "Correos/SMS/webs falsas imitan marcas legítimas." },
      { id: "sec02", level: 1, type: "tf", q: "Una contraseña larga y única por sitio es mejor que reutilizar '123456'.", answer: true, explain: "Usa gestor de contraseñas + MFA." },
      { id: "sec03", level: 1, type: "mc", q: "MFA significa…", options: ["Autenticación multifactor", "Mainframe File Access", "Media Format Adapter", "Mail From Admin"], answer: 0, explain: "Algo que sabes + tienes / eres." },
      { id: "sec04", level: 1, type: "identify", q: "Señal típica de phishing por correo:", options: ["Urgencia + enlace sospechoso + remitente raro", "Firma digital válida siempre", "Solo texto sin links de RRHH legítimo", "Adjunto .txt de README interno"], answer: 0, explain: "Verifica dominio, hover del link y canales oficiales." },
      { id: "sec05", level: 1, type: "fill", q: "Sigla de software malicioso (inglés corto):", answer: "malware", accept: ["malware", "Malware"], explain: "Malware incluye virus, troyanos, ransomware, spyware…" },
      { id: "sec06", level: 1, type: "mc", q: "Actualizar el sistema y apps ayuda a…", options: ["Cerrar vulnerabilidades conocidas", "Borrar la RAM físicamente", "Cambiar la VLAN sola", "Imprimir más rápido siempre"], answer: 0, explain: "Parches corrigen fallos explotables." },
      { id: "sec07", level: 1, type: "tf", q: "HTTPS ayuda a cifrar el tráfico entre tu navegador y el sitio.", answer: true, explain: "No garantiza que el sitio sea confiable al 100%, pero protege en tránsito." },
      { id: "sec08", level: 1, type: "scenario", q: "Te llaman 'de TI' pidiendo tu contraseña. ¿Qué haces?", options: ["No la des; verifica por canal oficial", "Se la dictas", "La envías por WhatsApp", "La pegas en un foro"], answer: 0, explain: "Soporte legítimo no pide tu password." },
      { id: "sec09", level: 1, type: "mc", q: "Un antivirus/EDR sirve para…", options: ["Detectar y bloquear amenazas en el endpoint", "Reemplazar backups", "Sustituir al firewall perimetral siempre", "Asignar IPs"], answer: 0, explain: "Defensa en profundidad: endpoint + red + identidad." },
      { id: "sec10", level: 1, type: "order", q: "Ordena reacción ante correo sospechoso:", items: ["No hacer clic", "Reportar a seguridad/TI", "Borrar o cuarentenar según política", "Cambiar password si interactuaste"], answer: [0, 1, 2, 3], explain: "Contención primero; reset si hubo interacción." },
      // L2
      { id: "sec11", level: 2, type: "mc", q: "El ransomware típicamente…", options: ["Cifra archivos y pide rescate", "Mejora el FPS", "Optimiza DNS", "Calibra colores"], answer: 0, explain: "Backups offline/inmutables son críticos." },
      { id: "sec12", level: 2, type: "scenario", q: "USB desconocido en el estacionamiento. Acción correcta:", options: ["No conectarlo; reportar", "Probarlo en el DC", "Abrirlo en finanzas", "Instalar drivers del USB"], answer: 0, explain: "USB baiting es un vector real." },
      { id: "sec13", level: 2, type: "mc", q: "Principio de mínimo privilegio significa…", options: ["Dar solo los permisos necesarios para la tarea", "Dar admin a todos", "Desactivar logs", "Compartir root"], answer: 0, explain: "Reduce el blast radius de una cuenta comprometida." },
      { id: "sec14", level: 2, type: "tf", q: "Un VPN corporativo cifra el tráfico hacia la red de la empresa.", answer: true, explain: "Útil en Wi‑Fi públicos; no sustituye buen juicio." },
      { id: "sec15", level: 2, type: "fill", q: "Ataque que satura un servicio para tumbarlo (sigla):", answer: "DDoS", accept: ["DDoS", "ddos", "DoS", "dos"], explain: "Denial of Service / Distributed DoS." },
      { id: "sec16", level: 2, type: "match", q: "Empareja amenaza:", pairs: [
        { left: "Phishing", right: "Engaño para robar datos" },
        { left: "Malware", right: "Software dañino" },
        { left: "Shoulder surfing", right: "Mirar tu pantalla/teclado" },
        { left: "Tailgating", right: "Entrar detrás de alguien sin badge" }
      ], explain: "Amenazas técnicas y físicas." },
      { id: "sec17", level: 2, type: "mc", q: "2FA por SMS es mejor que nada, pero más fuerte suele ser…", options: ["App TOTP / llave FIDO2", "La misma password en todos lados", "Preguntas 'nombre de tu perro' solo", "Desactivar MFA"], answer: 0, explain: "SIM swap debilita SMS; preferir app o hardware key." },
      { id: "sec18", level: 2, type: "order", q: "Ordena endurecimiento básico de cuenta cloud:", items: ["Password única fuerte", "Activar MFA", "Revisar sesiones/dispositivos", "Alertas de login sospechoso"], answer: [0, 1, 2, 3], explain: "Identidad es el nuevo perímetro." },
      { id: "sec19", level: 2, type: "scenario", q: "Extensión del navegador pide leer todos los datos de todos los sitios. Riesgo:", options: ["Puede robar cookies/sesiones; desconfía", "Siempre es seguro", "Mejora el cable Cat6", "Es obligatorio en DHCP"], answer: 0, explain: "Revisa permisos y reputación." },
      { id: "sec20", level: 2, type: "tf", q: "Mantener backups probados ayuda a recuperarte de ransomware.", answer: true, explain: "Un backup no probado puede fallar en el peor momento." },
      // L3
      { id: "sec21", level: 3, type: "mc", q: "Un attack surface amplio significa…", options: ["Más puntos por donde pueden atacarte", "Más FPS", "Mejor calidad de impresión", "Más VLANs automáticamente seguras"], answer: 0, explain: "Reduce servicios expuestos y parchea." },
      { id: "sec22", level: 3, type: "scenario", q: "Sospechas de token OAuth robado. Acción típica:", options: ["Revocar sesiones/tokens, rotar secretos, revisar logs", "Ignorar", "Publicar el token", "Desactivar TLS"], answer: 0, explain: "Contención de identidad + forense ligero." },
      { id: "sec23", level: 3, type: "mc", q: "El principio Zero Trust asume…", options: ["No confiar solo por estar en la LAN; verificar siempre", "Que el firewall perimetral basta para siempre", "Que phishing no existe", "Que USB es seguro"], answer: 0, explain: "Verifica identidad, dispositivo y contexto." },
      { id: "sec24", level: 3, type: "fill", q: "Sigla de lista de control de acceso (inglés):", answer: "ACL", accept: ["ACL", "acl"], explain: "ACLs en firewalls/filesystems limitan quién hace qué." },
      { id: "sec25", level: 3, type: "order", q: "Ordena respuesta a incidente (IR) simplificada:", items: ["Identificar/contener", "Erradicar", "Recuperar", "Lecciones aprendidas"], answer: [0, 1, 2, 3], explain: "NIST/SANS condensado para help desk." },
      { id: "sec26", level: 3, type: "match", q: "Empareja control:", pairs: [
        { left: "Cifrado en reposo", right: "BitLocker/disk encryption" },
        { left: "Cifrado en tránsito", right: "TLS/VPN" },
        { left: "Hardening", right: "Desactivar servicios innecesarios" },
        { left: "Patching", right: "Aplicar actualizaciones de seguridad" }
      ], explain: "Controles preventivos clave." },
      { id: "sec27", level: 3, type: "tf", q: "Exponer RDP a Internet sin protección extra es una mala práctica.", answer: true, explain: "Usa VPN, NLA, MFA y bloqueo de fuerza bruta." },
      { id: "sec28", level: 3, type: "scenario", q: "Empleado reenvió nómina a Gmail personal. Riesgo principal:", options: ["Fuga de datos / violación de política", "Mejor backup", "Más velocidad DNS", "Mejor PCL"], answer: 0, explain: "DLP y concienciación mitigan shadow IT." },
      { id: "sec29", level: 3, type: "mc", q: "Un hash de password se usa para…", options: ["Almacenar verificadores sin guardar la clave en claro", "Imprimir más rápido", "Asignar VLANs", "Medir latencia ópticamente"], answer: 0, explain: "Con salt + algoritmo moderno (bcrypt/argon2)." },
      { id: "sec30", level: 3, type: "identify", q: "Framework común de gestión de riesgos/controles en empresas:", options: ["ISO 27001 / NIST CSF (ejemplos)", "Solo PCL", "Solo Cat3", "Solo WEP"], answer: 0, explain: "Ayudan a organizar controles y auditorías." }
    ],
    boss: [
      { id: "secB1", level: 3, type: "scenario", q: "BOSS: Campaña de phishing masiva con dominio lookalike. ¿Primera contención?", options: ["Alertar usuarios, bloquear dominio/URL, resetear cuentas que interactuaron", "Apagar Internet global", "Formatear todos los monitores", "Cambiar el tóner"], answer: 0, explain: "Comunicación + bloqueo + identidad." },
      { id: "secB2", level: 3, type: "mc", q: "BOSS: Ransomware en un file share. Prioridad:", options: ["Aislar hosts, preservar evidencias, restaurar desde backup limpio", "Pagar sin investigar siempre", "Subir el share a Internet", "Desactivar logs"], answer: 0, explain: "Contención y recuperación probada." },
      { id: "secB3", level: 3, type: "order", q: "BOSS: Cuenta admin comprometida:", items: ["Deshabilitar/resetear cuenta", "Revisar accesos y tokens", "Auditar cambios realizados", "Rotar secretos relacionados"], answer: [0, 1, 2, 3], explain: "Corta el acceso antes de investigar a fondo." },
      { id: "secB4", level: 3, type: "tf", q: "BOSS: El logging centralizado ayuda a detectar y investigar incidentes.", answer: true, explain: "SIEM/consultas correlacionan eventos." },
      { id: "secB5", level: 3, type: "fill", q: "BOSS: Factor 'algo que tienes' en MFA (ejemplo corto: app o …):", answer: "token", accept: ["token", "llave", "key", "app", "telefono", "teléfono", "otp"], explain: "Token/app/llave física complementan la password." }
    ]
  });

  // ——— Nuevo mundo: Hardware ———
  pushWorld({
    id: "hardware",
    name: "Hardware / ensamblado",
    icon: "🔧",
    color: "#ffa64d",
    description: "CPU, RAM, discos, BIOS/UEFI, fuentes, puertos y fallos.",
    questions: [
      { id: "hw01", level: 1, type: "mc", q: "La CPU es…", options: ["El procesador principal del sistema", "Solo la memoria USB", "El tóner", "Un tipo de cable HDMI"], answer: 0, explain: "Central Processing Unit: ejecuta instrucciones." },
      { id: "hw02", level: 1, type: "tf", q: "La RAM es memoria volátil: se pierde al apagar.", answer: true, explain: "Los datos permanentes van en disco/SSD." },
      { id: "hw03", level: 1, type: "mc", q: "SSD frente a HDD típico:", options: ["SSD más rápido y sin platos mecánicos", "HDD siempre más rápido que SSD", "SSD solo sirve para imprimir", "HDD no almacena datos"], answer: 0, explain: "SSD usa memoria flash; HDD platos magnéticos." },
      { id: "hw04", level: 1, type: "identify", q: "Conector de video digital común en monitores modernos:", options: ["HDMI / DisplayPort", "RJ-11 solo", "PS/2 video", "Centronics"], answer: 0, explain: "HDMI y DP dominan; VGA es analógico legacy." },
      { id: "hw05", level: 1, type: "fill", q: "Sigla de la memoria de acceso aleatorio:", answer: "RAM", accept: ["RAM", "ram"], explain: "Random Access Memory." },
      { id: "hw06", level: 1, type: "mc", q: "La PSU (fuente) proporciona…", options: ["Energía eléctrica convertida a las tensiones del PC", "Solo señal Wi‑Fi", "Solo refrigeración líquida obligatoria", "Licencias de Office"], answer: 0, explain: "Elige wattage y certificaciones adecuadas." },
      { id: "hw07", level: 1, type: "tf", q: "Antes de tocar componentes, conviene descargar electricidad estática (ESD).", answer: true, explain: "Pulsera/antistática y tocar chasis metálico ayudan." },
      { id: "hw08", level: 1, type: "scenario", q: "PC no da imagen pero ventiladores giran. Chequeo básico:", options: ["Probar otro cable/monitor, RAM reseateada, GPU", "Cambiar solo el SSID", "Reinstalar Excel", "Subir tinta"], answer: 0, explain: "Descarta display y memoria/GPU primero." },
      { id: "hw09", level: 1, type: "mc", q: "USB-C puede transportar…", options: ["Datos y en muchos casos video/energía según el dispositivo", "Solo audio analógico obligatorio", "Solo señal de antena TV", "Solo tóner"], answer: 0, explain: "No todos los USB-C son iguales (Alt Mode/PD)." },
      { id: "hw10", level: 1, type: "order", q: "Ordena ensamblado básico seguro:", items: ["Preparar mesa antiestática / desconectar corriente", "Instalar CPU/cooler según socket", "Instalar RAM y almacenamiento", "Conectar cables PSU y probar POST"], answer: [0, 1, 2, 3], explain: "Sigue el manual del board; no fuerces pines." },
      { id: "hw11", level: 2, type: "mc", q: "UEFI es…", options: ["Firmware moderno que reemplaza al BIOS clásico en muchos PCs", "Un antivirus", "Un protocolo de impresión", "Una VLAN"], answer: 0, explain: "Ofrece GUI, Secure Boot, GPT, etc." },
      { id: "hw12", level: 2, type: "scenario", q: "PC pita en POST y no arranca. Los beeps suelen indicar…", options: ["Error de hardware según código del fabricante (a menudo RAM/GPU)", "Éxito total", "Actualización de Office", "Falta de papel"], answer: 0, explain: "Consulta la tabla de beep codes de la motherboard." },
      { id: "hw13", level: 2, type: "mc", q: "NVMe se conecta típicamente por…", options: ["Slot M.2 PCIe", "Puerto PS/2", "LPT1", "RJ-11"], answer: 0, explain: "NVMe es mucho más rápido que SATA SSD en muchos casos." },
      { id: "hw14", level: 2, type: "tf", q: "Mezclar sticks de RAM de velocidades distintas puede forzar la velocidad más baja.", answer: true, explain: "Ideales: mismo kit matched." },
      { id: "hw15", level: 2, type: "fill", q: "Sigla del firmware de arranque clásico anterior a UEFI:", answer: "BIOS", accept: ["BIOS", "bios"], explain: "Basic Input/Output System." },
      { id: "hw16", level: 2, type: "match", q: "Empareja puerto:", pairs: [
        { left: "RJ-45", right: "Red Ethernet" },
        { left: "SATA", right: "Discos/Optical legacy-ish" },
        { left: "PCIe", right: "Slots de expansión (GPU, etc.)" },
        { left: "Socket CPU", right: "Encaje del procesador" }
      ], explain: "Identificar conectores evita daños." },
      { id: "hw17", level: 2, type: "scenario", q: "Fuente con olor a quemado y PC muerto. Acción:", options: ["No encender; reemplazar PSU y revisar daños", "Seguir intentando 50 veces", "Solo cambiar el mouse", "Aumentar MHz RAM a ciegas"], answer: 0, explain: "Una PSU fallida puede dañar otros componentes." },
      { id: "hw18", level: 2, type: "mc", q: "Thermal paste se usa entre…", options: ["CPU (IHS) y el disipador", "RAM y SSD", "HDMI y DisplayPort", "Tóner y drum"], answer: 0, explain: "Mejora transferencia térmica; cantidad correcta importa." },
      { id: "hw19", level: 2, type: "order", q: "Ordena upgrade de RAM en laptop (genérico):", items: ["Apagar y retirar batería si es posible", "Abrir tapa de servicio", "Insertar SODIMM en ángulo/presión según diseño", "Encender y verificar en el SO"], answer: [0, 1, 2, 3], explain: "Consulta el manual: algunas RAM van soldadas." },
      { id: "hw20", level: 2, type: "tf", q: "Secure Boot ayuda a impedir bootloaders no firmados.", answer: true, explain: "Parte de la cadena de confianza UEFI." },
      { id: "hw21", level: 3, type: "mc", q: "Un PSU 80 Plus Bronze/Gold indica…", options: ["Eficiencia energética certificada bajo cargas dadas", "Que incluye impresora", "Velocidad de RAM", "Número de VLANs"], answer: 0, explain: "Más eficiencia = menos calor/consumo, no siempre más 'potencia pico mágica'." },
      { id: "hw22", level: 3, type: "scenario", q: "Servidor con ECC RAM reporta corrected errors crecientes. Implica:", options: ["Posible módulo/DIMM degradándose; planear reemplazo", "Todo está perfecto siempre", "Solo un warning de Excel", "Falta de tóner"], answer: 0, explain: "ECC corrige errores; el aumento sostiene fallo inminente." },
      { id: "hw23", level: 3, type: "mc", q: "El chipset/VRM sobrecalentado puede causar…", options: ["Inestabilidad, throttling o apagados", "Mejor phishing", "IPs públicas extras", "Más puertos 9100"], answer: 0, explain: "Buena refrigeración y pasta/pads importan en boards exigentes." },
      { id: "hw24", level: 3, type: "fill", q: "Interfaz de disco rápida en M.2 (sigla de 4 letras):", answer: "NVMe", accept: ["NVMe", "nvme"], explain: "NVM Express sobre PCIe." },
      { id: "hw25", level: 3, type: "match", q: "Empareja síntoma-causa frecuente:", pairs: [
        { left: "No POST / beeps", right: "RAM/CPU/GPU mal asentados" },
        { left: "Apagones bajo carga", right: "PSU insuficiente/falla" },
        { left: "BSOD memoria", right: "RAM defectuosa/XMP inestable" },
        { left: "No detecta NVMe", right: "Modo M.2/BIOS o slot deshabilitado" }
      ], explain: "Divide por etapa: POST vs OS vs carga." },
      { id: "hw26", level: 3, type: "order", q: "Ordena diagnóstico 'no enciende' (0 LEDs):", items: ["Verificar cable/corriente/switch PSU", "Probar outlet y cable conocido buenos", "Puenteo de power switch / PSU tester", "Probar PSU o board mínima (CPU/RAM)"], answer: [0, 1, 2, 3], explain: "Descarta alimentación antes de condenar el board." },
      { id: "hw27", level: 3, type: "tf", q: "Actualizar BIOS/UEFI tiene riesgos; hazlo con energía estable y archivo correcto.", answer: true, explain: "Brickear el firmware es real si se interrumpe." },
      { id: "hw28", level: 3, type: "scenario", q: "Tras agregar GPU potente, el PC reinicia al jugar. Causa probable:", options: ["PSU al límite / cables PCIe de potencia insuficientes", "DNS malo", "Spooler caído", "Cat5e"], answer: 0, explain: "Revisa wattage, rieles y conectores nativos (evitar daisy-chain dudoso)." },
      { id: "hw29", level: 3, type: "mc", q: "AHCI vs RAID en SATA (idea):", options: ["AHCI para discos individuales típicos; RAID según arreglo", "RAID solo para impresoras", "AHCI es un tipo de phishing", "Son conectores HDMI"], answer: 0, explain: "Cambiar modo tras instalar el SO puede impedir el boot." },
      { id: "hw30", level: 3, type: "identify", q: "Herramienta para probar memoria RAM en Windows (incluida):", options: ["Diagnóstico de memoria de Windows / mdsched", "mspaint", "Notepad solo", "services.msc únicamente"], answer: 0, explain: "También MemTest86 en entornos más exhaustivos." }
    ],
    boss: [
      { id: "hwB1", level: 3, type: "scenario", q: "BOSS: Flota de laptops con hinchazón de batería. Acción correcta:", options: ["Retirar de servicio, no cargar, reemplazo seguro según política", "Seguir usándolas normalmente", "Perforar la batería", "Meterlas al freezer casero"], answer: 0, explain: "Riesgo de incendio: protocolo de baterías dañadas." },
      { id: "hwB2", level: 3, type: "mc", q: "BOSS: Servidor no arranca tras corte; PSU clickea. Siguiente:", options: ["Probar PSU conocida buena / rails; revisar shorts", "Reinstalar Photoshop", "Cambiar VLAN", "Actualizar tóner"], answer: 0, explain: "Click = protección PSU o cortocircuito." },
      { id: "hwB3", level: 3, type: "order", q: "BOSS: Upgrade de almacenamiento con clonación:", items: ["Imagen/clon del disco viejo al nuevo", "Verificar boot en firmware (orden NVMe/SATA)", "Confirmar datos y smart", "Retirar disco viejo o repurpose"], answer: [0, 1, 2, 3], explain: "UEFI boot order suele ser el paso que falta." },
      { id: "hwB4", level: 3, type: "tf", q: "BOSS: Mezclar conectores PCIe de potencia de baja calidad puede dañar la GPU.", answer: true, explain: "Usa cables del fabricante de la PSU / especificación adecuada." },
      { id: "hwB5", level: 3, type: "fill", q: "BOSS: Firmware de placa base moderno (sigla de 4 letras):", answer: "UEFI", accept: ["UEFI", "uefi"], explain: "Unified Extensible Firmware Interface." }
    ]
  });

  // Re-ensure levels after pads
  WORLDS.forEach((w) => ensureLevels(w.questions));

  // Helpers globales
  window.LEVEL_LABELS = LEVEL_LABELS;
  window.LEVELS_PER_WORLD = (typeof GAME_CONFIG !== "undefined" && GAME_CONFIG.levelsPerWorld) || 5;
  window.getQuestionsForLevel = function (worldId, level) {
    const w = getWorldById(worldId);
    if (!w) return [];
    return w.questions.filter((q) => (q.level || 1) === level);
  };
  window.countLevelsForWorld = function (worldId) {
    const w = getWorldById(worldId);
    const maxL = window.LEVELS_PER_WORLD || 5;
    const c = {};
    for (let i = 1; i <= maxL; i++) c[i] = 0;
    if (!w) return c;
    w.questions.forEach((q) => { const L = q.level || 1; c[L] = (c[L] || 0) + 1; });
    return c;
  };
})();
