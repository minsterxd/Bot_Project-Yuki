let handler = async (m, { conn, args }) => {
    const user = global.db.data.users[m.sender];
    if (!user) return conn.reply(m.chat, `🚫 No estás registrado en el sistema.`, m);

    const autos = ['mclaren720s', 'ferrari488pista', 'lamboavesvj'];
    const mejorasValidas = {
        motor: {
            key: 'Motor',
            max: 10,
            precio: 500,
            efecto: '0.5% por mejora (total 5%) en cada parte de la carrera.'
        },
        agarre: {
            key: 'Agarre',
            max: 10,
            precio: 500,
            efecto: '0.5% por mejora (total 5%) en cada parte de la carrera.'
        },
        turbo: {
            key: 'Turbo',
            max: 10,
            precio: 250,
            efecto: '0.25% por mejora (total 2.5%) en cada parte de la carrera.'
        },
        nitro: {
            key: 'Nitro',
            max: 5,
            precio: 1000,
            efecto: '1% por mejora (total 5%) desde mitad de carrera durante 3 turnos.'
        }
    };

    // ⚡ Modo rápido: #mejoras auto mejora
    if (args.length >= 2) {
        let [auto, mejora] = args;
        auto = auto.toLowerCase();
        mejora = mejora.toLowerCase();

        if (!autos.includes(auto)) return conn.reply(m.chat, `🚫 El auto "${auto}" no es válido. Usa uno de estos: ${autos.join(', ')}`, m);
        if (!user[auto]) return conn.reply(m.chat, `🚫 No tienes el auto "${auto}" en tu garaje.`, m);
        if (!mejorasValidas[mejora]) return conn.reply(m.chat, `🚫 Mejora inválida. Usa: motor, agarre, turbo o nitro.`, m);

        const data = mejorasValidas[mejora];
        const actual = user[auto + data.key] || 0;

        if (actual >= data.max) return conn.reply(m.chat, `🚫 Tu mejora de ${mejora} ya está al máximo nivel (${data.max}).`, m);
        if (user.coin < data.precio) return conn.reply(m.chat, `🚫 No tienes suficiente dinero. Necesitas ${data.precio} Yenes.`, m);

        user.coin -= data.precio;
        user[auto + data.key] = actual + 1;

        return conn.reply(m.chat, `✅ Has mejorado *${mejora}* de tu *${auto}* a nivel ${actual + 1}.\n📌 ${data.efecto}\n💸 Te quedan ${user.coin} Yenes.`, m);
    }

    // 🧭 Modo guiado (sin args)
    const disponibles = autos.filter(k => user[k]);
    if (!disponibles.length) return conn.reply(m.chat, `🚫 No tienes ningún vehículo para mejorar.`, m);

    let texto = `🚗 ¿Qué auto deseas mejorar?\n\nSelecciona uno con uno de estos comandos:\n${disponibles.map(v => `#${v}`).join(', ')}`;
    conn.reply(m.chat, texto, m);

    const seleccion = await new Promise((resolve) => {
        global.seleccionDeAuto = global.seleccionDeAuto || {};
        global.seleccionDeAuto[m.sender] = {
            opciones: disponibles,
            resolve,
            timeout: setTimeout(() => {
                delete global.seleccionDeAuto[m.sender];
                resolve(null);
            }, 30000)
        };
    });

    if (!seleccion) return conn.reply(m.chat, `⏱️ Tiempo agotado. Mejora cancelada.`, m);

    let textoMejoras = `🔧 Mejora de *${seleccion}*\n\n`;
    for (const [nombre, { key, max, precio, efecto }] of Object.entries(mejorasValidas)) {
        const nivel = user[seleccion + key] || 0;
        textoMejoras += `🔹 ${nombre.charAt(0).toUpperCase() + nombre.slice(1)}: ${nivel}/${max}\n📌 ${efecto}\n💰 Precio: ${precio} Yenes\n\n`;
    }

    global.tempMejoras = global.tempMejoras || {};
    global.tempMejoras[m.sender] = seleccion;

    conn.reply(m.chat, textoMejoras + `✍️ Responde con *#motor*, *#agarre*, *#turbo* o *#nitro* en los próximos 30 segundos para aplicar la mejora.`, m);
};

handler.help = ['mejoras', 'mejoras <auto> <mejora>'];
handler.tags = ['autos', 'mejoras'];
handler.command = ['mejoras'];
handler.group = true;

export default handler;
