let handler = async (m, { conn, args }) => {
  const chatId = m.chat;
  const userId = m.sender;
  const idCasa = args[0];

  if (!idCasa) {
    return conn.reply(m.chat, '📌 Debes especificar el *ID de la casa* que deseas comprar.\nEjemplo: #comprarcasa casa1', m);
  }

  const user = global.db.data.users[userId];
  if (!user) return conn.reply(m.chat, '❌ Usuario no encontrado en la base de datos.', m);

  global.propiedades = global.propiedades || {};
  global.propiedades[chatId] = global.propiedades[chatId] || { casas: {} };
  const casasGrupo = global.propiedades[chatId].casas;

  const casa = casasGrupo[idCasa];
  if (!casa) return conn.reply(m.chat, '🚫 No se encontró ninguna casa con ese ID en este grupo.', m);

  if (!casa.publicada || casa.dueño !== null) {
    return conn.reply(m.chat, '🚫 Esta casa no está disponible para comprar.', m);
  }

  if (!casa.precio || typeof casa.precio !== 'number') {
    return conn.reply(m.chat, '⚠️ Esta casa no tiene un precio válido definido. Contacta al admin.', m);
  }

  if (user.coin < casa.precio) {
    return conn.reply(m.chat, `❌ No tienes suficiente dinero para comprar esta casa.\n💰 Precio: *${casa.precio} monedas*\n📉 Tu saldo: *${user.coin} monedas*`, m);
  }

  // Descontar dinero y asignar propiedad
  user.coin -= casa.precio;
  casa.dueño = userId;
  casa.publicada = false;
  casa.inquilinos = [];

  const mensaje = `🏡 ¡Felicidades!\n\n@${userId.split('@')[0]} compraste la casa *${idCasa}* por *${casa.precio} monedas*.\nAhora eres el dueño. Puedes gestionarla con futuros comandos.`;

  await conn.sendMessage(m.chat, {
    text: mensaje,
    mentions: [userId]
  }, { quoted: m });
};

handler.help = ['comprarcasa <id>'];
handler.tags = ['propiedades'];
handler.command = ['comprarcasa'];
handler.group = true;

export default handler;
