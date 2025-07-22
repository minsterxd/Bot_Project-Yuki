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

    // Función auxiliar para mostrar mejoras si existen
    const mostrarMejoras = (auto) => {
        const motor = user[`${auto}Motor`] || 0;
        const agarre = user[`${auto}Agarre`] || 0;
        const turbo = user[`${auto}Turbo`] || 0;
        const nitro = user[`${auto}Nitro`] || 0;

        const mejoras = [];
        if (motor > 0) mejoras.push(`🛠️ Motor: Nivel ${motor}`);
        if (agarre > 0) mejoras.push(`🛞 Agarre: Nivel ${agarre}`);
        if (turbo > 0) mejoras.push(`🚀 Turbo: Nivel ${turbo}`);
        if (nitro > 0) mejoras.push(`🔥 Propulsión: Nivel ${nitro}`);

        return mejoras.length ? mejoras.map(m => `   └ ${m}`).join('\n') : '';
    };

    if (user.mclaren720s > 0) {
        let porcentaje = ((user.mclaren720s / 100000) * 100).toFixed(2);
        let texto = `🏎️ *McLaren 720s* » ${user.mclaren720s} usos restantes (${porcentaje}%)`;
        let mejoras = mostrarMejoras('mclaren720s');
        autos.push(`${texto}${mejoras ? '\n' + mejoras : ''}`);
    }

    if (user.ferrari488pista > 0) {
        let porcentaje = ((user.ferrari488pista / 100000) * 100).toFixed(2);
        let texto = `🏁 *Ferrari 488 Pista* » ${user.ferrari488pista} usos restantes (${porcentaje}%)`;
        let mejoras = mostrarMejoras('ferrari488pista');
        autos.push(`${texto}${mejoras ? '\n' + mejoras : ''}`);
    }

    if (user.lamboavesvj > 0) {
        let porcentaje = ((user.lamboavesvj / 100000) * 100).toFixed(2);
        let texto = `🔥 *Lamborghini Aventador SVJ* » ${user.lamboavesvj} usos restantes (${porcentaje}%)`;
        let mejoras = mostrarMejoras('lamboavesvj');
        autos.push(`${texto}${mejoras ? '\n' + mejoras : ''}`);
    }

    if (autos.length === 0) {
        return conn.reply(m.chat, `No tienes ningún vehículo comprado. 🏎️`, m);
    }

    let mensaje = `🚘 *Tu garaje de autos*:\n\n${autos.join('\n\n')}`;
    conn.reply(m.chat, mensaje, m);
};

handler.help = ['garaje'];
handler.tags = ['autos'];
handler.command = ['garaje'];
handler.group = true;
handler.register = true;

export default handler;
