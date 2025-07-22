let handler = async (m, { conn, args }) => {
    const emoji = '🤖';
    const user = global.db.data.users[m.sender];
    if (!user) return conn.reply(m.chat, `${emoji} No se encontró tu usuario.`, m);

    const nivel = parseInt(args[0]);
    if (![1, 2, 3].includes(nivel))
        return conn.reply(m.chat, `Uso: *#carrerabot <nivel>*\n\n*Niveles disponibles:*\n1 - Fácil\n2 - Medio\n3 - Difícil`, m);

    const dificultad = {
        1: { userProb: 0.75, botProb: 0.75, recompensa: 100, costo: 10, penalizacion: 50 },
        2: { userProb: 0.70, botProb: 0.80, recompensa: 200, costo: 15, penalizacion: 100 },
        3: { userProb: 0.60, botProb: 0.90, recompensa: 500, costo: 20, penalizacion: 250 }
    }[nivel];

    // Autos con usos suficientes
    const autosDisponibles = ['mclaren720s', 'ferrari488pista', 'lamboavesvj'].filter(k => (user[k] || 0) >= dificultad.costo);
    if (!autosDisponibles.length)
        return conn.reply(m.chat, `🚫 No tienes autos con al menos *${dificultad.costo} usos* para este nivel de dificultad.`, m);

    const seleccion = await pedirSeleccion(conn, m.chat, m.sender, autosDisponibles);
    if (!seleccion)
        return conn.reply(m.chat, `⏱️ Tiempo agotado. Carrera cancelada.`, m);

    // Descontar usos del auto
    user[seleccion] -= dificultad.costo;

    // Obtener mejoras aplicables
    const motor = user[`${seleccion}Motor`] || 0;
    const agarre = user[`${seleccion}Agarre`] || 0;
    const turbo = user[`${seleccion}Turbo`] || 0;
    const nitro = user[`${seleccion}Nitro`] || 0;

    const bonusConstante = (motor * 0.01) + (agarre * 0.01) + (turbo * 0.005);
    const nitroBonus = nitro * 0.02; 

    let progress = {
        player: 0,
        bot: 0
    };

    let turnosDesdeMitad = 0;
    let nitroActivo = false;

    let msg = await conn.sendMessage(m.chat, {
        text: `🚦 ¡Carrera contra el bot (Nivel ${nivel}) iniciada!\n\nTú: [----------] 0%\nBot 🤖: [----------] 0%`
    });

    let turnos = 0;
    let interval = setInterval(async () => {
        turnos++;

        // Activar Nitro desde la mitad (turno >= 6)
        if (progress.player >= 5 && !nitroActivo) {
            nitroActivo = true;
            turnosDesdeMitad = 3;
        }

        // Probabilidad total para el jugador
        let probJugador = dificultad.userProb + bonusConstante;
        if (nitroActivo && turnosDesdeMitad > 0) {
            probJugador += nitroBonus;
            turnosDesdeMitad--;
        }

        // Limitar a 1.0 (100%)
        probJugador = Math.min(probJugador, 1);

        // Avances
        if (Math.random() < probJugador && progress.player < 10) progress.player++;
        if (Math.random() < dificultad.botProb && progress.bot < 10) progress.bot++;

        // Barras
        let bar1 = `[${'='.repeat(progress.player)}${'-'.repeat(10 - progress.player)}] ${progress.player * 10}%`;
        let bar2 = `[${'='.repeat(progress.bot)}${'-'.repeat(10 - progress.bot)}] ${progress.bot * 10}%`;

        // Editar mensaje
        await conn.sendMessage(m.chat, {
            edit: msg.key,
            text: `🏁 Carrera (Nivel ${nivel}) en progreso...\n\nTú: ${bar1}\nBot 🤖: ${bar2}`
        });

        // Fin
        if (progress.player >= 10 || progress.bot >= 10) {
            clearInterval(interval);
            const ganaste = progress.player >= 10;

            if (ganaste) {
                user.coin += dificultad.recompensa;
                await conn.sendMessage(m.chat, {
                    text: `🏆 ¡Ganaste contra el bot en nivel ${nivel} con tu *${seleccion}*! +${dificultad.recompensa} monedas 💰`
                });
            } else {
                user.coin = Math.max(0, user.coin - dificultad.penalizacion);
                await conn.sendMessage(m.chat, {
                    text: `💨 El bot te ganó en nivel ${nivel}... Perdiste ${dificultad.penalizacion} monedas 😢`
                });
            }
        }
    }, 1000);
};

// Sistema de selección de auto (como ya usás)
async function pedirSeleccion(conn, chatId, userId, opciones) {
    return new Promise(async (resolve) => {
        let textoOpciones = opciones.map(o => `#${o}`).join('\n');
        await conn.sendMessage(chatId, {
            text: `🚘 @${userId.split('@')[0]}, elige tu vehículo para correr contra el bot con uno de estos comandos:\n\n${textoOpciones}`,
            mentions: [userId]
        });

        global.seleccionDeAuto = global.seleccionDeAuto || {};
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

handler.help = ['carrerabot <nivel>'];
handler.tags = ['autos', 'juegos'];
handler.command = ['carrerabot'];
handler.group = true;
handler.register = true;

export default handler;
