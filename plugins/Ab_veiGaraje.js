let handler = async (m, { conn }) => {
    const emoji = '🚗';
    let user = global.db.data.users[m.sender];

    if (!user) {
        return conn.reply(m.chat, `${emoji} El usuario no se encuentra en la base de datos.`, m);
    }

    // Inicializar valores por si no existen
    user.mclaren720s = user.mclaren720s || 0;
    user.ferrari488pista = user.ferrari488pista || 0;
    user.lamboavesvj = user.lamboavesvj || 0;

    const autos = [];

    if (user.mclaren720s > 0) {
        let porcentaje = ((user.mclaren720s / 100000) * 100).toFixed(2);
        autos.push(`🏎️ *McLaren 720s* » ${user.mclaren720s} usos restantes (${porcentaje}%)`);
    }

    if (user.ferrari488pista > 0) {
        let porcentaje = ((user.ferrari488pista / 100000) * 100).toFixed(2);
        autos.push(`🏁 *Ferrari 488 Pista* » ${user.ferrari488pista} usos restantes (${porcentaje}%)`);
    }

    if (user.lamboavesvj > 0) {
        let porcentaje = ((user.lamboavesvj / 100000) * 100).toFixed(2);
        autos.push(`🔥 *Lamborghini Aventador SVJ* » ${user.lamboavesvj} usos restantes (${porcentaje}%)`);
    }

    if (autos.length === 0) {
        return conn.reply(m.chat, `No tienes ningún vehículo comprado. 🏎️`, m);
    }

    let mensaje = `🚘 *Tu garaje de autos*:\n\n${autos.join('\n')}`;
    conn.reply(m.chat, mensaje, m);
};

handler.help = ['garaje'];
handler.tags = ['autos'];
handler.command = ['garaje'];
handler.group = true;
handler.register = true;

export default handler;
