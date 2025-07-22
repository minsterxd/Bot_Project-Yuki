let handler = async (m, { conn }) => {
  const oferta = global.ventaAutos?.[m.sender];
  if (!oferta) return conn.reply(m.chat, `🚫 No tienes ninguna oferta de venta activa.`, m);

  const user = global.db.data.users[m.sender];
  const { vehiculo, valor } = oferta;

  // Transferir monedas y eliminar el auto (lo pone en 0 usos)
  user.coin += valor;
  user[vehiculo] = 0;
  delete global.ventaAutos[m.sender];

  await conn.reply(m.chat, `✅ Venta confirmada: vendiste tu *${vehiculo}* por *${valor}* monedas.`);
};

handler.help = ['confirmarventa'];
handler.tags = ['autos'];
handler.command = ['confirmarventa'];
handler.group = true;
handler.register = true;

export default handler;
