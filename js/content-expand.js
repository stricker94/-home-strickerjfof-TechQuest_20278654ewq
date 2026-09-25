/**
 * Tech Quest — Expansión de contenido (se aplica sobre WORLDS de data.js)
 * Prioridad: Impresoras y Redes profundos + bosses + mundo 6 Soporte IT
 */
(function expandContent() {
  function add(worldId, questions) {
    const w = getWorldById(worldId);
    if (!w) return;
    w.questions = w.questions.concat(questions);
  }

  function setBoss(worldId, bossQs) {
    const w = getWorldById(worldId);
    if (!w) return;
    w.boss = bossQs;
  }

  // ——— Linux extras ———
  add("linux", [
    { id: "lx13", type: "tf", q: "En Linux, el usuario root tiene UID 0.", answer: true, explain: "UID 0 = root. Es la cuenta con privilegios máximos del sistema." },
    { id: "lx14", type: "mc", q: "¿Qué hace el comando df -h?", options: ["Muestra espacio en discos montados de forma legible", "Formatea el disco", "Lista solo procesos zombie", "Cambia el hostname"], answer: 0, explain: "df = disk free. -h muestra tamaños en K/M/G." },
    { id: "lx15", type: "fill", q: "Comando para ver las últimas líneas de /var/log/syslog (forma corta con tail):", answer: "tail /var/log/syslog", accept: ["tail /var/log/syslog", "tail -n 10 /var/log/syslog", "tail -f /var/log/syslog"], explain: "tail muestra el final del archivo. -f sigue el log en vivo." },
    { id: "lx16", type: "scenario", q: "Escenario: necesitas matar el proceso con PID 4421. ¿Qué comando usas?", options: ["kill 4421", "rm 4421", "chmod 4421", "apt remove 4421"], answer: 0, explain: "kill envía una señal (por defecto TERM). kill -9 fuerza SIGKILL si no responde." },
    { id: "lx17", type: "mc", q: "¿Qué archivo suele listar usuarios del sistema (passwd)?", options: ["/etc/passwd", "/etc/hosts", "/bin/bash", "/tmp/users"], answer: 0, explain: "/etc/passwd describe cuentas; las contraseñas hasheadas van en /etc/shadow." },
    { id: "lx18", type: "identify", q: "¿Qué comando muestra el uso de memoria RAM y swap?", options: ["free", "mkdir", "ping", "lpstat"], answer: 0, explain: "free -h resume memoria. También puedes verlo en top/htop." }
  ]);

  // ——— Windows extras ———
  add("windows", [
    { id: "wn13", type: "tf", q: "Win+R → services.msc abre la consola de servicios.", answer: true, explain: "services.msc es el snap-in clásico para iniciar/detener/reiniciar servicios." },
    { id: "wn14", type: "scenario", q: "Escenario: la caché DNS está corrupta. ¿Qué comando la limpia?", options: ["ipconfig /flushdns", "ping /flush", "cls", "netstat -a"], answer: 0, explain: "ipconfig /flushdns vacía el resolver cache de Windows." },
    { id: "wn15", type: "mc", q: "RDP (Escritorio remoto) usa por defecto el puerto TCP…", options: ["3389", "22", "445", "9100"], answer: 0, explain: "3389 es el puerto clásico de Remote Desktop. Debe estar permitido en el firewall." },
    { id: "wn16", type: "fill", q: "Cmdlet de PowerShell para reiniciar un servicio llamado Spooler:", answer: "Restart-Service Spooler", accept: ["Restart-Service Spooler", "Restart-Service -Name Spooler"], explain: "Restart-Service detiene e inicia el servicio. Requiere permisos elevados a menudo." },
    { id: "wn17", type: "order", q: "Ordena un diagnóstico cuando un PC no llega a Internet pero sí hace ping a 8.8.8.8:", items: ["Verificar DNS (ipconfig /all)", "Probar resolución nslookup sitio.com", "Probar otro DNS (1.1.1.1 / 8.8.8.8)", "Limpiar caché DNS si aplica"], answer: [0, 1, 2, 3], explain: "Si hay IP pero no nombres, el problema suele ser DNS, no la ruta a Internet." },
    { id: "wn18", type: "mc", q: "¿Qué herramienta abre el Editor del Registro?", options: ["regedit", "mspaint", "calc", "notepad únicamente"], answer: 0, explain: "regedit edita el registro. Cámbialo solo con respaldo y conocimiento: errores pueden romper el sistema." }
  ]);

  // ——— IMPRESORAS: profundidad intermedia→avanzada (meta ≥20 total) ———
  add("printers", [
    { id: "pr13", type: "mc", q: "El puerto TCP 9100 suele asociarse a…", options: ["Impresión raw / JetDirect", "HTTPS", "SSH", "DNS"], answer: 0, explain: "Muchas impresoras de red aceptan trabajos en 9100 (AppSocket/JetDirect). IPP suele usar 631." },
    { id: "pr14", type: "mc", q: "Diferencia introductoria PCL vs PostScript:", options: ["PCL (HP) y PostScript (Adobe) son lenguajes de descripción de página; el driver debe coincidir", "PCL solo funciona en Mac", "PostScript no imprime texto", "Son marcas de tóner"], answer: 0, explain: "Si eliges el lenguaje incorrecto verás caracteres basura o trabajos fallidos. Algunas MFP soportan ambos." },
    { id: "pr15", type: "tf", q: "LPR/LPD es un protocolo clásico de impresión en red (a menudo puerto 515).", answer: true, explain: "Line Printer Daemon. Hoy IPP es más moderno, pero LPR aún aparece en entornos legacy." },
    { id: "pr16", type: "scenario", q: "Escenario: varios usuarios imprimen vía un servidor Windows. ¿Concepto clave?", options: ["Print server / cola compartida en el servidor", "Cada uno debe usar solo USB al mismo tiempo", "Desactivar el Spooler del servidor siempre", "Usar solo puerto HDMI"], answer: 0, explain: "El print server centraliza drivers y colas; los clientes apuntan al recurso compartido \\\\servidor\\impresora." },
    { id: "pr17", type: "mc", q: "Impresión por SMB significa típicamente…", options: ["Compartir la impresora como recurso de red Windows (\\\\host\\share)", "Solo Bluetooth", "Solo correo SMTP", "Un tipo de tóner"], answer: 0, explain: "SMB/CIFS expone la cola. Útil en dominios; requiere permisos NTFS/share correctos." },
    { id: "pr18", type: "order", q: "Ordena el flujo para limpiar una cola atascada (Windows):", items: ["Detener el servicio Print Spooler", "Vaciar archivos en spool\\PRINTERS (con cuidado)", "Iniciar de nuevo Print Spooler", "Reenviar una página de prueba"], answer: [0, 1, 2, 3], explain: "Nunca borres el spool con el servicio en ejecución: puede corromper estados." },
    { id: "pr19", type: "mc", q: "¿Qué es el tambor (drum) en una láser?", options: ["Unidad fotosensible que transfiere tóner al papel; se desgasta aparte del cartucho en algunos modelos", "El cable USB", "La IP de la impresora", "El Spooler"], answer: 0, explain: "En kits separados, tóner bajo ≠ drum agotado. Rayas o manchas pueden indicar drum sucio/agotado." },
    { id: "pr20", type: "identify", q: "¿Qué comando/utilidad en Windows lista impresoras y colas (línea de comandos clásica)?", options: ["wmic printer / PowerShell Get-Printer", "ipconfig", "chkdsk", "sfc"], answer: 0, explain: "Get-Printer (PowerShell) o la UI de Impresoras y escáneres. lpstat en Linux/CUPS." },
    { id: "pr21", type: "fill", q: "Puerto típico de IPP (número):", answer: "631", accept: ["631"], explain: "IPP (Internet Printing Protocol) usa 631/tcp de forma habitual." },
    { id: "pr22", type: "mc", q: "Descubrimiento de impresoras en LAN moderna a menudo usa…", options: ["mDNS / WS-Discovery / SNMP según fabricante", "Solo FTP anónimo", "Solo RDP", "Solo HDMI-CEC"], answer: 0, explain: "Bonjour/mDNS, WSD y portales web del dispositivo ayudan a 'ver' la impresora. Firewalls pueden ocultarla." },
    { id: "pr23", type: "scenario", q: "Escenario: la impresora Wi‑Fi está en otra VLAN/SSID de invitados. Los PCs corporativos no la ven. Causa más probable:", options: ["Aislamiento de red / sin routing entre VLANs", "Falta de tóner únicamente", "Driver de mouse", "Que el monitor esté en 60 Hz"], answer: 0, explain: "Impresoras en guest Wi‑Fi suelen estar aisladas. Ponla en la LAN de trabajo o enruta/firewall con reglas." },
    { id: "pr24", type: "mc", q: "Prioridad de trabajos en cola sirve para…", options: ["Definir qué trabajos se procesan antes (urgente vs normal)", "Cambiar la IP automáticamente", "Actualizar el firmware siempre", "Cifrar el disco del PC"], answer: 0, explain: "En print servers puedes asignar prioridad a usuarios/colas para tickets críticos." },
    { id: "pr25", type: "match", q: "Relaciona síntoma con causa frecuente:", pairs: [
      { left: "Página en blanco", right: "Tóner vacío o sello protector" },
      { left: "Atasco repetido", right: "Rodillos / papel húmedo / ruta" },
      { left: "Caracteres basura", right: "Driver/lenguaje incorrecto" },
      { left: "Offline en red", right: "IP/puerto/firewall/Spooler" }
    ], explain: "Separa hardware (papel/tóner) de lógica (driver/red/cola)." },
    { id: "pr26", type: "tf", q: "Una impresora puede tener IP fija o obtenerla por DHCP; para servidores suele preferirse reserva DHCP o IP estática.", answer: true, explain: "Si la IP cambia, los puertos TCP/IP de los clientes se rompen. Reserva en DHCP = misma IP estable." },
    { id: "pr27", type: "mc", q: "Error de 'acceso denegado' al imprimir en cola compartida suele indicar…", options: ["Permisos de recurso compartido / seguridad NTFS / políticas", "Que Cat6 es imposible", "Falta de Java en el navegador siempre", "Que HTTPS está caído en Internet"], answer: 0, explain: "Revisa grupo Usuarios de dominio, permisos de la impresora compartida y GPO." },
    { id: "pr28", type: "order", q: "Ticket: no imprime por red. Ordena el diagnóstico técnico:", items: ["Ping a la IP de la impresora", "Probar puerto (9100/631) o página web embebida", "Verificar cola/Spooler en el PC o print server", "Reinstalar/actualizar driver correcto"], answer: [0, 1, 2, 3], explain: "Sin capa 3 no hay cola útil. Luego servicio local, luego driver." }
  ]);

  // ——— REDES: profundidad (meta ≥22 total) ———
  add("networks", [
    { id: "net14", type: "mc", q: "¿Cuántos hosts útiles aprox. en una red /24 (sin contar red y broadcast)?", options: ["254", "24", "512", "2"], answer: 0, explain: "2^(32-24)-2 = 254. Ejemplo: 192.168.1.0/24 → .1–.254." },
    { id: "net15", type: "mc", q: "Una máscara /16 equivale a…", options: ["255.255.0.0", "255.255.255.0", "255.255.255.252", "255.0.0.0"], answer: 0, explain: "/16 = 16 bits de red. Clase B típica en notación antigua." },
    { id: "net16", type: "order", q: "Ordena el proceso DHCP DORA:", items: ["Discover", "Offer", "Request", "Acknowledge (ACK)"], answer: [0, 1, 2, 3], explain: "Cliente descubre → servidor ofrece → cliente pide → servidor confirma el lease." },
    { id: "net17", type: "order", q: "Ordena la resolución DNS típica en el cliente:", items: ["Consultar caché local", "Preguntar al resolver (DNS configurado)", "Recibir registro A/AAAA (IP)", "Conectar por TCP/UDP al destino"], answer: [0, 1, 2, 3], explain: "Si la caché tiene la respuesta, no sale a la red. Luego el resolver puede iterar/recursar." },
    { id: "net18", type: "mc", q: "NAT (Network Address Translation) principalmente…", options: ["Traduce IPs privadas a una IP pública (u otras redes)", "Sustituye al antivirus", "Cifra discos", "Asigna letras de unidad"], answer: 0, explain: "PAT/NAT overload permite muchos hosts internos con pocas IPs públicas. Complica servicios entrantes sin port-forward." },
    { id: "net19", type: "match", q: "Relaciona puerto con servicio:", pairs: [
      { left: "80", right: "HTTP" },
      { left: "443", right: "HTTPS" },
      { left: "22", right: "SSH" },
      { left: "3389", right: "RDP" }
    ], explain: "9100 suele ser impresión raw; 53 DNS; 67/68 DHCP." },
    { id: "net20", type: "mc", q: "El puerto 9100 en un escaneo a una IP de oficina suele indicar…", options: ["Servicio de impresión de red (JetDirect/raw)", "Solo correo", "Solo NTP", "Base de datos MySQL"], answer: 0, explain: "Útil al validar que la impresora escucha. Bloqueado por firewall = no imprime aunque haga ping." },
    { id: "net21", type: "scenario", q: "Escenario: ping OK a 8.8.8.8 pero nslookup google.com falla. ¿Qué mirar primero?", options: ["Configuración DNS del cliente/servidor", "El tóner", "La resolución de pantalla", "El volumen del altavoz"], answer: 0, explain: "Hay ruta IP pero no resolución de nombres. Prueba DNS alternos y /flushdns." },
    { id: "net22", type: "mc", q: "Una VLAN sirve para…", options: ["Segmentar lógicamente la LAN en dominios de broadcast separados", "Aumentar el voltaje del PoE", "Reemplazar cables por Wi‑Fi obligatorio", "Borrar el historial DNS"], answer: 0, explain: "VLANs separan tráfico (ej. usuarios vs impresoras vs invitados) sobre el mismo switch físico." },
    { id: "net23", type: "tf", q: "WPA3 es más moderno y seguro que WEP para Wi‑Fi.", answer: true, explain: "WEP está obsoleto e inseguro. Prefiere WPA2-AES o WPA3; evita claves compartidas débiles." },
    { id: "net24", type: "mc", q: "En 2.4 GHz, canales 1, 6 y 11 se recomiendan porque…", options: ["Se solapan menos entre sí en esa banda", "Son los únicos que existen", "Solo sirven para impresoras", "Desactivan el NAT"], answer: 0, explain: "Canales intermedios se solapan y generan interferencia de co-canal/adicional." },
    { id: "net25", type: "fill", q: "Comando clásico para ver la ruta que siguen los paquetes (Windows):", answer: "tracert", accept: ["tracert", "tracert.exe"], explain: "tracert (Windows) / traceroute (Linux). Muestra saltos; timeouts no siempre = caída total." },
    { id: "net26", type: "mc", q: "Un proxy HTTP intermedio típicamente…", options: ["Reenvía peticiones web de clientes; puede cachear o filtrar", "Sustituye al switch L2", "Es un tipo de cable Cat8 obligatorio", "Solo imprime"], answer: 0, explain: "Empresas usan proxy para control/URL filtering. El cliente debe apuntar al proxy o usar WPAD." },
    { id: "net27", type: "mc", q: "Una CDN (Content Delivery Network)…", options: ["Acerca contenido a usuarios vía nodos geográficos (caché en edge)", "Es un antivirus de escritorio", "Formatea NTFS", "Asigna UID en Linux"], answer: 0, explain: "Reduce latencia y carga del origen. DNS/anycast dirige al PoP cercano." },
    { id: "net28", type: "scenario", q: "Escenario: PCs hacen ping entre sí en 192.168.10.0/24 pero no salen a Internet. Gateway 192.168.10.1 no responde. Causa probable:", options: ["Router/firewall de borde caído o mala gateway", "Falta de driver de audio", "Que Cat5e no existe", "Spooler detenido"], answer: 0, explain: "LAN OK, WAN/gateway mal. Verifica cable WAN, NAT, ISP y dirección de puerta de enlace." },
    { id: "net29", type: "mc", q: "ISP vs LAN:", options: ["ISP provee acceso a Internet; LAN es tu red local", "Son sinónimos exactos", "ISP solo gestiona impresoras", "LAN siempre es IPv6 únicamente"], answer: 0, explain: "El CPE/router marca el límite: LAN privada detrás, WAN hacia el ISP." },
    { id: "net30", type: "mc", q: "Cat6 frente a Cat5e (idea práctica):", options: ["Cat6 ofrece mejores márgenes para Gigabit y más cabida a 10G en tramos cortos", "Cat5e es siempre superior a Cat6", "Cat6 no usa RJ-45", "Cat6 solo es fibra"], answer: 0, explain: "Ambos hacen 1 Gbps en distancias típicas; Cat6 tiene especificación más estricta." },
    { id: "net31", type: "tf", q: "Un firewall puede permitir 443/tcp saliente y bloquear 3389/tcp entrante.", answer: true, explain: "Las reglas se definen por dirección, puerto, protocolo e interfaz. Principio de mínimo privilegio." },
    { id: "net32", type: "mc", q: "VPN con split tunnel significa…", options: ["Solo parte del tráfico va por el túnel VPN; el resto sale por Internet local", "Todo el tráfico siempre por VPN", "Que no hay cifrado", "Que DNS deja de existir"], answer: 0, explain: "Full tunnel manda todo por VPN. Split mejora velocidad a Internet pero exige buen diseño de seguridad." },
    { id: "net33", type: "identify", q: "¿Qué herramienta interpreta saltos hasta un destino y latencias por hop?", options: ["traceroute / tracert", "mkdir", "notepad", "Get-Service"], answer: 0, explain: "Si el último hop falla pero el servicio web responde, puede ser ICMP filtrado — no asumas caída." },
    { id: "net34", type: "scenario", q: "Escenario: switch vs router. Necesitas conectar 20 PCs en la misma IP subnet sin salir a otra red. ¿Qué basta?", options: ["Un switch (capa 2) en la misma VLAN/red", "Obligatoriamente 20 routers", "Solo un proxy CDN", "Un print server"], answer: 0, explain: "Misma subred = switching. El router hace falta para salir a otras redes/Internet." }
  ]);

  // ——— Programación extras ———
  add("programming", [
    { id: "pg14", type: "tf", q: "const en JavaScript declara una vinculación que no se puede reasignar.", answer: true, explain: "const no hace al objeto inmutable profundamente; solo impide reasignar la variable." },
    { id: "pg15", type: "scenario", q: "Escenario: quieres guardar cambios locales con mensaje. Flujo git mínimo:", options: ["git add → git commit -m \"mensaje\"", "git push → git add", "solo git branch -D", "npm install"], answer: 0, explain: "add al stage, commit al historial local. push es opcional hacia remoto." },
    { id: "pg16", type: "mc", q: "¿Qué hace un bucle while?", options: ["Repite mientras la condición sea verdadera", "Declara una VLAN", "Instala drivers", "Abre el Spooler"], answer: 0, explain: "Cuidado con bucles infinitos: la condición debe poder volverse falsa." },
    { id: "pg17", type: "fill", q: "En JS, operador de igualdad estricta (valor y tipo):", answer: "===", accept: ["==="], explain: "=== no hace coerción. == puede convertir tipos y dar sorpresas." },
    { id: "pg18", type: "mc", q: "CSS: display: flex sirve para…", options: ["Crear layouts flexibles en una dimensión", "Matar procesos", "Configurar DHCP", "Montar /etc"], answer: 0, explain: "Flexbox alinea y distribuye espacio entre ítems de un contenedor." }
  ]);

  // ——— Mundo 6: Soporte IT ———
  if (!getWorldById("support")) {
    WORLDS.push({
      id: "support",
      name: "Soporte IT",
      icon: "🎫",
      color: "#ff7755",
      description: "Tickets, prioridades, soft skills y diagnóstico como en un help desk real.",
      questions: [
        { id: "su01", type: "mc", q: "En ITIL/help desk, un incidente es…", options: ["Interrupción no planificada o degradación de un servicio", "Una compra de hardware nueva siempre", "Un cable Cat6", "Un commit de git"], answer: 0, explain: "El objetivo es restaurar el servicio lo antes posible. Un problema es la causa raíz subyacente." },
        { id: "su02", type: "mc", q: "Prioridad de ticket suele combinar…", options: ["Impacto × urgencia", "Solo el color del logo", "La hora del almuerzo", "El volumen del teclado"], answer: 0, explain: "Alta urgencia + alto impacto = prioridad crítica (P1). Documenta SLAs." },
        { id: "su03", type: "order", q: "Ordena una atención telefónica profesional:", items: ["Saludar e identificarte", "Escuchar y confirmar el problema", "Diagnosticar / escalar si hace falta", "Cerrar con resumen y next steps"], answer: [0, 1, 2, 3], explain: "La empatía y la confirmación evitan malentendidos y rework." },
        { id: "su04", type: "scenario", q: "Usuario enfadado: '¡Nada funciona!'. Mejor primera respuesta:", options: ["Empatizar, pedir detalles concretos y reproducir", "Colgar", "Decir que es culpa suya", "Formatear sin backup"], answer: 0, explain: "Baja la tensión, acota el alcance (¿solo Wi‑Fi? ¿una app?) y recoge evidencia." },
        { id: "su05", type: "tf", q: "Antes de cambiar algo en producción, conviene tener rollback o respaldo cuando sea posible.", answer: true, explain: "Cambios sin plan de vuelta atrás alargan las crisis." },
        { id: "su06", type: "mc", q: "¿Cuándo escalar a N2/N3?", options: ["Cuando excedes tu alcance, tiempo SLA o necesitas privilegios/especialistas", "Nunca", "Solo los viernes", "Cuando el ping funciona"], answer: 0, explain: "Escala con contexto: qué se probó, logs, impacto, ventana de cambio." },
        { id: "su07", type: "match", q: "Relaciona severidad típica:", pairs: [
          { left: "P1", right: "Servicio crítico caído para muchos" },
          { left: "P3", right: "Impacto menor / workaround existe" },
          { left: "Request", right: "Petición de servicio (no incidente)" },
          { left: "Known error", right: "Causa conocida con workaround" }
        ], explain: "Clasificar bien acelera la cola correcta." },
        { id: "su08", type: "identify", q: "Documento breve de lo que hiciste en un ticket se llama…", options: ["Notas / resolución en el ticket (KB si aplica)", "Solo un meme", "Un VLAN tag", "Un DMA"], answer: 0, explain: "Buenas notas = menos reincidencia y mejores artículos de conocimiento." },
        { id: "su09", type: "fill", q: "Sigla común del acuerdo de nivel de servicio (inglés):", answer: "SLA", accept: ["SLA", "sla"], explain: "Service Level Agreement: tiempos de respuesta/resolución acordados." },
        { id: "su10", type: "mc", q: "Primera pregunta útil en 'no tengo Internet':", options: ["¿Es solo tu PC o más equipos? ¿Wi‑Fi o cable? ¿Hay IP?", "¿Qué color prefieres?", "¿Reinstalamos Windows ya?", "¿Borramos System32?"], answer: 0, explain: "Aísla: local vs red vs ISP. Luego capa por capa." },
        { id: "su11", type: "scenario", q: "Ticket: impresora de piso no imprime; urgencia media. Ya hay ping OK. Siguiente paso razonable:", options: ["Revisar cola/Spooler/driver y página de prueba", "Cambiar el ISP completo", "Reinstalar Office en todos", "Ignorar el ticket"], answer: 0, explain: "Red OK → capa de impresión. No amplíes el cambio innecesariamente." },
        { id: "su12", type: "tf", q: "Pedir captura de error y hora exacta ayuda al diagnóstico.", answer: true, explain: "Correlacionar con logs del servidor/evento es oro en soporte." },
        { id: "su13", type: "mc", q: "Soft skill clave en soporte:", options: ["Comunicación clara y paciencia", "Gritar más fuerte", "Ocultar el estado del ticket", "Prometer milagros sin ETA"], answer: 0, explain: "Expectativas honestas + actualizaciones = confianza del usuario." },
        { id: "su14", type: "order", q: "Ordena el cierre de un incidente bien gestionado:", items: ["Confirmar con el usuario que el servicio volvió", "Documentar causa y solución", "Marcar ticket resuelto/cerrado según proceso", "Crear KB si es recurrente"], answer: [0, 1, 2, 3], explain: "Cerrar sin confirmar genera reopens y mala CSAT." },
        { id: "su15", type: "mc", q: "Un change (cambio) controlado implica…", options: ["Ventana, riesgo, aprobación y plan de rollback cuando aplique", "Cambiar todo a las 3 a.m. sin aviso", "Solo un tweet", "Desactivar backups"], answer: 0, explain: "CAB/aprobaciones según criticidad. Emergencias tienen proceso aparte." },
        { id: "su16", type: "scenario", q: "Usuario pide la contraseña del admin 'solo un minuto'. Respuesta correcta:", options: ["No compartir credenciales admin; usar procesos seguros (LAPS/PAM/elevación)", "Decírsela por chat", "Pegarla en un post-it", "Publicarla en el wiki público"], answer: 0, explain: "Nunca compartas root/admin. Ofrece alternativas auditables." }
      ]
    });
  }

  // ——— BOSS battles (incidentes reales) ———
  setBoss("linux", [
    { id: "lxB1", type: "scenario", q: "BOSS: Servidor web caído. df -h muestra / al 100%. ¿Acción inmediata más sensata?", options: ["Liberar espacio (logs/tmp) y revisar qué llena el disco", "Solo reiniciar en bucle", "chmod -R 777 /", "Desconectar la red para siempre"], answer: 0, explain: "Disco lleno rompe servicios. Identifica con du; rota logs; evita borrados ciegos en /." },
    { id: "lxB2", type: "order", q: "BOSS: Tras liberar disco, ordena validación:", items: ["Comprobar df -h", "Revisar servicio (systemctl status)", "Probar endpoint/curl local", "Monitorear logs por recidiva"], answer: [0, 1, 2, 3], explain: "Confirma espacio, servicio y funcionalidad antes de cerrar el incidente." },
    { id: "lxB3", type: "mc", q: "BOSS: process en D state y load alto por I/O. Herramienta útil:", options: ["iotop / iostat / dmesg", "mspaint", "solo colorls", "Event Viewer de Windows en el Linux"], answer: 0, explain: "Investigar I/O wait y errores de disco/SAN antes de matar procesos a ciegas." },
    { id: "lxB4", type: "tf", q: "BOSS: Usar sudo con cuidado y auditar es mejor que trabajar siempre como root interactivo.", answer: true, explain: "Menor superficie de error y mejor trazabilidad." },
    { id: "lxB5", type: "fill", q: "BOSS: Comando para ver estado de un servicio systemd llamado nginx:", answer: "systemctl status nginx", accept: ["systemctl status nginx", "service nginx status"], explain: "systemctl status|restart|stop|start son el estándar en distros modernas." }
  ]);

  setBoss("windows", [
    { id: "wnB1", type: "scenario", q: "BOSS: Nadie imprime; el print server muestra Spooler detenido. ¿Qué haces?", options: ["Reiniciar Print Spooler, revisar eventos y colas", "Formatear AD", "Cambiar todos los monitores", "Deshabilitar el firewall del ISP"], answer: 0, explain: "Spooler caído = síntoma clásico. Revisa dependencias y fallos recurrentes en Event Viewer." },
    { id: "wnB2", type: "mc", q: "BOSS: Tras reinicio, Event ID de servicio apunta a driver de impresora. Siguiente paso:", options: ["Actualizar/quitar driver problemático; aislar cola", "Ignorar", "Borrar System32", "Desactivar paginación siempre"], answer: 0, explain: "Drivers corruptos tumbaron Spooler históricamente. Aísla el driver culpable." },
    { id: "wnB3", type: "order", q: "BOSS: PC no une al dominio tras cambio de credenciales locales:", items: ["Verificar reloj/hora y red al DC", "Probar DNS del dominio", "Reintentar join o secure channel", "Revisar Event Viewer si falla"], answer: [0, 1, 2, 3], explain: "Kerberos es sensible a la hora; DNS incorrecto rompe localización del DC." },
    { id: "wnB4", type: "tf", q: "BOSS: ipconfig /renew solo ayuda si el adaptador usa DHCP.", answer: true, explain: "En IP estática, renew no cambia la configuración manual." },
    { id: "wnB5", type: "identify", q: "BOSS: ¿Dónde miras un BSOD recurrente con detalle?", options: ["Visor de eventos + volcados (dump)", "Solo el salvapantallas", "La bandeja de tóner", "El canal Wi‑Fi 14"], answer: 0, explain: "Minidumps y Reliability Monitor ayudan a correlacionar drivers." }
  ]);

  setBoss("printers", [
    { id: "prB1", type: "scenario", q: "BOSS TICKET: 40 usuarios; cola \\\\print01\\finanzas Offline. Ping a 10.20.5.50 OK. Puerto 9100 filtrado desde el server. Causa raíz más probable:", options: ["Firewall/ACL bloquea 9100 entre print server e impresora", "Tóner al 99%", "Mouse sin batería", "CSS del intranet"], answer: 0, explain: "ICMP no implica que el servicio de impresión esté permitido. Abre 9100/631 según diseño." },
    { id: "prB2", type: "order", q: "BOSS: Restablecer impresión SMB en planta:", items: ["Validar IP y puertos desde print server", "Reiniciar Spooler en print01", "Limpiar trabajos atascados", "Página de prueba y avisar usuarios"], answer: [0, 1, 2, 3], explain: "Red → servicio → cola → verificación de negocio." },
    { id: "prB3", type: "mc", q: "BOSS: Trabajos PCL a impresora solo PS generan:", options: ["Basura/errores de lenguaje; alinear driver (PCL/PS/universal)", "Mejor calidad mágica", "IPv6 automático", "WPA3"], answer: 0, explain: "Mismatch de PDL es un clásico en flotas mixtas." },
    { id: "prB4", type: "match", q: "BOSS: Empareja protocolo/puerto:", pairs: [
      { left: "IPP", right: "631/tcp" },
      { left: "LPR", right: "515/tcp" },
      { left: "JetDirect raw", right: "9100/tcp" },
      { left: "SMB share", right: "445/tcp (y relacionados)" }
    ], explain: "Conocer puertos acelera firewall y tcpchecks." },
    { id: "prB5", type: "tf", q: "BOSS: Una reserva DHCP para la MAC de la impresora evita que cambie de IP y rompa puertos TCP/IP de clientes.", answer: true, explain: "Estabilidad de dirección = menos tickets 'offline'." },
    { id: "prB6", type: "scenario", q: "BOSS: Drum life exceeded + rayas negras. Acción correcta:", options: ["Reemplazar unidad de tambor / kit mantenimiento según modelo", "Solo reiniciar el PC del usuario", "Cambiar DNS a 8.8.8.8", "Aumentar la VLAN MTU a ciegas"], answer: 0, explain: "Síntomas de drum no se arreglan con red. Sigue el contador del fabricante." }
  ]);

  setBoss("networks", [
    { id: "netB1", type: "scenario", q: "BOSS: Sucursal sin Internet. LAN interna OK (ping gateway). WAN IP del router 0.0.0.0. ¿Qué revisar?", options: ["Enlace ISP/DHCP WAN/PPPoE/credenciales y cable ONT", "Spooler", "Driver de teclado", "Licencia de Office"], answer: 0, explain: "Gateway LAN responde pero no hay WAN: problema de borde/ISP." },
    { id: "netB2", type: "mc", q: "BOSS: Tras VPN, el usuario llega a servidores pero navega lento. Split tunnel desactivado. Explicación:", options: ["Full tunnel manda también Internet por el datacenter", "El cable HDMI está mal", "Falta tóner", "Cat5e no soporta VPN"], answer: 0, explain: "Sin split tunnel, el ancho de banda del hub limita la web." },
    { id: "netB3", type: "order", q: "BOSS: DNS interno no resuelve app.corp. Ordena:", items: ["nslookup app.corp contra DNS corporativo", "Verificar zonas/registros en el DNS server", "Probar desde otro cliente/segmento", "Revisar forwarders si es nombre externo híbrido"], answer: [0, 1, 2, 3], explain: "Separa fallo de cliente vs zona vs forwarder." },
    { id: "netB4", type: "mc", q: "Cliente en VLAN 20 no imprime a VLAN 30. Switch L2 sin routing. ¿Qué falta?", options: ["Enrutamiento entre VLANs (L3) + ACLs que lo permitan", "Más tóner", "Desactivar STP siempre", "Usar solo WEP"], answer: 0, explain: "VLANs distintas necesitan router/SVI y reglas. Un L2 puro no enruta." },
    { id: "netB5", type: "fill", q: "BOSS: Puerto HTTPS (número):", answer: "443", accept: ["443"], explain: "443/tcp HTTPS. En firewalls suele permitirse saliente a Internet." },
    { id: "netB6", type: "tf", q: "BOSS: Un ping fallido no siempre significa que el host esté apagado (ICMP puede estar filtrado).", answer: true, explain: "Complementa con prueba de puerto de aplicación (443, 22, 9100…)." }
  ]);

  setBoss("programming", [
    { id: "pgB1", type: "scenario", q: "BOSS: Prod roto tras deploy. ¿Primera acción sensata?", options: ["Rollback al release anterior y luego investigar", "Seguir pusheando fixes a ciegas sin métricas", "Borrar el repo", "Apagar DNS global"], answer: 0, explain: "Mitiga impacto primero; post‑mortem después." },
    { id: "pgB2", type: "mc", q: "BOSS: TypeError en consola solo en un navegador viejo. Enfoque:", options: ["Reproducir, ver API faltante, transpilar/polyfill o subir requisito", "Reinstalar impresora", "Cambiar VLAN", "Formatear el DC"], answer: 0, explain: "Compatibilidad = entorno. No asumas que tu Chrome local = todos los usuarios." },
    { id: "pgB3", type: "order", q: "BOSS: Hotfix con git:", items: ["Crear rama desde main estable", "Aplicar fix mínimo + pruebas", "Code review / CI", "Merge y tag de release"], answer: [0, 1, 2, 3], explain: "Cambios mínimos reducen riesgo en incidentes." },
    { id: "pgB4", type: "tf", q: "BOSS: console.log en prod puede filtrar datos sensibles si no se controla.", answer: true, explain: "Evita loguear secretos; usa niveles y redacción." },
    { id: "pgB5", type: "identify", q: "BOSS: ¿Qué sistema guarda historial de cambios del código?", options: ["Git (VCS)", "DHCP", "Spooler", "WPA3"], answer: 0, explain: "Git permite blame, revert y branches de emergencia." }
  ]);

  setBoss("support", [
    { id: "suB1", type: "scenario", q: "BOSS: P1 — correo caído para toda la empresa. Tú eres N1. ¿Qué haces primero?", options: ["Declarar incidente mayor, comunicar, escalar N2/messaging y seguir runbook", "Pedir a cada usuario que reinicie solo", "Cerrar tickets como spam", "Cambiar la SSIDs del Wi‑Fi guest"], answer: 0, explain: "P1 = comunicación + bridge + escalamiento. No inventes fixes masivos sin runbook." },
    { id: "suB2", type: "order", q: "BOSS: Gestión de crisis N1:", items: ["Abrir canal/bridge y avisar stakeholders", "Recopilar síntomas y alcance", "Ejecutar pasos N1 del runbook / escalar", "Actualizar status cada X minutos"], answer: [0, 1, 2, 3], explain: "Silencio en un P1 destruye confianza." },
    { id: "suB3", type: "mc", q: "BOSS: Usuario VIP exige salto de cola para un wallpaper. ¿Respuesta?", options: ["Explicar prioridad con respeto; no romper P1 reales; ofrecer request normal", "Dejar el P1 y poner wallpapers", "Entregar admin domain", "Mentir sobre el ETA"], answer: 0, explain: "Prioridad objetiva > ego. Escala políticas a tu lead si hay presión." },
    { id: "suB4", type: "tf", q: "BOSS: Documentar workarounds en KB reduce tickets repetidos.", answer: true, explain: "Deflecta carga N1 y estandariza respuestas." },
    { id: "suB5", type: "match", q: "BOSS: Empareja acción con principio:", pairs: [
      { left: "No compartir admin", right: "Seguridad / mínimo privilegio" },
      { left: "Confirmar cierre", right: "Calidad de servicio" },
      { left: "Escalar con logs", right: "Handoff efectivo" },
      { left: "SLA", right: "Tiempos acordados" }
    ], explain: "Soporte excelente = técnica + proceso + ética." }
  ]);
})();
