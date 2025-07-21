let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const venta = global.ventaPendiente?.[m.sender];

    if (!venta) return m.reply('❌ No tienes una venta pendiente.');

    const { auto, precio, timeout } = venta;
    clearTimeout(timeout);
    delete global.ventaPendiente[m.sender];

    delete user[auto];
    user.coin += precio;

    conn.reply(m.chat, `✅ Has vendido tu *${auto}* por *${precio} monedas*. ¡Gracias por tu negocio!`);
};

handler.help = ['aceptarventa'];
handler.tags = ['autos', 'economía'];
handler.command = ['aceptarventa'];
handler.group = true;
handler.register = true;

export default handler;
