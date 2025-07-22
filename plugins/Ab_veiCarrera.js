global.seleccionDeAuto = global.seleccionDeAuto || {}; // Estructura global

let handler = async (m, { conn }) => {
    const emoji = '🏁';
    const target = m.mentionedJid?.[0];
    if (!target) return conn.reply(m.chat, `${emoji} Mencioná a quién deseas desafiar con *#carrera @usuario*`, m);

    const u1 = global.db.data.users[m.sender];
    const u2 = global.db.data.users[target];
    if (!u1 || !u2) return conn.reply(m.chat, `${emoji} Ambos usuarios deben existir en la base de datos.`, m);

    const disponibles = (u) => ['mclaren720s', 'ferrari488pista', 'lamboavesvj'].filter(k => (u[k] || 0) >= 10);
    const d1 = disponibles(u1), d2 = disponibles(u2);
    if (!d1.length || !d2.length) return conn.reply(m.chat, `🚫 Ambos corredores necesitan al menos 1 auto con 10 usos.`, m);

    let auto1 = await pedirSeleccion(conn, m.chat, m.sender, d1);
    if (!auto1) return conn.reply(m.chat, `⏱️ Tiempo agotado para el primer corredor. Carrera cancelada.`, m);

    let auto2 = await pedirSeleccion(conn, m.chat, target, d2);
    if (!auto2) return conn.reply(m.chat, `⏱️ Tiempo agotado para el segundo corredor. Carrera cancelada.`, m);

    // Restar 10 usos
    u1[auto1] -= 10;
    u2[auto2] -= 10;

    // Obtener mejoras para ambos jugadores
    const stats = (user, auto) => ({
        motor: user[`${auto}Motor`] || 0,
        agarre: user[`${auto}Agarre`] || 0,
        turbo: user[`${auto}Turbo`] || 0,
        nitro: user[`${auto}Nitro`] || 0,
    });

    const stats1 = stats(u1, auto1);
    const stats2 = stats(u2, auto2);

    // Bonos constantes
    const bonoConstante = ({ motor, agarre, turbo }) =>
        (motor * 0.01) + (agarre * 0.01) + (turbo * 0.005);

    const nitroBonus = (nitro) => nitro * 0.02;

    const progreso = {
        [m.sender]: 0,
        [target]: 0,
    };

    let nitro = {
        [m.sender]: { activo: false, turnos: 0 },
        [target]: { activo: false, turnos: 0 }
    };

    let msg = await conn.sendMessage(m.chat, {
        text: `🚦 ¡Carrera comenzando!\n\n@${m.sender.split('@')[0]}: [----------] 0%\n@${target.split('@')[0]}: [----------] 0%`,
        mentions: [m.sender, target]
    });

    let interval = setInterval(async () => {
        for (let jugador of [m.sender, target]) {
            const usuario = jugador === m.sender ? u1 : u2;
            const auto = jugador === m.sender ? auto1 : auto2;
            const datos = jugador === m.sender ? stats1 : stats2;
            const baseProb = 0.75;
            let prob = baseProb + bonoConstante(datos);

            // Activar nitro si cruzó 50% y aún no fue activado
            if (progreso[jugador] >= 5 && !nitro[jugador].activo && datos.nitro > 0) {
                nitro[jugador].activo = true;
                nitro[jugador].turnos = 3;
            }

            // Aplicar nitro si está activo
            if (nitro[jugador].activo && nitro[jugador].turnos > 0) {
                prob += nitroBonus(datos.nitro);
                nitro[jugador].turnos--;
            }

            prob = Math.min(prob, 1);

            if (Math.random() < prob && progreso[jugador] < 10) progreso[jugador]++;
        }

        // Mostrar progreso
        let bar1 = `[${'='.repeat(progreso[m.sender])}${'-'.repeat(10 - progreso[m.sender])}] ${progreso[m.sender] * 10}%`;
        let bar2 = `[${'='.repeat(progreso[target])}${'-'.repeat(10 - progreso[target])}] ${progreso[target] * 10}%`;

        await conn.sendMessage(m.chat, {
            edit: msg.key,
            text: `🏁 Carrera en progreso...\n\n@${m.sender.split('@')[0]}: ${bar1}\n@${target.split('@')[0]}: ${bar2}`,
            mentions: [m.sender, target]
        });

        // Fin de carrera
        if (progreso[m.sender] >= 10 || progreso[target] >= 10) {
    clearInterval(interval);

    let empate = false;
    let ganador;

    if (progreso[m.sender] >= 10 && progreso[target] >= 10) {
        // Empate: ganador aleatorio
        empate = true;
        ganador = Math.random() < 0.5 ? m.sender : target;
    } else {
        ganador = progreso[m.sender] >= 10 ? m.sender : target;
    }

    const perdedor = ganador === m.sender ? target : m.sender;
    const autoGanador = ganador === m.sender ? auto1 : auto2;

    global.db.data.users[ganador].coin += 100;
    global.db.data.users[perdedor].coin = Math.max(0, global.db.data.users[perdedor].coin - 50);

    let textoFinal = `🏆 ¡@${ganador.split('@')[0]} gana la carrera con su *${autoGanador}*!`;
    if (empate) textoFinal += `\n🟰 *Empate detectado*: el ganador fue elegido al azar.`;

    await conn.sendMessage(m.chat, {
        text: textoFinal,
        mentions: [ganador]
    });
        }
    }, 1000);
};

// Función para selección de auto
async function pedirSeleccion(conn, chatId, userId, opciones) {
    return new Promise(async (resolve) => {
        let textoOpciones = opciones.map(o => `#${o}`).join('\n');
        await conn.sendMessage(chatId, {
            text: `🚘 @${userId.split('@')[0]}, elige tu vehículo usando uno de estos comandos:\n\n${textoOpciones}`,
            mentions: [userId]
        });

        global.seleccionDeAuto[userId] = {
            opciones,
            resolve,
            timeout: setTimeout(() => {
                delete global.seleccionDeAuto[userId];
                resolve(null);
            }, 30000)
        };
    });
}

handler.help = ['carrera @usuario'];
handler.tags = ['autos', 'juegos'];
handler.command = ['carrera'];
handler.group = true;
handler.register = true;

export default handler;
