import { promises as fs } from 'fs';

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

    // Pedir auto al primer jugador
    let auto1 = await pedirSeleccion(conn, m.chat, m.sender, d1);
    if (!auto1) return conn.reply(m.chat, `⏱️ Tiempo agotado para el primer corredor. Carrera cancelada.`, m);

    // Pedir auto al segundo jugador
    let auto2 = await pedirSeleccion(conn, m.chat, target, d2);
    if (!auto2) return conn.reply(m.chat, `⏱️ Tiempo agotado para el segundo corredor. Carrera cancelada.`, m);

    // Restar 10 usos
    u1[auto1] -= 10;
    u2[auto2] -= 10;

    // Carrera
    let progress = {
        [m.sender]: 0,
        [target]: 0
    };

    let msg = await conn.sendMessage(m.chat, {
        text: `🚦 ¡Carrera comenzando!\n\n@${m.sender.split('@')[0]}: [----------] 0%\n@${target.split('@')[0]}: [----------] 0%`,
        mentions: [m.sender, target]
    });

    let interval = setInterval(async () => {
        if (Math.random() < 0.75 && progress[m.sender] < 10) progress[m.sender]++;
        if (Math.random() < 0.75 && progress[target] < 10) progress[target]++;

        let bar1 = `[${'='.repeat(progress[m.sender])}${'-'.repeat(10 - progress[m.sender])}] ${progress[m.sender] * 10}%`;
        let bar2 = `[${'='.repeat(progress[target])}${'-'.repeat(10 - progress[target])}] ${progress[target] * 10}%`;

        let texto = `🏁 Carrera en progreso...\n\n@${m.sender.split('@')[0]}: ${bar1}\n@${target.split('@')[0]}: ${bar2}`;

        await conn.sendMessage(m.chat, {
            edit: msg.key,
            text: texto,
            mentions: [m.sender, target]
        });

        if (progress[m.sender] >= 10 || progress[target] >= 10) {
            clearInterval(interval);

            let winner = progress[m.sender] >= 10 ? m.sender : target;
            let loser = winner === m.sender ? target : m.sender;

            global.db.data.users[winner].coin += 100;
            global.db.data.users[loser].coin -= 50;

            await conn.sendMessage(m.chat, {
                text: `🏆 ¡@${winner.split('@')[0]} gana la carrera con su *${winner === m.sender ? auto1 : auto2}*!`,
                mentions: [winner]
            });
        }
    }, 1000);
};

// Nueva función para pedir selección usando comandos separados
async function pedirSeleccion(conn, chatId, userId, opciones) {
    return new Promise(async (resolve) => {
        await conn.sendMessage(chatId, {
            text: `🚘 @${userId.split('@')[0]}, elige tu vehículo tocando uno de los botones:`,
            mentions: [userId],
            buttons: opciones.map(nombre => ({
                buttonId: `#${nombre}`,
                buttonText: { displayText: `🚗 ${nombre}` },
                type: 1
            })),
            headerType: 1
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
