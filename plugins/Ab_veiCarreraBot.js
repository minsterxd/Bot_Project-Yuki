let handler = async (m, { conn, args }) => {
    const emoji = '🤖';
    const user = global.db.data.users[m.sender];
    if (!user) return conn.reply(m.chat, `${emoji} No se encontró tu usuario.`, m);

    const nivel = parseInt(args[0]);
    if (![1, 2, 3].includes(nivel))
        return conn.reply(m.chat, `Uso: *#carrerabot <nivel>*\n\n*Niveles disponibles:*\n1 - Fácil\n2 - Medio\n3 - Difícil`, m);

    const dificultad = {
        1: { userProb: 0.75, botProb: 0.75, recompensa: 100, costo: 10 },
        2: { userProb: 0.70, botProb: 0.80, recompensa: 200, costo: 15 },
        3: { userProb: 0.60, botProb: 0.90, recompensa: 400, costo: 20 }
    }[nivel];

    // Ver autos disponibles con suficientes usos
    const autosDisponibles = ['mclaren720s', 'ferrari488pista', 'lamboavesvj'].filter(k => (user[k] || 0) >= dificultad.costo);
    if (!autosDisponibles.length)
        return conn.reply(m.chat, `🚫 No tienes autos con al menos *${dificultad.costo} usos* para este nivel de dificultad.`, m);

    // Elegir auto
    const seleccion = await pedirSeleccion(conn, m.chat, m.sender, autosDisponibles);
    if (!seleccion)
        return conn.reply(m.chat, `⏱️ Tiempo agotado. Carrera cancelada.`, m);

    // Descontar usos
    user[seleccion] -= dificultad.costo;

    // Inicializar carrera
    let progress = {
        player: 0,
        bot: 0
    };

    let msg = await conn.sendMessage(m.chat, {
        text: `🚦 ¡Carrera contra el bot (Nivel ${nivel}) iniciada!\n\nTú: [----------] 0%\nBot 🤖: [----------] 0%`
    });

    let interval = setInterval(async () => {
        if (Math.random() < dificultad.userProb && progress.player < 10) progress.player++;
        if (Math.random() < dificultad.botProb && progress.bot < 10) progress.bot++;

        let bar1 = `[${'='.repeat(progress.player)}${'-'.repeat(10 - progress.player)}] ${progress.player * 10}%`;
        let bar2 = `[${'='.repeat(progress.bot)}${'-'.repeat(10 - progress.bot)}] ${progress.bot * 10}%`;

        await conn.sendMessage(m.chat, {
            edit: msg.key,
            text: `🏁 Carrera (Nivel ${nivel}) en progreso...\n\nTú: ${bar1}\nBot 🤖: ${bar2}`
        });

        if (progress.player >= 10 || progress.bot >= 10) {
            clearInterval(interval);

            const ganaste = progress.player >= 10;

            if (ganaste) {
                user.coin += dificultad.recompensa;
                await conn.sendMessage(m.chat, {
                    text: `🏆 ¡Ganaste contra el bot en nivel ${nivel} con tu *${seleccion}*! +${dificultad.recompensa} monedas 💰`
                });
            } else {
                await conn.sendMessage(m.chat, {
                    text: `💨 El bot te ganó esta vez en nivel ${nivel}... ¡Inténtalo de nuevo! 😢`
                });
            }
        }
    }, 1000);
};

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
