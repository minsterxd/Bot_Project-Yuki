let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    if (!user) return conn.reply(m.chat, '🚫 Usuario no encontrado.', m);

    const todosAutos = {
        mclaren720s: { nombre: 'McLaren 720s', color: 'Naranja', precio: 20000 },
        ferrari488pista: { nombre: 'Ferrari 488 Pista', color: 'Rojo', precio: 20000 },
        lamboavesvj: { nombre: 'Lamborghini Aventador SVG', color: 'Verde', precio: 10000 },
    };

    const disponibles = Object.entries(todosAutos)
        .filter(([clave]) => !user[clave])
        .map(([clave, data]) => ({
            id: clave,
            ...data
        }));

    if (disponibles.length === 0) {
        return conn.reply(m.chat, `✔️ Ya tienes todos los superdeportivos disponibles.\nSi lo deseas, puedes vender alguno con *#venderautos*.`, m);
    }

    let lista = disponibles.map(auto =>
        `ᰔᩚ *${auto.nombre} - #${auto.id}*\n> ✦ (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧.\n> ✦ Precio: ${auto.precio} Yenes\n> ✦ Color: ${auto.color}`
    ).join('\n');

    await conn.sendMessage(m.chat, {
        text: `Hola! Soy *ᥡᥙkі sᥙ᥆ᥙ* (｡•̀ᴗ-)✧\nVeo que quieres comprar tu primer superdeportivo, eh? \nAqui tienes la lista! (⁠◠⁠‿⁠・⁠)⁠—⁠☆\n╭┈ ↷\n│ᰔ Cliente » @${m.sender.split('@')[0]}\n│❀ Superdeportivos disponibles: ${disponibles.length} \n╰─────────────────\n\n❍ Comprar los superdeportivos:\n${lista}\n\nᰔ Responde a este mensaje con el comando del auto que deseas para comprarlo.`,
        mentions: [m.sender]
    });

    global.seleccionDeAuto = global.seleccionDeAuto || {};
    global.seleccionDeAuto[m.sender] = {
        opciones: disponibles.map(a => a.id),
        resolve: async (seleccion) => {
            const auto = todosAutos[seleccion];
            if (user.coin < auto.precio) {
                return conn.reply(m.chat, `💸 No tienes suficientes Yenes para comprar el *${auto.nombre}*.`, m);
            }

            user.coin -= auto.precio;
            user[seleccion] = 100000;

            await conn.reply(m.chat, `✅ ¡Felicidades! Has comprado un *${auto.nombre}* color *${auto.color}* con *100000* usos. ¡Conduce con estilo! 🚗`, m);
        },
        timeout: setTimeout(() => {
            delete global.seleccionDeAuto[m.sender];
            conn.reply(m.chat, '⏱️ Tiempo agotado. Compra cancelada.', m);
        }, 30000)
    };
};

handler.help = ['comprarautos'];
handler.tags = ['autos'];
handler.command = ['comprarautos'];
handler.group = true;
handler.register = true;

export default handler;
