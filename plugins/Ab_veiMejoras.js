let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const autos = ['mclaren720s', 'ferrari488pista', 'lamboavesvj'];
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

    const mejoras = [
        {
            nombre: 'Motor',
            key: 'Motor',
            nivel: user[seleccion + 'Motor'] || 0,
            max: 10,
            efecto: '0.5% por mejora (total 5%) en cada parte de la carrera.',
            precio: 500
        },
        {
            nombre: 'Agarre',
            key: 'Agarre',
            nivel: user[seleccion + 'Agarre'] || 0,
            max: 10,
            efecto: '0.5% por mejora (total 5%) en cada parte de la carrera.',
            precio: 500
        },
        {
            nombre: 'Turbo',
            key: 'Turbo',
            nivel: user[seleccion + 'Turbo'] || 0,
            max: 10,
            efecto: '0.25% por mejora (total 2.5%) en cada parte de la carrera.',
            precio: 250
        },
        {
            nombre: 'Propulsión',
            key: 'Nitro',
            nivel: user[seleccion + 'Nitro'] || 0,
            max: 5,
            efecto: '1% por mejora (total 5%) desde mitad de carrera durante 3 turnos.',
            precio: 1000
        }
    ];

    let textoMejoras = `🔧 Mejora de *${seleccion}*\n\n`;
    for (const m of mejoras) {
        textoMejoras += `🔹 ${m.nombre}: ${m.nivel}/${m.max}\n📌 ${m.efecto}\n💰 Precio: ${m.precio} Yenes\n\n`;
    }

    global.tempMejoras = global.tempMejoras || {};
    global.tempMejoras[m.sender] = seleccion;

    conn.reply(m.chat, textoMejoras + `\n✍️ Responde con *#motor*, *#agarre*, *#turbo* o *#nitro* en los próximos 30 segundos para aplicar la mejora.`, m);
};

handler.help = ['mejoras'];
handler.tags = ['autos', 'mejoras'];
handler.command = ['mejoras'];
handler.group = true;

export default handler;
