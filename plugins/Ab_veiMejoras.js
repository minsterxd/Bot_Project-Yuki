import { promises as fs } from 'fs';

let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const autos = ['mclaren720s', 'ferrari488pista', 'lamboavesvj'];
    const disponibles = autos.filter(k => user[k]);

    if (!disponibles.length) return conn.reply(m.chat, `🚫 No tienes ningún vehículo para mejorar.`, m);

    const auto = await askSelection(conn, m.chat, m.sender, disponibles, `🚗 ¿Qué auto deseas mejorar? Responde con su nombre:`);

    if (!auto) return conn.reply(m.chat, `⏱️ Tiempo agotado. Mejora cancelada.`, m);

    const mejoras = [
        {
            nombre: 'Motor',
            key: 'Motor',
            nivel: user[auto + 'Motor'] || 0,
            max: 10,
            efecto: '0.5% por mejora (total 5%) en cada parte de la carrera.',
            precio: 500
        },
        {
            nombre: 'Agarre',
            key: 'Agarre',
            nivel: user[auto + 'Agarre'] || 0,
            max: 10,
            efecto: '0.5% por mejora (total 5%) en cada parte de la carrera.',
            precio: 500
        },
        {
            nombre: 'Turbo',
            key: 'Turbo',
            nivel: user[auto + 'Turbo'] || 0,
            max: 10,
            efecto: '0.25% por mejora (total 2.5%) en cada parte de la carrera.',
            precio: 250
        },
        {
            nombre: 'Propulsión',
            key: 'Nitro',
            nivel: user[auto + 'Nitro'] || 0,
            max: 5,
            efecto: '1% por mejora (total 5%) desde mitad de carrera durante 3 turnos.',
            precio: 1000
        }
    ];

    let texto = `🔧 Mejora de *${auto}*\n\n`;
    for (const m of mejoras) {
        texto += `🔹 ${m.nombre}: ${m.nivel}/${m.max}\n📌 ${m.efecto}\n💰 Precio: ${m.precio} Yenes\n\n`;
    }

    // Guardamos auto en mejora temporal (global)
    global.tempMejoras = global.tempMejoras || {};
    global.tempMejoras[m.sender] = auto;

    return conn.reply(m.chat, texto + `\n✍️ Responde con *#motor*, *#agarre*, *#turbo* o *#nitro* en los próximos 30 segundos para aplicar la mejora.`, m);
};

handler.help = ['mejoras'];
handler.tags = ['autos', 'mejoras'];
handler.command = ['mejoras'];
handler.group = true;

export default handler;
