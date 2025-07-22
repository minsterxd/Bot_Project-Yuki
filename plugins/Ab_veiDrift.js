import { promises as fs } from 'fs';

let handler = async (m, { conn, args }) => {
    const user = global.db.data.users[m.sender];
    if (!user) return conn.reply(m.chat, '🚫 Usuario no encontrado.', m);

    const autosDisponibles = {
        mclaren720s: { nombre: 'McLaren 720s', img: './src/autos/super/McLaren720s_Drift.jpg' },
        ferrari488pista: { nombre: 'Ferrari 488 Pista', img: './src/autos/super/Ferrari488Pista_Drift.jpg' },
        lamboavesvj: { nombre: 'Lamborghini Aventador SVG', img: './src/autos/super/LamboAveSVJ_Drift.jpg' },
    };

    const autosConUsos = Object.entries(autosDisponibles)
        .filter(([k]) => user[k] && user[k] > 0)
        .map(([k, v]) => ({ id: k, ...v }));

    if (!autosConUsos.length) {
        return conn.reply(m.chat, '🚗 No tienes ningún auto con usos disponibles para hacer *Drifting*.', m);
    }

    // Si el usuario pasó directamente el nombre del auto: #drift mclaren720s
    if (args[0]) {
        const seleccion = args[0].toLowerCase();
        if (!autosDisponibles[seleccion] || !user[seleccion] || user[seleccion] <= 0) {
            return conn.reply(m.chat, `🚫 No puedes usar ese auto. Asegúrate de tenerlo y que tenga usos disponibles.`, m);
        }

        user[seleccion]--;
        const nombreAuto = autosDisponibles[seleccion].nombre;
        const imagen = await fs.readFile(autosDisponibles[seleccion].img);

        return await conn.sendMessage(m.chat, {
            image: imagen,
            caption: `💨 @${m.sender.split('@')[0]} está haciendo *Drifting* con su *${nombreAuto}*! 🚗💥`,
            mentions: [m.sender]
        });
    }

    // Modo interactivo si no se especifica auto
    let autoTexto = autosConUsos.map(a => `• *${a.nombre}* → #${a.id}`).join('\n');
    await conn.reply(m.chat,
        `🔥 ¡Hora de derrapar!\n\n@${m.sender.split('@')[0]}, selecciona el auto con el que quieres hacer *Drift*:\n\n${autoTexto}`,
        m, { mentions: [m.sender] });

    global.seleccionDeAuto = global.seleccionDeAuto || {};
    global.seleccionDeAuto[m.sender] = {
        opciones: autosConUsos.map(a => a.id),
        resolve: async (seleccion) => {
            user[seleccion]--;

            const nombreAuto = autosDisponibles[seleccion].nombre;
            const imagen = await fs.readFile(autosDisponibles[seleccion].img);

            await conn.sendMessage(m.chat, {
                image: imagen,
                caption: `💨 @${m.sender.split('@')[0]} está haciendo *Drifting* con su *${nombreAuto}*! 🚗💥`,
                mentions: [m.sender]
            });
        },
        timeout: setTimeout(() => {
            delete global.seleccionDeAuto[m.sender];
            conn.reply(m.chat, '⏱️ Tiempo agotado. Drift cancelado.', m);
        }, 30000)
    };
};

handler.help = ['drift'];
handler.tags = ['autos'];
handler.command = ['drift'];
handler.group = true;
handler.register = true;

export default handler;
