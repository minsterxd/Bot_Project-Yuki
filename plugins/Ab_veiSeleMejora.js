let mejoraHandler = async (m, { conn, command }) => {
    const user = global.db.data.users[m.sender];
    const auto = global.tempMejoras?.[m.sender];

    if (!auto) return conn.reply(m.chat, `❌ No has seleccionado un auto con *#mejoras* aún.`, m);

    const mejoras = {
        motor: { key: 'Motor', max: 10, precio: 500 },
        agarre: { key: 'Agarre', max: 10, precio: 500 },
        turbo: { key: 'Turbo', max: 10, precio: 250 },
        nitro: { key: 'Nitro', max: 5, precio: 1000 }
    };

    const mejora = mejoras[command];
    const clave = auto + mejora.key;
    const nivelActual = user[clave] || 0;

    if (nivelActual >= mejora.max)
        return conn.reply(m.chat, `✅ Tu *${mejora.key}* ya está al nivel máximo (${mejora.max}).`, m);

    if (user.coin < mejora.precio)
        return conn.reply(m.chat, `💸 No tienes suficientes Yenes. Necesitas ${mejora.precio}.`, m);

    user.coin -= mejora.precio;
    user[clave] = nivelActual + 1;

    conn.reply(m.chat, `🔧 Has mejorado *${mejora.key}* de tu *${auto}* a nivel ${user[clave]}.\n✨ Mejora aplicada con éxito.`, m);
};

mejoraHandler.help = ['motor', 'agarre', 'turbo', 'nitro'];
mejoraHandler.tags = ['autos', 'mejoras'];
mejoraHandler.command = ['motor', 'agarre', 'turbo', 'nitro'];
mejoraHandler.group = true;

export default mejoraHandler;
