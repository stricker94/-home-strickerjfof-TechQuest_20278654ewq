/**
 * Tech Quest — Niveles 4–5 (Experto/Maestro) + mundos Cloud y Base de datos
 * Cargar después de levels-expand.js
 */
(function levels5Expand() {
  const maxL = (typeof GAME_CONFIG !== "undefined" && GAME_CONFIG.levelsPerWorld) || 5;

  function add(worldId, questions) {
    const w = getWorldById(worldId);
    if (!w) return;
    w.questions = w.questions.concat(questions);
  }

  function pushWorld(world) {
    if (getWorldById(world.id)) return;
    WORLDS.push(world);
  }

  // Actualizar etiquetas a 5 niveles
  window.LEVEL_LABELS = {
    1: { name: "Básico", icon: "1️⃣" },
    2: { name: "Intermedio", icon: "2️⃣" },
    3: { name: "Avanzado", icon: "3️⃣" },
    4: { name: "Experto", icon: "4️⃣" },
    5: { name: "Maestro", icon: "5️⃣" }
  };
  window.LEVELS_PER_WORLD = maxL;

  add("linux", [
  {
    "id": "lxL4a",
    "level": 4,
    "type": "mc",
    "q": "¿Qué hace `nice -n 10 comando`?",
    "options": [
      "Ejecuta el comando con menor prioridad de CPU",
      "Borra el proceso",
      "Monta NFS",
      "Cambia el hostname"
    ],
    "answer": 0,
    "explain": "nice ajusta la prioridad; valores altos = menos prioridad."
  },
  {
    "id": "lxL4b",
    "level": 4,
    "type": "tf",
    "q": "`journalctl -u ssh` muestra logs del servicio ssh en sistemas con systemd.",
    "answer": true,
    "explain": "journalctl consulta el journal; -u filtra por unidad."
  },
  {
    "id": "lxL4c",
    "level": 4,
    "type": "fill",
    "q": "Comando para ver uso de disco por directorio (humano):",
    "answer": "du -h",
    "accept": "du -h|du -sh|du -h --max-depth=1",
    "explain": "du resume uso de disco; -h legible, -s resumen."
  },
  {
    "id": "lxL4d",
    "level": 4,
    "type": "scenario",
    "q": "Disco al 100% en /. Mejor primer paso:",
    "options": [
      "Identificar qué crece (du/ncdu) y limpiar logs/tmp con cuidado",
      "rm -rf /",
      "Desactivar swap siempre",
      "chmod 777 /var"
    ],
    "answer": 0,
    "explain": "Mide antes de borrar; prioriza logs rotados y caches."
  },
  {
    "id": "lxL4e",
    "level": 4,
    "type": "mc",
    "q": "`setfacl` se usa para…",
    "options": [
      "Listas de control de acceso extendidas (ACL)",
      "Solo montar ISO",
      "Configurar DNS",
      "Imprimir"
    ],
    "answer": 0,
    "explain": "Las ACL permiten permisos más granulares que ugo clásico."
  },
  {
    "id": "lxL4f",
    "level": 4,
    "type": "order",
    "q": "Ordena endurecer SSH básico:",
    "items": [
      "Desactivar root login por password",
      "Usar claves SSH",
      "Cambiar/limitar Puerto y AllowUsers",
      "Reiniciar sshd y probar otra sesión"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Nunca cortes tu única sesión sin probar en paralelo."
  },
  {
    "id": "lxL4g",
    "level": 4,
    "type": "match",
    "q": "Empareja:",
    "pairs": [
      {
        "left": "crontab -e",
        "right": "Editar cron del usuario"
      },
      {
        "left": "systemctl enable",
        "right": "Arrancar servicio al boot"
      },
      {
        "left": "ulimit -n",
        "right": "Límite de file descriptors"
      },
      {
        "left": "strace",
        "right": "Rastrear syscalls de un proceso"
      }
    ],
    "explain": "Herramientas de ops Linux."
  },
  {
    "id": "lxL4h",
    "level": 4,
    "type": "tf",
    "q": "Un bind mount puede montar un directorio existente en otra ruta.",
    "answer": true,
    "explain": "Útil en contenedores y reorganización sin mover datos."
  },
  {
    "id": "lxL5a",
    "level": 5,
    "type": "mc",
    "q": "En cgroups v2, ¿qué controlas típicamente?",
    "options": [
      "Límites de CPU/memoria/IO por grupo de procesos",
      "Solo el wallpaper",
      "Solo el Spooler",
      "Solo Cat6"
    ],
    "answer": 0,
    "explain": "cgroups aíslan recursos; base de contenedores."
  },
  {
    "id": "lxL5b",
    "level": 5,
    "type": "scenario",
    "q": "Kernel panic recurrente tras update. Acción seria:",
    "options": [
      "Boot a kernel anterior, revisar logs, revertir módulo/driver",
      "Borrar /boot entero",
      "Desactivar SELinux a ciegas siempre",
      "Formatear sin backup"
    ],
    "answer": 0,
    "explain": "Conserva kernels previos en GRUB."
  },
  {
    "id": "lxL5c",
    "level": 5,
    "type": "fill",
    "q": "Herramienta para inspeccionar tráfico en interfaz (clásica):",
    "answer": "tcpdump",
    "accept": "tcpdump|wireshark",
    "explain": "tcpdump captura paquetes; requiere privilegios."
  },
  {
    "id": "lxL5d",
    "level": 5,
    "type": "mc",
    "q": "`chroot` sirve para…",
    "options": [
      "Cambiar la raíz aparente del proceso (jaula ligera)",
      "Cifrar discos",
      "Asignar VLANs",
      "Calibrar monitores"
    ],
    "answer": 0,
    "explain": "Útil en recovery; no es sandbox completo como namespaces."
  },
  {
    "id": "lxL5e",
    "level": 5,
    "type": "identify",
    "q": "Archivo típico de configuración de red en Ubuntu moderno (Netplan):",
    "options": [
      "/etc/netplan/*.yaml",
      "/etc/printcap solo",
      "C:\\Windows",
      "hosts.deny únicamente"
    ],
    "answer": 0,
    "explain": "Netplan genera config para systemd-networkd o NetworkManager."
  },
  {
    "id": "lxL5f",
    "level": 5,
    "type": "order",
    "q": "Ordena investigación de alto load average:",
    "items": [
      "uptime / top / htop",
      "Identificar CPU vs IO wait",
      "Revisar iostat/vmstat y procesos",
      "Aplicar fix (kill, tune, hardware)"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Load alto no siempre es CPU: mira wa%."
  },
  {
    "id": "lxL5g",
    "level": 5,
    "type": "tf",
    "q": "AppArmor/SELinux pueden denegar accesos aunque los permisos Unix parezcan correctos.",
    "answer": true,
    "explain": "Revisa logs de AVC/denied al depurar."
  },
  {
    "id": "lxL5h",
    "level": 5,
    "type": "scenario",
    "q": "NFS mounts cuelgan el shell al listar. Sospecha:",
    "options": [
      "Servidor NFS/red caída y opciones hard sin timeout adecuado",
      "Falta de tóner",
      "DNS de impresora",
      "Cable HDMI"
    ],
    "answer": 0,
    "explain": "soft/timeo/intr y monitoreo del export ayudan."
  }
]);

  add("windows", [
  {
    "id": "wnL4a",
    "level": 4,
    "type": "mc",
    "q": "¿Qué es WinRM?",
    "options": [
      "Remoting de administración de Windows ( foreman de PowerShell Remoting )",
      "Un antivirus",
      "Un protocolo de impresión LPT",
      "Una VLAN"
    ],
    "answer": 0,
    "explain": "WinRM habilita sesiones remotas seguras si está bien endurecido."
  },
  {
    "id": "wnL4b",
    "level": 4,
    "type": "tf",
    "q": "`Get-WinEvent` consulta el Visor de eventos desde PowerShell.",
    "answer": true,
    "explain": "Más potente que Get-EventLog legacy."
  },
  {
    "id": "wnL4c",
    "level": 4,
    "type": "scenario",
    "q": "Perfil de usuario se corrompe (login con perfil temporal). Acción típica:",
    "options": [
      "Renombrar/backup del perfil viejo y recrear según procedimiento",
      "Borrar SAM a ciegas",
      "Desinstalar TCP/IP",
      "Cambiar solo el tema"
    ],
    "answer": 0,
    "explain": "Documenta SID y carpetas antes de tocar."
  },
  {
    "id": "wnL4d",
    "level": 4,
    "type": "fill",
    "q": "Consola para ver políticas resultantes (gpresult HTML):",
    "answer": "gpresult /h",
    "accept": "gpresult /h|gpresult /h report.html",
    "explain": "gpresult /h archivo.html genera informe."
  },
  {
    "id": "wnL4e",
    "level": 4,
    "type": "mc",
    "q": "AppLocker / WDAC sirven para…",
    "options": [
      "Controlar qué ejecutables/scripts pueden correr",
      "Asignar IPs",
      "Calibrar color",
      "Gestionar tóner"
    ],
    "answer": 0,
    "explain": "Reduce malware y software no autorizado."
  },
  {
    "id": "wnL4f",
    "level": 4,
    "type": "match",
    "q": "Empareja:",
    "pairs": [
      {
        "left": "rsop.msc",
        "right": "Conjunto de directivas resultante (GUI legacy)"
      },
      {
        "left": "certmgr.msc",
        "right": "Certificados de usuario"
      },
      {
        "left": "gpedit.msc",
        "right": "Editor de directivas local"
      },
      {
        "left": "compmgmt.msc",
        "right": "Administración de equipos"
      }
    ],
    "explain": "MMC habituales."
  },
  {
    "id": "wnL4g",
    "level": 4,
    "type": "order",
    "q": "Ordena troubleshooting de trust de dominio:",
    "items": [
      "Verificar DNS hacia DC",
      "Probar nltest / secure channel",
      "Revisar hora (Kerberos)",
      "Resetear cuenta de máquina si aplica"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "La mayoría de joins fallan por DNS/hora."
  },
  {
    "id": "wnL4h",
    "level": 4,
    "type": "tf",
    "q": "Hyper-V puede hospedar VMs en ediciones Pro/Enterprise adecuadas.",
    "answer": true,
    "explain": "Requiere virtualización en firmware habilitada."
  },
  {
    "id": "wnL5a",
    "level": 5,
    "type": "mc",
    "q": "Un Blue Screen con DRIVER_IRQL suele apuntar a…",
    "options": [
      "Driver en modo kernel fallando",
      "Falta de papel",
      "Phishing solo",
      "Cable Cat3"
    ],
    "answer": 0,
    "explain": "Actualiza/rollback drivers; Memory Diagnostic también."
  },
  {
    "id": "wnL5b",
    "level": 5,
    "type": "scenario",
    "q": "Autenticación NTLM lateral se abusa en la red. Mitigación:",
    "options": [
      "Restringir NTLM, privilegiar Kerberos, LAPS, segmentar admin",
      "Dar Domain Admin a todos",
      "Desactivar logs",
      "Exponer RDP abierto"
    ],
    "answer": 0,
    "explain": "Tiering de administración reduce movimiento lateral."
  },
  {
    "id": "wnL5c",
    "level": 5,
    "type": "fill",
    "q": "Cmdlet para reiniciar un equipo remoto (uno común):",
    "answer": "Restart-Computer",
    "accept": "Restart-Computer|restart-computer",
    "explain": "Restart-Computer -ComputerName host"
  },
  {
    "id": "wnL5d",
    "level": 5,
    "type": "mc",
    "q": "Credential Guard protege…",
    "options": [
      "Secretos de autenticación aislándolos con VBS",
      "La cola de impresión únicamente",
      "Solo el wallpaper",
      "DHCP scopes"
    ],
    "answer": 0,
    "explain": "Parte del stack de seguridad basado en virtualización."
  },
  {
    "id": "wnL5e",
    "level": 5,
    "type": "identify",
    "q": "Herramienta para capturar tráfico en Windows (Microsoft):",
    "options": [
      "netsh trace / Message Analyzer legacy / pktmon",
      "mspaint",
      "Notepad",
      "calc"
    ],
    "answer": 0,
    "explain": "pktmon es moderno en Windows 10+."
  },
  {
    "id": "wnL5f",
    "level": 5,
    "type": "order",
    "q": "Ordena respuesta a ransomware en endpoint Windows:",
    "items": [
      "Aislar de la red",
      "Identificar alcance y muestras",
      "Restaurar desde backup limpio",
      "Lecciones + hardening"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "No pagues como primera opción automática."
  },
  {
    "id": "wnL5g",
    "level": 5,
    "type": "tf",
    "q": "Un GPO con WMI filter puede aplicar solo a ciertos OS/hardware.",
    "answer": true,
    "explain": "Útil para targeting fino."
  },
  {
    "id": "wnL5h",
    "level": 5,
    "type": "scenario",
    "q": "Impresión vía servidor falla solo a un OU. Sospecha:",
    "options": [
      "GPO/deploy de impresoras o permisos de cola en ese OU",
      "Falta de HDMI",
      "Cat6 del monitor",
      "BIOS de la impresora térmica"
    ],
    "answer": 0,
    "explain": "Revisa Point and Print / Deployed Printers."
  }
]);

  add("printers", [
  {
    "id": "prL4a",
    "level": 4,
    "type": "mc",
    "q": "Un print server centralizado tipicamente…",
    "options": [
      "Hospeda colas compartidas y drivers para muchos clientes",
      "Solo imprime PDFs locales sin red",
      "Reemplaza al DHCP",
      "Es un tipo de phishing"
    ],
    "answer": 0,
    "explain": "Reduce caos de drivers en cada PC."
  },
  {
    "id": "prL4b",
    "level": 4,
    "type": "tf",
    "q": "El puerto TCP 9100 (Raw/JetDirect) envía el trabajo casi directo al dispositivo.",
    "answer": true,
    "explain": "Simple y rápido; menos control que IPP en algunos escenarios."
  },
  {
    "id": "prL4c",
    "level": 4,
    "type": "scenario",
    "q": "Usuarios de VLAN de invitados no deben alcanzar impresoras corporativas. Control:",
    "options": [
      "ACL/firewall entre VLANs + no publicar colas allí",
      "Poner impresoras en VLAN guest",
      "Abrir todo el 445",
      "Desactivar spooler en el server"
    ],
    "answer": 0,
    "explain": "Segmentación + least privilege."
  },
  {
    "id": "prL4d",
    "level": 4,
    "type": "fill",
    "q": "Protocolo moderno preferido de impresión en IP (sigla):",
    "answer": "IPP",
    "accept": "IPP|ipp",
    "explain": "Internet Printing Protocol (a menudo 631)."
  },
  {
    "id": "prL4e",
    "level": 4,
    "type": "mc",
    "q": "Branch Office Direct Printing (idea)…",
    "options": [
      "Evita que el trabajo dé la vuelta al data center; imprime más cerca",
      "Obliga a USB siempre",
      "Elimina drivers",
      "Cifra solo el tóner"
    ],
    "answer": 0,
    "explain": "Útil en WAN lentas con Windows print features."
  },
  {
    "id": "prL4f",
    "level": 4,
    "type": "match",
    "q": "Empareja:",
    "pairs": [
      {
        "left": "PCL",
        "right": "Lenguaje común HP-ish"
      },
      {
        "left": "PostScript",
        "right": "Lenguaje de descripción de página Adobe"
      },
      {
        "left": "Driver Type 4",
        "right": "V4 print driver modelo moderno Windows"
      },
      {
        "left": "Spooler",
        "right": "Servicio que gestiona la cola"
      }
    ],
    "explain": "Stack de impresión."
  },
  {
    "id": "prL4g",
    "level": 4,
    "type": "order",
    "q": "Ordena desplegar cola en print server:",
    "items": [
      "Instalar driver firmado adecuado",
      "Crear impresora/cola y puerto",
      "Compartir y permisos",
      "Probar desde cliente y documentar"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Prueba con cuenta no-admin."
  },
  {
    "id": "prL4h",
    "level": 4,
    "type": "tf",
    "q": "Una impresora en modo \"offline\" en el cliente puede deberse a SNMP/status o puerto incorrecto.",
    "answer": true,
    "explain": "Revisa puerto, snmp y cola pausada."
  },
  {
    "id": "prL4i",
    "level": 4,
    "type": "mc",
    "q": "¿Qué es una impresora \"universal driver\"?",
    "options": [
      "Driver que cubre muchas series reduciendo paquetes",
      "Un cable USB-C",
      "Un protocolo DNS",
      "Una GPO de firewall"
    ],
    "answer": 0,
    "explain": "Aún así valida modelos críticos."
  },
  {
    "id": "prL4j",
    "level": 4,
    "type": "scenario",
    "q": "Trabajos se quedan en \"Imprimiendo\" en el server pero la impresora no recibe. Chequeos:",
    "options": [
      "Puerto/IP, conectividad, cola pausada, driver crash, firewall 9100/IPP",
      "Solo reiniciar Excel",
      "Cambiar wallpaper",
      "Actualizar antimalware del monitor"
    ],
    "answer": 0,
    "explain": "Divide cliente vs server vs dispositivo."
  },
  {
    "id": "prL5a",
    "level": 5,
    "type": "mc",
    "q": "PrintNightmare (idea general) explotaba…",
    "options": [
      "Fallos en el Spooler / Point and Print para ejecución remota",
      "Solo el color del tóner",
      "DHCP",
      "HDMI"
    ],
    "answer": 0,
    "explain": "Parchea, restringe Point and Print, least privilege."
  },
  {
    "id": "prL5b",
    "level": 5,
    "type": "scenario",
    "q": "Empresa quiere pull-print / follow-me printing. Beneficio:",
    "options": [
      "Libera en el dispositivo tras autenticarse; menos documentos olvidados",
      "Imprime más lento siempre",
      "Elimina la red",
      "Quita MFA"
    ],
    "answer": 0,
    "explain": "Mejora confidencialidad física."
  },
  {
    "id": "prL5c",
    "level": 5,
    "type": "fill",
    "q": "Puerto típico IPP/IPPS (número):",
    "answer": "631",
    "accept": "631",
    "explain": "IPP clásico usa 631; IPPS va sobre TLS."
  },
  {
    "id": "prL5d",
    "level": 5,
    "type": "mc",
    "q": "En un entorno con print server + clientes Windows, \"Package Point and Print\" ayuda a…",
    "options": [
      "Distribuir drivers empaquetados de forma más controlada",
      "Asignar VLANs automáticamente",
      "Cifrar la PSU",
      "Medir latencia óptica"
    ],
    "answer": 0,
    "explain": "Combínalo con políticas de seguridad actualizadas."
  },
  {
    "id": "prL5e",
    "level": 5,
    "type": "identify",
    "q": "Log útil en Windows cuando la cola falla:",
    "options": [
      "Event Viewer → PrintService / Microsoft-Windows-PrintService",
      "Solo mspaint",
      "Solo Calculator",
      "Solo Disk Cleanup"
    ],
    "answer": 0,
    "explain": "Habilita log operacional de PrintService."
  },
  {
    "id": "prL5f",
    "level": 5,
    "type": "order",
    "q": "Ordena migrar print server viejo a nuevo:",
    "items": [
      "Inventariar colas/puertos/drivers/permisos",
      "Montar drivers firmados en destino",
      "Recrear/exportar colas",
      "Cortar DNS/alias y validar clientes"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Mantén rollback (alias TTL bajo)."
  },
  {
    "id": "prL5g",
    "level": 5,
    "type": "tf",
    "q": "Una ACL en el switch que bloquee SMB desde VLAN de usuarios a impresoras directas puede forzar uso del print server.",
    "answer": true,
    "explain": "Diseño intencional de caminos de impresión."
  },
  {
    "id": "prL5h",
    "level": 5,
    "type": "scenario",
    "q": "Impresora multifunción escanea a \\share y falla tras endurecer SMB. Causa probable:",
    "options": [
      "SMBv1 deshabilitado / firma SMB / credenciales del dispositivo",
      "Falta de papel solo",
      "Cable VGA",
      "BIOS del mouse"
    ],
    "answer": 0,
    "explain": "Usa SMBv2+ y cuenta de servicio con mínimo privilegio."
  },
  {
    "id": "prL5i",
    "level": 5,
    "type": "mc",
    "q": "QoS para impresión en WAN saturada…",
    "options": [
      "Puede priorizar o limitar tráfico de colas críticas",
      "Reemplaza al driver",
      "Arregla el drum solo",
      "Asigna IPv6 magicamente"
    ],
    "answer": 0,
    "explain": "No sustituye buen diseño de Branch printing."
  },
  {
    "id": "prL5j",
    "level": 5,
    "type": "match",
    "q": "Empareja fallo:",
    "pairs": [
      {
        "left": "Páginas en símbolo de basura",
        "right": "Driver/lenguaje incorrecto (PCL vs PS)"
      },
      {
        "left": "Atasco frecuente",
        "right": "Papel húmedo/rodillos"
      },
      {
        "left": "Color corrido",
        "right": "Calibración/belt/drum"
      },
      {
        "left": "No imprime de un app",
        "right": "Spool formato / aislamiento de driver"
      }
    ],
    "explain": "Diagnóstico por síntoma."
  }
]);

  add("networks", [
  {
    "id": "netL4a",
    "level": 4,
    "type": "mc",
    "q": "Una ACL extended en router típicamente filtra por…",
    "options": [
      "IPs, puertos y protocolo",
      "Solo el color del LED",
      "Solo el hostname NetBIOS",
      "Solo el tóner"
    ],
    "answer": 0,
    "explain": "Controla tráfico L3/L4."
  },
  {
    "id": "netL4b",
    "level": 4,
    "type": "tf",
    "q": "QinQ (802.1ad) encapsula VLAN dentro de VLAN para proveedores.",
    "answer": true,
    "explain": "Útil en redes de carrier/metro."
  },
  {
    "id": "netL4c",
    "level": 4,
    "type": "scenario",
    "q": "Impresoras en VLAN 40; PCs en VLAN 20. ¿Qué permite imprimir?",
    "options": [
      "Enrutamiento inter-VLAN + ACL que permita puertos de impresión",
      "Que compartan el mismo broadcast sin router",
      "Desactivar Spanning Tree siempre",
      "Usar solo NetBEUI"
    ],
    "answer": 0,
    "explain": "L3 + políticas."
  },
  {
    "id": "netL4d",
    "level": 4,
    "type": "fill",
    "q": "Protocolo para evitar bucles en switches L2 (sigla):",
    "answer": "STP",
    "accept": "STP|RSTP|MSTP|stp",
    "explain": "Spanning Tree Protocol (y variantes)."
  },
  {
    "id": "netL4e",
    "level": 4,
    "type": "mc",
    "q": "ECMP sirve para…",
    "options": [
      "Balancear rutas de igual costo",
      "Cifrar discos",
      "Calibrar monitores",
      "Gestionar colas de print"
    ],
    "answer": 0,
    "explain": "Equal-Cost Multi-Path."
  },
  {
    "id": "netL4f",
    "level": 4,
    "type": "match",
    "q": "Empareja:",
    "pairs": [
      {
        "left": "OSPF",
        "right": "IGP de estado de enlace"
      },
      {
        "left": "BGP",
        "right": "Enrutamiento entre AS"
      },
      {
        "left": "HSRP/VRRP",
        "right": "Gateway redundante"
      },
      {
        "left": "NAT",
        "right": "Traducción de direcciones"
      }
    ],
    "explain": "Routing core."
  },
  {
    "id": "netL4g",
    "level": 4,
    "type": "order",
    "q": "Ordena diseñar Wi‑Fi empresarial básico:",
    "items": [
      "Site survey / canales",
      "SSID + seguridad WPA2/3-Enterprise",
      "VLANs/SSID mapping",
      "AAA (RADIUS) y monitoreo"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Evita canales solapados y PSK único gigante."
  },
  {
    "id": "netL4h",
    "level": 4,
    "type": "tf",
    "q": "Un mirror/SPAN port copia tráfico para IDS o análisis.",
    "answer": true,
    "explain": "Cuidado con oversubscription del puerto destino."
  },
  {
    "id": "netL4i",
    "level": 4,
    "type": "mc",
    "q": "DSCP/CoS se relacionan con…",
    "options": [
      "Marcado para QoS",
      "Solo DHCP",
      "Solo ARP",
      "Solo DNS inverso"
    ],
    "answer": 0,
    "explain": "Prioriza voz/video vs best-effort."
  },
  {
    "id": "netL4j",
    "level": 4,
    "type": "scenario",
    "q": "Usuarios se quejan de lentitud solo a un print server remoto. Herramientas:",
    "options": [
      "iperf/mtr/latency, QoS, ver si el path WAN satura",
      "Solo reiniciar el mouse",
      "Cambiar tema Windows",
      "Actualizar tóner"
    ],
    "answer": 0,
    "explain": "Mide RTT/pérdida antes de culpar la app."
  },
  {
    "id": "netL5a",
    "level": 5,
    "type": "mc",
    "q": "Un ataque de VLAN hopping (idea) intenta…",
    "options": [
      "Alcanzar otra VLAN abusando trunking/doble tagging",
      "Robar solo el cable HDMI",
      "Cambiar el SSID del café",
      "Romper el drum"
    ],
    "answer": 0,
    "explain": "Desactiva DTP innecesario; native VLAN careful."
  },
  {
    "id": "netL5b",
    "level": 5,
    "type": "scenario",
    "q": "BGP neighbor down intermitente. Chequeos:",
    "options": [
      "Logs, timers, MTU/MSS, filtros de prefijos, IPsec si aplica",
      "Reinstalar Office",
      "Cambiar PSU del monitor",
      "Desactivar STP en todo el core a ciegas"
    ],
    "answer": 0,
    "explain": "MTU mismatch es clásico con tunnels."
  },
  {
    "id": "netL5c",
    "level": 5,
    "type": "fill",
    "q": "Puerto HTTPS por defecto (número):",
    "answer": "443",
    "accept": "443",
    "explain": "TLS en 443; HTTP 80."
  },
  {
    "id": "netL5d",
    "level": 5,
    "type": "mc",
    "q": "Anycast DNS significa…",
    "options": [
      "Misma IP anunciada desde múltiples sitios; ruteo lleva al más cercano",
      "Un solo servidor físico siempre",
      "Solo IPv4 link-local",
      "Impresoras en 9100"
    ],
    "answer": 0,
    "explain": "Mejora resiliencia y latencia."
  },
  {
    "id": "netL5e",
    "level": 5,
    "type": "identify",
    "q": "Técnica para segmentar microservicios en DC (moderno):",
    "options": [
      "Microsegmentación / Zero Trust network policies",
      "Solo hubs 10BASE-T",
      "Solo hubs Token Ring",
      "Solo coax Thinnet obligatorio"
    ],
    "answer": 0,
    "explain": "Policies por identidad/workload."
  },
  {
    "id": "netL5f",
    "level": 5,
    "type": "order",
    "q": "Ordena troubleshooting \"no ruta a impresora VLAN\":",
    "items": [
      "Verificar IP/máscara/gateway del cliente",
      "Traceroute/ping al gateway y a la impresora",
      "Revisar ACL/firewall inter-VLAN",
      "Revisar ARP/MAC en switch de acceso"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Capa por capa."
  },
  {
    "id": "netL5g",
    "level": 5,
    "type": "tf",
    "q": "BFD detecta fallos de forwarding más rápido que hellos lentos solos.",
    "answer": true,
    "explain": "Bidirectional Forwarding Detection."
  },
  {
    "id": "netL5h",
    "level": 5,
    "type": "scenario",
    "q": "Captura muestra TCP retransmissions altos al print server. Implica:",
    "options": [
      "Congestión/pérdida en el path; revisar WAN/QoS/buffers",
      "Que el driver PCL es \"feliz\"",
      "Que falta tinta negra solo",
      "Que DNS está perfecto siempre"
    ],
    "answer": 0,
    "explain": "Retransmissions = red o endpoint saturado."
  },
  {
    "id": "netL5i",
    "level": 5,
    "type": "mc",
    "q": "VXLAN se usa para…",
    "options": [
      "Overlay L2 sobre L3 en data centers",
      "Reemplazar USB-C",
      "Calibrar pantallas",
      "Firmar drivers de audio"
    ],
    "answer": 0,
    "explain": "Extiende segmentos sobre underlay IP."
  },
  {
    "id": "netL5j",
    "level": 5,
    "type": "match",
    "q": "Empareja herramienta:",
    "pairs": [
      {
        "left": "Wireshark",
        "right": "Análisis de paquetes"
      },
      {
        "left": "Nmap",
        "right": "Escaneo de puertos/hosts"
      },
      {
        "left": "mtr",
        "right": "Ruta + pérdida continua"
      },
      {
        "left": "iperf3",
        "right": "Medir throughput"
      }
    ],
    "explain": "Toolkit de red."
  }
]);

  add("programming", [
  {
    "id": "pgL4a",
    "level": 4,
    "type": "mc",
    "q": "Big-O de buscar en hash map promedio:",
    "options": [
      "O(1) amortizado",
      "O(n!)",
      "O(n³) siempre",
      "O(log log log) fijo"
    ],
    "answer": 0,
    "explain": "Peor caso puede degradar; promedio excelente."
  },
  {
    "id": "pgL4b",
    "level": 4,
    "type": "tf",
    "q": "Una race condition ocurre cuando el resultado depende del orden de hilos impredecible.",
    "answer": true,
    "explain": "Usa locks/atómicos/colas."
  },
  {
    "id": "pgL4c",
    "level": 4,
    "type": "scenario",
    "q": "API devuelve 500 intermitente. Primeros pasos:",
    "options": [
      "Logs, idempotencia, reintentos con backoff, métricas",
      "Ignorar y hardcodear 200",
      "Desactivar TLS",
      "Borrar la base"
    ],
    "answer": 0,
    "explain": "Observabilidad antes de adivinar."
  },
  {
    "id": "pgL4d",
    "level": 4,
    "type": "fill",
    "q": "Sistema de control de versiones más usado (nombre):",
    "answer": "git",
    "accept": "git|Git",
    "explain": "git init / clone / commit / push."
  },
  {
    "id": "pgL4e",
    "level": 4,
    "type": "mc",
    "q": "CI/CD significa…",
    "options": [
      "Integración y entrega/despliegue continuos",
      "Cable Internet Directo",
      "Chip Interno de Disco",
      "Control de Impresión Digital"
    ],
    "answer": 0,
    "explain": "Automatiza test y deploy."
  },
  {
    "id": "pgL4f",
    "level": 4,
    "type": "match",
    "q": "Empareja:",
    "pairs": [
      {
        "left": "Unit test",
        "right": "Prueba de una función aislada"
      },
      {
        "left": "Integration",
        "right": "Varios componentes juntos"
      },
      {
        "left": "Mock",
        "right": "Doble de prueba"
      },
      {
        "left": "Lint",
        "right": "Análisis estático de estilo/bugs"
      }
    ],
    "explain": "Calidad de código."
  },
  {
    "id": "pgL4g",
    "level": 4,
    "type": "order",
    "q": "Ordena flujo git feature:",
    "items": [
      "branch",
      "commits",
      "pull request/review",
      "merge a main"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Evita commits directo a main en equipo."
  },
  {
    "id": "pgL4h",
    "level": 4,
    "type": "tf",
    "q": "SQL injection se mitiga con consultas parametrizadas/ORM cuidadoso.",
    "answer": true,
    "explain": "Nunca concatenes input crudo."
  },
  {
    "id": "pgL5a",
    "level": 5,
    "type": "mc",
    "q": "Un memory leak en un servicio largo causa…",
    "options": [
      "Uso de RAM creciente hasta OOM/lentitud",
      "Mejor FPS siempre",
      "IPs públicas extras",
      "Más VLANs"
    ],
    "answer": 0,
    "explain": "Profiling y liberar recursos."
  },
  {
    "id": "pgL5b",
    "level": 5,
    "type": "scenario",
    "q": "Debes versionar una API pública. Mejor práctica:",
    "options": [
      "Versionado (/v1) y compatibilidad hacia atrás",
      "Romper clientes sin aviso cada día",
      "Reusar códigos de error al azar",
      "Exponer secretos en URLs"
    ],
    "answer": 0,
    "explain": "Deprecation policy clara."
  },
  {
    "id": "pgL5c",
    "level": 5,
    "type": "fill",
    "q": "Formato de intercambio muy usado en APIs web (sigla):",
    "answer": "JSON",
    "accept": "JSON|json",
    "explain": "JavaScript Object Notation."
  },
  {
    "id": "pgL5d",
    "level": 5,
    "type": "mc",
    "q": "Idempotencia en PUT/DELETE ayuda a…",
    "options": [
      "Reintentar sin duplicar efectos indeseados",
      "Imprimir más rápido",
      "Asignar DNS",
      "Calibrar GPU"
    ],
    "answer": 0,
    "explain": "Clave en redes no confiables."
  },
  {
    "id": "pgL5e",
    "level": 5,
    "type": "identify",
    "q": "Patrón para desacoplar productores/consumidores:",
    "options": [
      "Cola / message broker (p.ej. Rabbit/Kafka ideas)",
      "Solo variables globales",
      "Solo busy-wait",
      "Solo GOTO"
    ],
    "answer": 0,
    "explain": "Mejora resiliencia."
  },
  {
    "id": "pgL5f",
    "level": 5,
    "type": "order",
    "q": "Ordena code review útil:",
    "items": [
      "CI verde",
      "Diff pequeño claro",
      "Comentarios de diseño/riesgos",
      "Aprobar o pedir cambios"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Reviews no son cacería de estilo solo."
  },
  {
    "id": "pgL5g",
    "level": 5,
    "type": "tf",
    "q": "Semantic versioning MAJOR.MINOR.PATCH comunica breaking changes en MAJOR.",
    "answer": true,
    "explain": "Ej: 2.0.0 rompe respecto a 1.x."
  },
  {
    "id": "pgL5h",
    "level": 5,
    "type": "scenario",
    "q": "Feature flag apagada en prod pero el bug sigue. Sospecha:",
    "options": [
      "Caché CDN/config no refrescada o flag mal cableada",
      "Que git blame miente siempre",
      "Que JSON no existe",
      "Que HTTPS sobra"
    ],
    "answer": 0,
    "explain": "Verifica evaluación real de la flag."
  }
]);

  add("support", [
  {
    "id": "suL4a",
    "level": 4,
    "type": "mc",
    "q": "Un runbook es…",
    "options": [
      "Procedimiento paso a paso para un incidente/cambio conocido",
      "Un tipo de cable",
      "Un antivirus",
      "Una GPO de wallpaper"
    ],
    "answer": 0,
    "explain": "Reduce improvisación bajo presión."
  },
  {
    "id": "suL4b",
    "level": 4,
    "type": "tf",
    "q": "La matriz de escalamiento define cuándo y a quién subir un ticket.",
    "answer": true,
    "explain": "Incluye severidades y contactos."
  },
  {
    "id": "suL4c",
    "level": 4,
    "type": "scenario",
    "q": "VIP insiste en saltarse el proceso de change. Tú…",
    "options": [
      "Explicas riesgo, ofreces camino rápido formal, documentas",
      "Haces el cambio oculto sin registro",
      "Das Domain Admin",
      "Borras logs"
    ],
    "answer": 0,
    "explain": "Protege al negocio y a ti."
  },
  {
    "id": "suL4d",
    "level": 4,
    "type": "fill",
    "q": "Sigla del acuerdo de nivel operacional entre equipos internos:",
    "answer": "OLA",
    "accept": "OLA|ola",
    "explain": "Operational Level Agreement."
  },
  {
    "id": "suL4e",
    "level": 4,
    "type": "mc",
    "q": "CSAT mide…",
    "options": [
      "Satisfacción del cliente post-atención",
      "Velocidad de CPU",
      "Uso de RAM",
      "Temperatura PSU"
    ],
    "answer": 0,
    "explain": "Encuestas cortas tras resolver."
  },
  {
    "id": "suL4f",
    "level": 4,
    "type": "match",
    "q": "Empareja:",
    "pairs": [
      {
        "left": "P1",
        "right": "Crítico / negocio parado"
      },
      {
        "left": "P3",
        "right": "Impacto medio/bajo típico"
      },
      {
        "left": "RCA",
        "right": "Análisis de causa raíz"
      },
      {
        "left": "CAB",
        "right": "Comité de cambios"
      }
    ],
    "explain": "Vocabulario de servicio."
  },
  {
    "id": "suL4g",
    "level": 4,
    "type": "order",
    "q": "Ordena tomar un ticket nuevo:",
    "items": [
      "Clasificar impacto/urgencia",
      "Diagnosticar con preguntas",
      "Aplicar fix/workaround",
      "Documentar y cerrar con confirmación"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Cierre prematuro genera reopens."
  },
  {
    "id": "suL4h",
    "level": 4,
    "type": "tf",
    "q": "Un major incident bridge debe tener un facilitator y canal único de verdad.",
    "answer": true,
    "explain": "Evita ruido en 10 chats."
  },
  {
    "id": "suL5a",
    "level": 5,
    "type": "mc",
    "q": "Shift-left en soporte significa…",
    "options": [
      "Empoderar N1/self-service/KB para resolver antes",
      ".Mover todo a N3 siempre",
      "Eliminar monitoreo",
      "Ocultar errores"
    ],
    "answer": 0,
    "explain": "Mejor experiencia y menor costo."
  },
  {
    "id": "suL5b",
    "level": 5,
    "type": "scenario",
    "q": "Métricas muestran MTTR alto pero FCR bajo. Interpreta:",
    "options": [
      "Se reabre mucho / poca resolución real en primer contacto",
      "Que todo está perfecto",
      "Que falta tinta",
      "Que STP falló"
    ],
    "answer": 0,
    "explain": "FCR = first contact resolution."
  },
  {
    "id": "suL5c",
    "level": 5,
    "type": "fill",
    "q": "Sigla de tiempo medio de reparación/resolución:",
    "answer": "MTTR",
    "accept": "MTTR|mttr",
    "explain": "Mean Time To Repair/Restore/Resolve según contexto."
  },
  {
    "id": "suL5d",
    "level": 5,
    "type": "mc",
    "q": "Un post-mortem blameless busca…",
    "options": [
      "Aprender de fallas sin castigar personas",
      "Culpar al junior",
      "Borrar evidencias",
      "Silenciar al cliente"
    ],
    "answer": 0,
    "explain": "Mejora sistemas y procesos."
  },
  {
    "id": "suL5e",
    "level": 5,
    "type": "identify",
    "q": "Canal preferido para anunciar outage masivo a usuarios:",
    "options": [
      "Status page / correo oficial / banner acordado",
      "Rumores en pasillo solo",
      "DM random",
      "Cambiar wallpaper de servers"
    ],
    "answer": 0,
    "explain": "Un mensaje consistente."
  },
  {
    "id": "suL5f",
    "level": 5,
    "type": "order",
    "q": "Ordena mejora continua del service desk:",
    "items": [
      "Medir (CSAT/MTTR/FCR)",
      "Identificar cuellos",
      "Actualizar KB/automatizar",
      "Reentrenar y repetir"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Sin datos, solo opiniones."
  },
  {
    "id": "suL5g",
    "level": 5,
    "type": "tf",
    "q": "Documentar workarounds en la KB evita que cada agente reinventé la rueda.",
    "answer": true,
    "explain": "Incluye fecha y validez."
  },
  {
    "id": "suL5h",
    "level": 5,
    "type": "scenario",
    "q": "Proveedor SaaS caído; usuarios culpan a TI interna. Comunicación:",
    "options": [
      "Status claro, ETA si hay, workarounds, updates periódicos",
      "Silencio total",
      "Culpar a un usuario",
      "Prometer 100% uptime falso"
    ],
    "answer": 0,
    "explain": "Transparencia reduce tickets duplicados."
  }
]);

  add("security", [
  {
    "id": "secL4a",
    "level": 4,
    "type": "mc",
    "q": "Un SOC típicamente…",
    "options": [
      "Monitorea alertas de seguridad y coordina respuesta",
      "Imprime carnets solo",
      "Asigna VLANs de voz",
      "Gestiona tóner"
    ],
    "answer": 0,
    "explain": "Security Operations Center."
  },
  {
    "id": "secL4b",
    "level": 4,
    "type": "tf",
    "q": "El principle of least privilege aplica también a tokens OAuth y service accounts.",
    "answer": true,
    "explain": "Scopes mínimos y rotación."
  },
  {
    "id": "secL4c",
    "level": 4,
    "type": "scenario",
    "q": "Empleado reporta USB \"de RH\" en el baño. Acción:",
    "options": [
      "No conectar; reportar a seguridad física/TI",
      "Probarlo en finanzas",
      "Instalar drivers",
      "Abrirlo en el DC"
    ],
    "answer": 0,
    "explain": "USB baiting."
  },
  {
    "id": "secL4d",
    "level": 4,
    "type": "fill",
    "q": "Sigla de gestión de identidad y acceso:",
    "answer": "IAM",
    "accept": "IAM|iam",
    "explain": "Identity and Access Management."
  },
  {
    "id": "secL4e",
    "level": 4,
    "type": "mc",
    "q": "SPF/DKIM/DMARC ayudan a…",
    "options": [
      "Autenticar correo y reducir spoofing de dominio",
      "Acelerar Wi‑Fi",
      "Calibrar pantallas",
      "Particionar discos"
    ],
    "answer": 0,
    "explain": "Endurece el email del dominio."
  },
  {
    "id": "secL4f",
    "level": 4,
    "type": "match",
    "q": "Empareja:",
    "pairs": [
      {
        "left": "SIEM",
        "right": "Correlación de logs/alertas"
      },
      {
        "left": "EDR",
        "right": "Detección en endpoints"
      },
      {
        "left": "WAF",
        "right": "Protección apps web"
      },
      {
        "left": "VPN",
        "right": "Túnel cifrado remoto"
      }
    ],
    "explain": "Controles."
  },
  {
    "id": "secL4g",
    "level": 4,
    "type": "order",
    "q": "Ordena endurecer cuenta cloud admin:",
    "items": [
      "Password manager + única",
      "MFA fuerte (FIDO2)",
      "PIM/JIT privilegios",
      "Alertas y revisión de logs"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Admin always-on es riesgo."
  },
  {
    "id": "secL4h",
    "level": 4,
    "type": "tf",
    "q": "Un CASB ayuda a visibilidad/control de SaaS shadow IT.",
    "answer": true,
    "explain": "Cloud Access Security Broker."
  },
  {
    "id": "secL5a",
    "level": 5,
    "type": "mc",
    "q": "La cadena supply-chain attack compromete…",
    "options": [
      "Dependencias/proveedores para llegar a ti",
      "Solo el cable HDMI",
      "Solo el color del tema",
      "Solo el spooler local"
    ],
    "answer": 0,
    "explain": "Verifica firmas y SBOMs."
  },
  {
    "id": "secL5b",
    "level": 5,
    "type": "scenario",
    "q": "Detectas Cobalt Strike beacon. Contención:",
    "options": [
      "Aislar host, reset credenciales, cazar lateral movement",
      "Ignorar",
      "Publicar IoCs en redes sin contexto",
      "Apagar el firewall de análisis"
    ],
    "answer": 0,
    "explain": "Preserva volatilidad si forense lo pide."
  },
  {
    "id": "secL5c",
    "level": 5,
    "type": "fill",
    "q": "Sigla de análisis de comportamiento de usuarios/entidades:",
    "answer": "UEBA",
    "accept": "UEBA|ueba",
    "explain": "User and Entity Behavior Analytics."
  },
  {
    "id": "secL5d",
    "level": 5,
    "type": "mc",
    "q": "Certificate pinning en apps móviles busca…",
    "options": [
      "Mitigar MITM con CAs no esperadas",
      "Acelerar DNS",
      "Mejorar PCL",
      "Asignar VLANs"
    ],
    "answer": 0,
    "explain": "Tiene trade-offs de rotación."
  },
  {
    "id": "secL5e",
    "level": 5,
    "type": "identify",
    "q": "Estándar de cifrado de discos en Windows empresarial común:",
    "options": [
      "BitLocker",
      "Notepad",
      "Paint",
      "Solitaire"
    ],
    "answer": 0,
    "explain": "Con TPM + escrow de claves."
  },
  {
    "id": "secL5f",
    "level": 5,
    "type": "order",
    "q": "Ordena tabletop de ransomware:",
    "items": [
      "Definir escenario",
      "Roles y comunicaciones",
      "Decidir aislamiento/restore",
      "Documentar gaps"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Ensayar antes del incidente real."
  },
  {
    "id": "secL5g",
    "level": 5,
    "type": "tf",
    "q": "Exponer Elasticsearch/Redis sin auth a Internet es una mala práctica grave.",
    "answer": true,
    "explain": "Muchas brechas empiezan así."
  },
  {
    "id": "secL5h",
    "level": 5,
    "type": "scenario",
    "q": "Phishing captura session cookie. Mitigación moderna:",
    "options": [
      "Tokens de corta vida, binding, logout global, MFA step-up",
      "Alargar la cookie a 1 año",
      "Desactivar HTTPS",
      "Compartir cookie en Slack"
    ],
    "answer": 0,
    "explain": "Session theft es real."
  }
]);

  add("hardware", [
  {
    "id": "hwL4a",
    "level": 4,
    "type": "mc",
    "q": "IPMI/iLO/iDRAC permiten…",
    "options": [
      "Gestionar servidor out-of-band (consola remota, sensores)",
      "Imprimir carteles",
      "Asignar SSIDs",
      "Calibrar color de apps"
    ],
    "answer": 0,
    "explain": "Red de management separada."
  },
  {
    "id": "hwL4b",
    "level": 4,
    "type": "tf",
    "q": "Un RAID 5 tolera falla de un disco; RAID 6 de dos (típico).",
    "answer": true,
    "explain": "Rebuilds largos aumentan riesgo."
  },
  {
    "id": "hwL4c",
    "level": 4,
    "type": "scenario",
    "q": "Servidor reporta PSU redundancy lost. Acción:",
    "options": [
      "Reemplazar PSU fallida; verificar cableado y carga",
      "Ignorar hasta incendio",
      "Subir clocks",
      "Quitar un disco"
    ],
    "answer": 0,
    "explain": "Redundancia N+1 existe para usarse."
  },
  {
    "id": "hwL4d",
    "level": 4,
    "type": "fill",
    "q": "Bus de expansión dominante para GPUs (sigla):",
    "answer": "PCIe",
    "accept": "PCIe|PCI-E|pci-e",
    "explain": "Peripheral Component Interconnect Express."
  },
  {
    "id": "hwL4e",
    "level": 4,
    "type": "mc",
    "q": "ECC RAM detecta/corrige…",
    "options": [
      "Errores de memoria de bits",
      "Errores de DNS",
      "Atascos de papel",
      "Phishing"
    ],
    "answer": 0,
    "explain": "Estándar en servers."
  },
  {
    "id": "hwL4f",
    "level": 4,
    "type": "match",
    "q": "Empareja:",
    "pairs": [
      {
        "left": "SAS",
        "right": "Disco enterprise dual-port típico"
      },
      {
        "left": "SATA",
        "right": "Interfaz disco común consumer/server"
      },
      {
        "left": "M.2",
        "right": "Factor de forma (NVMe/SATA)"
      },
      {
        "left": "RDIMM",
        "right": "DIMM registrado para servers"
      }
    ],
    "explain": "Almacenamiento/memoria."
  },
  {
    "id": "hwL4g",
    "level": 4,
    "type": "order",
    "q": "Ordena RMA de disco en RAID:",
    "items": [
      "Identificar disco fallido (beacon)",
      "Verificar backup/health array",
      "Reemplazar hot-spare/disco",
      "Monitorear rebuild"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "No saques el disco equivocado."
  },
  {
    "id": "hwL4h",
    "level": 4,
    "type": "tf",
    "q": "Undervolting cuidadoso puede bajar temperatura; overclock inestable causa crashes.",
    "answer": true,
    "explain": "En enterprise suele preferirse stock + buen cooling."
  },
  {
    "id": "hwL5a",
    "level": 5,
    "type": "mc",
    "q": "Un U.2/U.3 NVMe en server se usa para…",
    "options": [
      "Almacenamiento rápido hot-swap en bahías",
      "Solo audio",
      "Solo Wi‑Fi",
      "Solo LPT"
    ],
    "answer": 0,
    "explain": "Alternativa a muchos M.2 internos."
  },
  {
    "id": "hwL5b",
    "level": 5,
    "type": "scenario",
    "q": "POST pasa pero no hay video en iGPU tras meter GPU. Chequeos:",
    "options": [
      "Cable al GPU correcto, PSU PCIe, monitor input, reseat",
      "Reinstalar Excel",
      "Cambiar VLAN",
      "Actualizar tóner"
    ],
    "answer": 0,
    "explain": "Muchas boards desactivan salida onboard."
  },
  {
    "id": "hwL5c",
    "level": 5,
    "type": "fill",
    "q": "Interfaz de gestión remota Dell common (sigla 5 letras):",
    "answer": "iDRAC",
    "accept": "iDRAC|idrac",
    "explain": "Integrated Dell Remote Access Controller."
  },
  {
    "id": "hwL5d",
    "level": 5,
    "type": "mc",
    "q": "CXL (idea emergente) busca…",
    "options": [
      "Mejorar coherencia/expansión de memoria entre dispositivos",
      "Reemplazar Ethernet",
      "Ser un tipo de tóner",
      "Sustituir DNS"
    ],
    "answer": 0,
    "explain": "Tendencia en data centers modernos."
  },
  {
    "id": "hwL5e",
    "level": 5,
    "type": "identify",
    "q": "Conector de alimentación CPU común de 8 pines:",
    "options": [
      "EPS 8-pin (ATX12V)",
      "RJ-11",
      "LPT",
      "PS/2 mouse only"
    ],
    "answer": 0,
    "explain": "No confundir con PCIe 8-pin de GPU."
  },
  {
    "id": "hwL5f",
    "level": 5,
    "type": "order",
    "q": "Ordena diagnóstico memoria ECC con correctables altos:",
    "items": [
      "Revisar logs BMC/OS",
      "Reseat/limpiar slots",
      "Probar módulo en otro slot",
      "Reemplazar DIMM"
    ],
    "answer": [
      0,
      1,
      2,
      3
    ],
    "explain": "Aísla slot vs módulo."
  },
  {
    "id": "hwL5g",
    "level": 5,
    "type": "tf",
    "q": "Mezclar firmware de backplane incorrecto puede hacer desaparecer discos.",
    "answer": true,
    "explain": "Sigue matriz de compatibilidad del vendor."
  },
  {
    "id": "hwL5h",
    "level": 5,
    "type": "scenario",
    "q": "Cluster pierde quorum tras un nodo. Diseño adecuado incluye…",
    "options": [
      "Quorum/witness y fencing correctos",
      "Un solo switch sin redundancia siempre",
      "DNS dinámico apagado",
      "PSU única"
    ],
    "answer": 0,
    "explain": "Evita split-brain."
  }
]);

  pushWorld({
  "id": "cloud",
  "name": "Cloud / servicios",
  "icon": "☁️",
  "color": "#7ec8ff",
  "description": "Nube, SaaS/IaaS/PaaS, almacenamiento, backups y sync.",
  "questions": [
    {
      "id": "cl01",
      "level": 1,
      "type": "mc",
      "q": "La \"nube\" en IT suele significar…",
      "options": [
        "Servicios bajo demanda por Internet (cómputo/almacenamiento/apps)",
        "Una nube del clima dentro del CPU",
        "Solo USB",
        "Solo impresoras locales"
      ],
      "answer": 0,
      "explain": "Pay-as-you-go y elasticidad."
    },
    {
      "id": "cl02",
      "level": 1,
      "type": "tf",
      "q": "SaaS es software que usas vía web sin instalar el servidor tú mismo.",
      "answer": true,
      "explain": "Ej: correo, CRM, oficina online."
    },
    {
      "id": "cl03",
      "level": 1,
      "type": "mc",
      "q": "IaaS te ofrece principalmente…",
      "options": [
        "Infraestructura virtual (VMs, redes, discos)",
        "Solo una app empaquetada sin control",
        "Solo el cable HDMI",
        "Solo tóner"
      ],
      "answer": 0,
      "explain": "Tú administras más la stack."
    },
    {
      "id": "cl04",
      "level": 1,
      "type": "fill",
      "q": "Sigla de software como servicio:",
      "answer": "SaaS",
      "accept": "SaaS|saas",
      "explain": "Software as a Service."
    },
    {
      "id": "cl05",
      "level": 1,
      "type": "identify",
      "q": "Ejemplo típico de PaaS:",
      "options": [
        "Plataforma para desplegar apps sin gestionar todo el OS",
        "Un hub 10/100",
        "Una impresora LPT",
        "Un cable coax"
      ],
      "answer": 0,
      "explain": "Platform as a Service."
    },
    {
      "id": "cl06",
      "level": 1,
      "type": "scenario",
      "q": "Necesitas editar docs con el equipo en tiempo real. Suele ser:",
      "options": [
        "SaaS de documentos / colaboración",
        "Montar un mainframe en casa obligatorio",
        "Solo papel carbón",
        "Solo FTP anónimo"
      ],
      "answer": 0,
      "explain": "Colaboración cloud."
    },
    {
      "id": "cl07",
      "level": 1,
      "type": "mc",
      "q": "Un beneficio común de la nube es…",
      "options": [
        "Escalar recursos según demanda",
        "Que nunca hay que pagar",
        "Que no requiere Internet nunca",
        "Que elimina backups"
      ],
      "answer": 0,
      "explain": "Elasticidad; aún pagas y aseguras."
    },
    {
      "id": "cl08",
      "level": 1,
      "type": "tf",
      "q": "Debes seguir teniendo buenas contraseñas y MFA en servicios cloud.",
      "answer": true,
      "explain": "La seguridad compartida no elimina tu responsabilidad."
    },
    {
      "id": "cl09",
      "level": 2,
      "type": "mc",
      "q": "El modelo de responsabilidad compartida indica…",
      "options": [
        "El proveedor asegura la nube; tú aseguras lo que pones en ella",
        "Que nadie asegura nada",
        "Que el ISP hace backups mágicos",
        "Que MFA sobra"
      ],
      "answer": 0,
      "explain": "Varía entre IaaS/PaaS/SaaS."
    },
    {
      "id": "cl10",
      "level": 2,
      "type": "tf",
      "q": "Object storage (p.ej. S3-like) guarda objetos/archivos accesibles por API.",
      "answer": true,
      "explain": "Distinto de un disco de bloque de una VM."
    },
    {
      "id": "cl11",
      "level": 2,
      "type": "scenario",
      "q": "Laptop robada con sync de OneDrive/Drive. Riesgo mitigable con:",
      "options": [
        "MFA, borrado remoto, cifrado de disco, revisión de sesiones",
        "Nada; sync es inseguro siempre",
        "Desactivar TLS",
        "Publicar el password"
      ],
      "answer": 0,
      "explain": "Identidad + device control."
    },
    {
      "id": "cl12",
      "level": 2,
      "type": "fill",
      "q": "Sigla de infraestructura como servicio:",
      "answer": "IaaS",
      "accept": "IaaS|iaas",
      "explain": "Infrastructure as a Service."
    },
    {
      "id": "cl13",
      "level": 2,
      "type": "mc",
      "q": "Un snapshot/AMI tipicamente sirve para…",
      "options": [
        "Capturar estado de disco/VM para backup o clon",
        "Calibrar monitores",
        "Asignar VLANs al tóner",
        "Firmar USB"
      ],
      "answer": 0,
      "explain": "No reemplaza estrategia de backup 3-2-1."
    },
    {
      "id": "cl14",
      "level": 2,
      "type": "match",
      "q": "Empareja:",
      "pairs": [
        {
          "left": "SaaS",
          "right": "App completa gestionada"
        },
        {
          "left": "PaaS",
          "right": "Plataforma para tu código"
        },
        {
          "left": "IaaS",
          "right": "VMs/red/discos"
        },
        {
          "left": "FaaS/serverless",
          "right": "Ejecutar funciones a demanda"
        }
      ],
      "explain": "Modelos cloud."
    },
    {
      "id": "cl15",
      "level": 2,
      "type": "order",
      "q": "Ordena subir un archivo a object storage (idea):",
      "items": [
        "Autenticarte",
        "Crear/usar bucket",
        "Subir objeto con permisos mínimos",
        "Verificar acceso y cifrado"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explain": "Buckets públicos son un clásico incidente."
    },
    {
      "id": "cl16",
      "level": 2,
      "type": "tf",
      "q": "Regiones y zonas de disponibilidad mejoran resiliencia geográfica.",
      "answer": true,
      "explain": "Diseña multi-AZ para alta disponibilidad."
    },
    {
      "id": "cl17",
      "level": 3,
      "type": "mc",
      "q": "RPO se refiere a…",
      "options": [
        "Cuántos datos puedes permitirte perder (punto de recuperación)",
        "Velocidad del Wi‑Fi",
        "Temperatura de CPU",
        "Número de VLANs"
      ],
      "answer": 0,
      "explain": "Recovery Point Objective."
    },
    {
      "id": "cl18",
      "level": 3,
      "type": "scenario",
      "q": "Backup solo en la misma región que prod. Riesgo:",
      "options": [
        "Desastre regional te deja sin copia",
        "Mejor RTO siempre",
        "Más seguridad física mágica",
        "Que el DNS sea perfecto"
      ],
      "answer": 0,
      "explain": "Copia offsite/otra región."
    },
    {
      "id": "cl19",
      "level": 3,
      "type": "fill",
      "q": "Sigla del objetivo de tiempo de recuperación:",
      "answer": "RTO",
      "accept": "RTO|rto",
      "explain": "Recovery Time Objective."
    },
    {
      "id": "cl20",
      "level": 3,
      "type": "mc",
      "q": "CDN sirve para…",
      "options": [
        "Acercar contenido estático a usuarios (caché perimetral)",
        "Reemplazar la base de datos OLTP",
        "Gestionar Spooler",
        "Asignar IPs RFC1918 solo"
      ],
      "answer": 0,
      "explain": "Mejora latencia y offload de origen."
    },
    {
      "id": "cl21",
      "level": 3,
      "type": "match",
      "q": "Empareja:",
      "pairs": [
        {
          "left": "Warm standby",
          "right": "Copia parcialmente lista"
        },
        {
          "left": "Pilot light",
          "right": "Mínimo core listo para crecer"
        },
        {
          "left": "Multi-site active",
          "right": "Activo en varios sitios"
        },
        {
          "left": "Backup restore",
          "right": "Recuperar desde respaldos"
        }
      ],
      "explain": "DR strategies."
    },
    {
      "id": "cl22",
      "level": 3,
      "type": "order",
      "q": "Ordena prueba de restore:",
      "items": [
        "Elegir backup",
        "Restaurar a entorno aislado",
        "Validar integridad/app",
        "Documentar tiempo real (RTO)"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explain": "Backup no probado = esperanza."
    },
    {
      "id": "cl23",
      "level": 3,
      "type": "tf",
      "q": "IAM roles con privilegios mínimos son preferibles a access keys de larga vida en VMs.",
      "answer": true,
      "explain": "Usa roles de instancia/workload identity."
    },
    {
      "id": "cl24",
      "level": 3,
      "type": "scenario",
      "q": "Factura cloud explota por VMs olvidadas. Control:",
      "options": [
        "Tags, budgets/alerts, apagado automático, inventory",
        "Ignorar billing",
        "Dar admin a todos",
        "Desactivar logs de costos"
      ],
      "answer": 0,
      "explain": "FinOps básico."
    },
    {
      "id": "cl25",
      "level": 4,
      "type": "mc",
      "q": "Un VPC/VNet es…",
      "options": [
        "Red virtual aislada en la nube",
        "Una impresora virtual",
        "Un antivirus",
        "Un tipo de tóner"
      ],
      "answer": 0,
      "explain": "Subnets, route tables, security groups."
    },
    {
      "id": "cl26",
      "level": 4,
      "type": "tf",
      "q": "Security Groups suelen ser stateful (permites in y vuelve la respuesta).",
      "answer": true,
      "explain": "NACLs a veces son stateless según cloud."
    },
    {
      "id": "cl27",
      "level": 4,
      "type": "scenario",
      "q": "Base de datos expuesta 0.0.0.0/0 en SG. Acción:",
      "options": [
        "Restringir a app subnets/bastion; rotar credenciales",
        "Dejarlo por comodidad",
        "Publicar en Twitter la IP",
        "Desactivar TLS"
      ],
      "answer": 0,
      "explain": "Ataques automatizados escanean todo."
    },
    {
      "id": "cl28",
      "level": 4,
      "type": "fill",
      "q": "Sigla de red privada virtual (túnel):",
      "answer": "VPN",
      "accept": "VPN|vpn",
      "explain": "Site-to-site o client VPN hacia cloud."
    },
    {
      "id": "cl29",
      "level": 4,
      "type": "mc",
      "q": "Object lock / WORM en backups ayuda contra…",
      "options": [
        "Ransomware que intenta borrar/cifrar backups",
        "Lentitud de DNS",
        "Atascos de papel",
        "Overclock"
      ],
      "answer": 0,
      "explain": "Inmutabilidad."
    },
    {
      "id": "cl30",
      "level": 4,
      "type": "match",
      "q": "Empareja:",
      "pairs": [
        {
          "left": "Egress",
          "right": "Tráfico saliente"
        },
        {
          "left": "Ingress",
          "right": "Tráfico entrante"
        },
        {
          "left": "Peering",
          "right": "Conectar redes virtuales"
        },
        {
          "left": "Private endpoint",
          "right": "Acceso privado a PaaS"
        }
      ],
      "explain": "Red cloud."
    },
    {
      "id": "cl31",
      "level": 4,
      "type": "order",
      "q": "Ordena landing zone básica:",
      "items": [
        "Cuentas/suscripciones separadas",
        "Red + identidad central",
        "Guardrails (policies)",
        "Workloads en cuentas hijas"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explain": "Aísla prod/dev y seguridad."
    },
    {
      "id": "cl32",
      "level": 4,
      "type": "tf",
      "q": "Cross-region replication puede mejorar DR de object storage.",
      "answer": true,
      "explain": "Ojo con costos y cumplimiento de datos."
    },
    {
      "id": "cl33",
      "level": 5,
      "type": "mc",
      "q": "Chaos engineering busca…",
      "options": [
        "Probar resiliencia inyectando fallos de forma controlada",
        "Romper prod sin plan",
        "Eliminar monitoreo",
        "Desactivar backups"
      ],
      "answer": 0,
      "explain": "Mejora confianza en el diseño."
    },
    {
      "id": "cl34",
      "level": 5,
      "type": "scenario",
      "q": "Key leaked en GitHub público. Respuesta:",
      "options": [
        "Rotar/revocar de inmediato, scrub history, auditar uso",
        "Dejarla 30 días",
        "Copiar a otro repo público",
        "Desactivar MFA"
      ],
      "answer": 0,
      "explain": "Assume compromise."
    },
    {
      "id": "cl35",
      "level": 5,
      "type": "fill",
      "q": "Sigla de plataforma como servicio:",
      "answer": "PaaS",
      "accept": "PaaS|paas",
      "explain": "Platform as a Service."
    },
    {
      "id": "cl36",
      "level": 5,
      "type": "mc",
      "q": "Un service mesh (idea) aporta…",
      "options": [
        "mTLS, retries, observabilidad entre microservicios",
        "Mejor tóner",
        "VLANs mágicas en impresoras",
        "Overclock de RAM"
      ],
      "answer": 0,
      "explain": "Sidecars/proxies."
    },
    {
      "id": "cl37",
      "level": 5,
      "type": "identify",
      "q": "Patrón para secretos en cloud:",
      "options": [
        "Secrets Manager / Vault + rotación",
        "Plaintext en imagen Docker",
        "En el README público",
        "En el wallpaper"
      ],
      "answer": 0,
      "explain": "Nunca hardcodees."
    },
    {
      "id": "cl38",
      "level": 5,
      "type": "order",
      "q": "Ordena incident billing anomaly:",
      "items": [
        "Alert de presupuesto",
        "Identificar recurso culpable",
        "Contener (apagar/restringir)",
        "Postmortem FinOps"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explain": "Minutos importan en crypto miners."
    },
    {
      "id": "cl39",
      "level": 5,
      "type": "tf",
      "q": "Datos personales pueden tener restricciones de residencia (qué región usar).",
      "answer": true,
      "explain": "Compliance GDPR y locales."
    },
    {
      "id": "cl40",
      "level": 5,
      "type": "scenario",
      "q": "Lift-and-shift de app monolítica a una sola VM enorme. Riesgo:",
      "options": [
        "Poco aprovechamiento cloud-native; SPOF y costo",
        "Alta elasticidad automática garantizada",
        "Zero ops para siempre",
        "Backups innecesarios"
      ],
      "answer": 0,
      "explain": "A veces es paso intermedio válido si se planifica."
    }
  ],
  "boss": [
    {
      "id": "clB1",
      "level": 5,
      "type": "scenario",
      "q": "BOSS: Bucket público con PII. Contención:",
      "options": [
        "Bloquear acceso público, rotar datos/credenciales, forense de accesos",
        "Dejarlo y monitorear likes",
        "Borrar sin backup legal",
        "Avisar solo por rumor"
      ],
      "answer": 0,
      "explain": "Data exposure class-1."
    },
    {
      "id": "clB2",
      "level": 5,
      "type": "mc",
      "q": "BOSS: Región cae. Tu app multi-AZ en UNA región…",
      "options": [
        "Sigue caída regional; necesitas estrategia multi-region/DR",
        "Sobrevive siempre",
        "Se convierte en SaaS sola",
        "Imprime sola"
      ],
      "answer": 0,
      "explain": "AZ ≠ región."
    },
    {
      "id": "clB3",
      "level": 5,
      "type": "order",
      "q": "BOSS: Compromiso de CI/CD cloud:",
      "items": [
        "Revocar secrets del pipeline",
        "Auditar deploys recientes",
        "Reconstruir desde fuentes firmadas",
        "Endurecer OIDC/roles"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explain": "Supply chain."
    },
    {
      "id": "clB4",
      "level": 5,
      "type": "tf",
      "q": "BOSS: El shared responsibility no te exime de cifrar y parchear tu OS en IaaS.",
      "answer": true,
      "explain": "En IaaS parcheas guest."
    },
    {
      "id": "clB5",
      "level": 5,
      "type": "fill",
      "q": "BOSS: Objetivo de pérdida de datos tolerable (sigla):",
      "answer": "RPO",
      "accept": "RPO|rpo",
      "explain": "Recovery Point Objective."
    }
  ]
});

  pushWorld({
  "id": "database",
  "name": "Base de datos básica",
  "icon": "🗄️",
  "color": "#c9a0ff",
  "description": "Tablas, SQL CRUD, claves, índices y backups.",
  "questions": [
    {
      "id": "db01",
      "level": 1,
      "type": "mc",
      "q": "Una tabla en una BD relacional es…",
      "options": [
        "Conjunto de filas (registros) y columnas (campos)",
        "Un cable de red",
        "Un tipo de CPU",
        "Un protocolo Wi‑Fi"
      ],
      "answer": 0,
      "explain": "Estructura tabular."
    },
    {
      "id": "db02",
      "level": 1,
      "type": "tf",
      "q": "SQL se usa para consultar y modificar datos en muchas BD relacionales.",
      "answer": true,
      "explain": "Structured Query Language."
    },
    {
      "id": "db03",
      "level": 1,
      "type": "mc",
      "q": "¿Qué hace SELECT nombre FROM empleados?",
      "options": [
        "Devuelve la columna nombre de la tabla empleados",
        "Borra la tabla",
        "Crea un índice",
        "Apaga el servidor"
      ],
      "answer": 0,
      "explain": "SELECT lee datos."
    },
    {
      "id": "db04",
      "level": 1,
      "type": "fill",
      "q": "Palabra SQL para insertar filas:",
      "answer": "INSERT",
      "accept": "INSERT|insert",
      "explain": "INSERT INTO ... VALUES ..."
    },
    {
      "id": "db05",
      "level": 1,
      "type": "identify",
      "q": "Clave primaria sirve para…",
      "options": [
        "Identificar de forma única cada fila",
        "Cifrar el disco",
        "Asignar VLANs",
        "Calibrar pantallas"
      ],
      "answer": 0,
      "explain": "PRIMARY KEY."
    },
    {
      "id": "db06",
      "level": 1,
      "type": "scenario",
      "q": "Quieres ver todos los productos. Consulta base:",
      "options": [
        "SELECT * FROM productos;",
        "DELETE FROM productos;",
        "DROP DATABASE;",
        "SHUTDOWN;"
      ],
      "answer": 0,
      "explain": "* trae todas las columnas; sé explícito en prod."
    },
    {
      "id": "db07",
      "level": 1,
      "type": "mc",
      "q": "NULL significa…",
      "options": [
        "Valor desconocido/ausente",
        "Cero siempre",
        "Cadena vacía siempre",
        "False siempre"
      ],
      "answer": 0,
      "explain": "NULL ≠ 0 ni \"\"."
    },
    {
      "id": "db08",
      "level": 1,
      "type": "tf",
      "q": "UPDATE modifica filas existentes; INSERT agrega nuevas.",
      "answer": true,
      "explain": "UPDATE ... SET ... WHERE ..."
    },
    {
      "id": "db09",
      "level": 2,
      "type": "mc",
      "q": "¿Para qué es el WHERE?",
      "options": [
        "Filtrar filas según condición",
        "Crear usuarios del OS",
        "Montar discos",
        "Configurar DNS"
      ],
      "answer": 0,
      "explain": "Sin WHERE, UPDATE/DELETE afectan todo."
    },
    {
      "id": "db10",
      "level": 2,
      "type": "tf",
      "q": "Una foreign key relaciona filas entre tablas.",
      "answer": true,
      "explain": "Integridad referencial."
    },
    {
      "id": "db11",
      "level": 2,
      "type": "scenario",
      "q": "DELETE FROM pedidos; sin WHERE en prod. Resultado probable:",
      "options": [
        "Borras todos los pedidos",
        "Nada",
        "Solo una fila random",
        "Crea backup automático garantizado"
      ],
      "answer": 0,
      "explain": "Usa transacciones y WHERE cuidadoso."
    },
    {
      "id": "db12",
      "level": 2,
      "type": "fill",
      "q": "Palabra SQL para borrar filas:",
      "answer": "DELETE",
      "accept": "DELETE|delete",
      "explain": "DELETE FROM t WHERE ..."
    },
    {
      "id": "db13",
      "level": 2,
      "type": "mc",
      "q": "JOIN se usa para…",
      "options": [
        "Combinar filas de tablas relacionadas",
        "Comprimir backups solo",
        "Asignar IPs",
        "Firmar drivers"
      ],
      "answer": 0,
      "explain": "INNER/LEFT/RIGHT etc."
    },
    {
      "id": "db14",
      "level": 2,
      "type": "match",
      "q": "Empareja:",
      "pairs": [
        {
          "left": "SELECT",
          "right": "Leer"
        },
        {
          "left": "INSERT",
          "right": "Crear filas"
        },
        {
          "left": "UPDATE",
          "right": "Modificar"
        },
        {
          "left": "DELETE",
          "right": "Borrar filas"
        }
      ],
      "explain": "CRUD SQL."
    },
    {
      "id": "db15",
      "level": 2,
      "type": "order",
      "q": "Ordena consulta segura de actualización:",
      "items": [
        "BEGIN/transacción",
        "SELECT de verificación",
        "UPDATE con WHERE",
        "COMMIT o ROLLBACK"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explain": "Verifica el conteo afectado."
    },
    {
      "id": "db16",
      "level": 2,
      "type": "tf",
      "q": "CREATE TABLE define la estructura de una nueva tabla.",
      "answer": true,
      "explain": "DDL vs DML."
    },
    {
      "id": "db17",
      "level": 3,
      "type": "mc",
      "q": "Un índice acelera…",
      "options": [
        "Búsquedas/filtros a costa de espacio y writes",
        "La velocidad del ventilador",
        "El Spooler",
        "El DHCP"
      ],
      "answer": 0,
      "explain": "Indexa columnas de filtros frecuentes."
    },
    {
      "id": "db18",
      "level": 3,
      "type": "scenario",
      "q": "Reporte lento en tabla de millones. Primera idea:",
      "options": [
        "EXPLAIN/analizar query + índices adecuados",
        "Poner SELECT * en loop",
        "Desactivar la PK",
        "Apagar backups"
      ],
      "answer": 0,
      "explain": "Mide el plan de ejecución."
    },
    {
      "id": "db19",
      "level": 3,
      "type": "fill",
      "q": "Sigla de lenguaje de consulta estructurado:",
      "answer": "SQL",
      "accept": "SQL|sql",
      "explain": "Structured Query Language."
    },
    {
      "id": "db20",
      "level": 3,
      "type": "mc",
      "q": "Normalización busca…",
      "options": [
        "Reducir redundancia y anomalías de datos",
        "Maximizar duplicados",
        "Eliminar claves",
        "Prohibir JOINs"
      ],
      "answer": 0,
      "explain": "1NF/2NF/3NF como guía."
    },
    {
      "id": "db21",
      "level": 3,
      "type": "match",
      "q": "Empareja:",
      "pairs": [
        {
          "left": "OLTP",
          "right": "Transacciones operativas"
        },
        {
          "left": "OLAP",
          "right": "Analítica/agregaciones"
        },
        {
          "left": "ACID",
          "right": "Propiedades de transacciones"
        },
        {
          "left": "ORM",
          "right": "Mapeo objeto-relacional"
        }
      ],
      "explain": "Conceptos."
    },
    {
      "id": "db22",
      "level": 3,
      "type": "order",
      "q": "Ordena backup lógico básico:",
      "items": [
        "pg_dump/mysqldump o equivalente",
        "Copiar archivo a offsite",
        "Probar restore en lab",
        "Documentar RPO"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explain": "Backup ≠ archivo copiado sin prueba."
    },
    {
      "id": "db23",
      "level": 3,
      "type": "tf",
      "q": "Una transacción ACID o todo se confirma o se revierte.",
      "answer": true,
      "explain": "Atomicity Consistency Isolation Durability."
    },
    {
      "id": "db24",
      "level": 3,
      "type": "scenario",
      "q": "App muestra datos viejos tras UPDATE. Sospecha:",
      "options": [
        "Caché de app/CDN o isolation/replica lag",
        "Que SQL no existe",
        "Que el cable HDMI guarda filas",
        "Que STP borra tablas"
      ],
      "answer": 0,
      "explain": "Revisa caché y réplicas de lectura."
    },
    {
      "id": "db25",
      "level": 4,
      "type": "mc",
      "q": "EXPLAIN (o similar) muestra…",
      "options": [
        "Cómo el motor planea ejecutar la consulta",
        "El clima",
        "La cola de impresión",
        "El voltaje de la PSU"
      ],
      "answer": 0,
      "explain": "Herramienta #1 de performance."
    },
    {
      "id": "db26",
      "level": 4,
      "type": "tf",
      "q": "Una réplica de lectura puede servir consultas SELECT para aliviar el primario.",
      "answer": true,
      "explain": "Ojo con lag y escrituras."
    },
    {
      "id": "db27",
      "level": 4,
      "type": "scenario",
      "q": "Migración con downtime mínimo. Técnica común:",
      "options": [
        "Expand/contract, dual-write o logical replication según motor",
        "DROP DATABASE en horario pico",
        "Editar data files a mano",
        "Desactivar WAL/redo siempre"
      ],
      "answer": 0,
      "explain": "Planifica rollback."
    },
    {
      "id": "db28",
      "level": 4,
      "type": "fill",
      "q": "Comando SQL para quitar una tabla entera (peligroso):",
      "answer": "DROP TABLE",
      "accept": "DROP TABLE|drop table",
      "explain": "DDL destructivo; no es DELETE."
    },
    {
      "id": "db29",
      "level": 4,
      "type": "mc",
      "q": "Isolation level más estricto típico…",
      "options": [
        "Serializable (idea) vs read committed más común",
        "Read uncommitted siempre mejor en bancos",
        "No existe isolation",
        "Solo aplica a impresoras"
      ],
      "answer": 0,
      "explain": "Trade-off consistencia vs concurrencia."
    },
    {
      "id": "db30",
      "level": 4,
      "type": "match",
      "q": "Empareja:",
      "pairs": [
        {
          "left": "VACUUM (PG idea)",
          "right": "Mantenimiento/limpieza"
        },
        {
          "left": "ANALYZE",
          "right": "Actualizar estadísticas"
        },
        {
          "left": "CHECKPOINT",
          "right": "Flush a disco durable"
        },
        {
          "left": "Connection pool",
          "right": "Reutilizar conexiones"
        }
      ],
      "explain": "Ops DB."
    },
    {
      "id": "db31",
      "level": 4,
      "type": "order",
      "q": "Ordena incident \"DB CPU 100%\":",
      "items": [
        "Identificar queries top",
        "Matar/limitar monstruo si seguro",
        "Añadir índice/fix query",
        "Postmortem y límites"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explain": "No reinicies a ciegas primero."
    },
    {
      "id": "db32",
      "level": 4,
      "type": "tf",
      "q": "Prepared statements ayudan contra SQL injection y pueden reutilizar planes.",
      "answer": true,
      "explain": "Parametriza siempre."
    },
    {
      "id": "db33",
      "level": 5,
      "type": "mc",
      "q": "Point-in-time recovery (PITR) permite…",
      "options": [
        "Restaurar a un instante usando base + WAL/binlog",
        "Solo el último full semanal sin logs",
        "Recuperar sin backups",
        "Imprimir el WAL"
      ],
      "answer": 0,
      "explain": "Requiere archiving de logs."
    },
    {
      "id": "db34",
      "level": 5,
      "type": "scenario",
      "q": "Split-brain en cluster activo-activo mal configurado. Riesgo:",
      "options": [
        "Datos divergentes / corrupción lógica",
        "Mejor integridad siempre",
        "Backups mágicos",
        "Más FPS"
      ],
      "answer": 0,
      "explain": "Quorum y fencing."
    },
    {
      "id": "db35",
      "level": 5,
      "type": "fill",
      "q": "Sigla de las propiedades clásicas de transacciones:",
      "answer": "ACID",
      "accept": "ACID|acid",
      "explain": "Atomicity Consistency Isolation Durability."
    },
    {
      "id": "db36",
      "level": 5,
      "type": "mc",
      "q": "Un covering index es…",
      "options": [
        "Índice que puede satisfacer la query sin tocar la tabla heap",
        "Un cable cover",
        "Un antivirus",
        "Una GPO"
      ],
      "answer": 0,
      "explain": "Incluye todas las columnas necesarias."
    },
    {
      "id": "db37",
      "level": 5,
      "type": "identify",
      "q": "Amenaza si concatenas input en SQL:",
      "options": [
        "SQL injection",
        "VLAN hopping solo",
        "Thermal paste dry",
        "USB-C PD"
      ],
      "answer": 0,
      "explain": "Usa parámetros."
    },
    {
      "id": "db38",
      "level": 5,
      "type": "order",
      "q": "Ordena promote de réplica tras falla primaria:",
      "items": [
        "Confirmar primaria caída",
        "Promote réplica",
        "Reapuntar apps/DNS",
        "Reconstruir nueva réplica"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explain": "Evita dos primarias."
    },
    {
      "id": "db39",
      "level": 5,
      "type": "tf",
      "q": "Autovacuum mal tunado en PostgreSQL puede dejar bloat y performance pobre.",
      "answer": true,
      "explain": "Monitorea dead tuples y edad de XID."
    },
    {
      "id": "db40",
      "level": 5,
      "type": "scenario",
      "q": "Compliance pide cifrado de datos sensibles. Controles:",
      "options": [
        "TDE/cifrado en reposo + TLS en tránsito + masking",
        "Solo ocultar la columna en la UI",
        "Poner la BD en VLAN guest",
        "Desactivar audits"
      ],
      "answer": 0,
      "explain": "Defensa en profundidad."
    }
  ],
  "boss": [
    {
      "id": "dbB1",
      "level": 5,
      "type": "scenario",
      "q": "BOSS: DROP TABLE en prod por script. Contención:",
      "options": [
        "Stop writes, evaluar PITR/backup, comunicar, postmortem",
        "Correr más DROPs",
        "Culpar sin logs",
        "Apagar el SAN sin plan"
      ],
      "answer": 0,
      "explain": "PITR salva carreras."
    },
    {
      "id": "dbB2",
      "level": 5,
      "type": "mc",
      "q": "BOSS: Replication lag de horas. Efecto:",
      "options": [
        "Lecturas stale; riesgo si failover precipitado",
        "Integridad perfecta",
        "DNS más rápido",
        "Mejor PCL"
      ],
      "answer": 0,
      "explain": "Monitorea lag SLIs."
    },
    {
      "id": "dbB3",
      "level": 5,
      "type": "order",
      "q": "BOSS: Sospecha de inyección SQL activa:",
      "items": [
        "WAF/bloqueos + logs",
        "Parchear código parametrizado",
        "Auditar datos tocados",
        "Rotar secretos DB"
      ],
      "answer": [
        0,
        1,
        2,
        3
      ],
      "explain": "App + datos."
    },
    {
      "id": "dbB4",
      "level": 5,
      "type": "tf",
      "q": "BOSS: Un full backup sin probar restore no garantiza recuperación.",
      "answer": true,
      "explain": "Ensayos periódicos."
    },
    {
      "id": "dbB5",
      "level": 5,
      "type": "fill",
      "q": "BOSS: Cláusula SQL para filtrar filas (palabra):",
      "answer": "WHERE",
      "accept": "WHERE|where",
      "explain": "UPDATE/DELETE peligrosos sin WHERE."
    }
  ]
});

  // Bosses de mundos existentes: marcar nivel maestro
  WORLDS.forEach((w) => {
    if (w.boss) w.boss.forEach((q) => { if (q.level == null || q.level < 4) q.level = 5; });
  });

  // Helpers (sobrescribe con soporte 1..maxL)
  window.getQuestionsForLevel = function (worldId, level) {
    const w = getWorldById(worldId);
    if (!w) return [];
    return w.questions.filter((q) => (q.level || 1) === level);
  };
  window.countLevelsForWorld = function (worldId) {
    const w = getWorldById(worldId);
    const c = {};
    for (let i = 1; i <= maxL; i++) c[i] = 0;
    if (!w) return c;
    w.questions.forEach((q) => { const L = q.level || 1; c[L] = (c[L] || 0) + 1; });
    return c;
  };
})();
