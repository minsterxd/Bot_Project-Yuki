let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const autos = ['mclaren720s', 'ferrari488pista', 'lamboavesvj'];
    const autosDisponibles = autos.filter(a => user[a] && user[a] > 0);

    if (!autosDisponibles.length) return m.reply('🚫 No tienes autos para vender.');

    await conn.sendMessage(m.chat, {
        text: `🚘 @${m.sender.split('@')[0]}, elige el auto que deseas vender usando uno de estos comandos:\n\n${autosDisponibles.map(a => `#${a}`).join('\n')}`,
        mentions: [m.sender]
    });

    global.seleccionDeAuto = global.seleccionDeAuto || {};
    global.seleccionDeAuto[m.sender] = {
        opciones: autosDisponibles,
        resolve: async (auto) => {
            const usos = user[auto];
            const porcentaje = (usos / 100000) * 100;
            const precio = Math.round(porcentaje * 190);

            global.ventaPendiente = global.ventaPendiente || {};
            global.ventaPendiente[m.sender] = {
                auto,
                precio,
                timeout: setTimeout(() => {
                    delete global.ventaPendiente[m.sender];
                    m.reply('⏱️ Tiempo agotado. Venta cancelada.');
                }, 30000)
            };

            await conn.sendMessage(m.chat, {
                text: `💰 Tu *${auto}* tiene *${usos} usos restantes*.\n🧮 Valor de venta: *${precio} monedas*.\n\nUsa *#aceptarventa* para confirmar.`,
                mentions: [m.sender]
            });
        },
        timeout: setTimeout(() => {
            delete global.seleccionDeAuto[m.sender];
            m.reply('⏱️ Tiempo agotado. Selección cancelada.');
        }, 30000)
    };
};

handler.help = ['venderautos'];
handler.tags = ['autos', 'economía'];
handler.command = ['venderautos'];
handler.group = true;
handler.register = true;

export default handler;
