let handler = async (m, { conn, args }) => {
  const chatId = m.chat;
  const userId = m.sender;

  global.propiedades = global.propiedades || {};
  const grupoPropiedades = global.propiedades[chatId]?.casas || {};

  if (!args[0] || !args[1]) {
    return conn.reply(m.chat, '📌 Uso: *#establecerrenta <ID> <monto>*\nEjemplo:\n#establecerrenta casa1 200', m);
  }

  const idCasa = args[0].toLowerCase();
  const monto = parseInt(args[1]);

  if (isNaN(monto) || monto < 1) {
    return conn.reply(m.chat, '❌ El monto debe ser un número mayor a 0.', m);
  }

  const casa = grupoPropiedades[idCasa];

  if (!casa) {
    return conn.reply(m.chat, '🚫 No se encontró ninguna propiedad con ese ID en este grupo.', m);
  }

  if (casa.dueño !== userId) {
    return conn.reply(m.chat, '⛔ Solo el dueño de la propiedad puede establecer la renta.', m);
  }

  const ahora = Date.now();
  const semanaMs = 7 * 24 * 60 * 60 * 1000;

  if (casa.ultimaModificacionRenta && ahora - casa.ultimaModificacionRenta < semanaMs) {
    const diasRestantes = Math.ceil((semanaMs - (ahora - casa.ultimaModificacionRenta)) / (1000 * 60 * 60 * 24));
    return conn.reply(m.chat, `🕒 Solo puedes cambiar la renta una vez cada 7 días.\n⏳ Vuelve a intentarlo en *${diasRestantes} día(s)*.`, m);
  }

  casa.rentaDiaria = monto;
  casa.ultimaModificacionRenta = ahora;

  conn.reply(m.chat, `✅ Has establecido la renta de la casa *${idCasa}* en *${monto} monedas por inquilino al día*.`, m);
};

handler.help = ['establecerrenta <id> <monto>'];
handler.tags = ['propiedades'];
handler.command = ['establecerrenta'];
handler.group = true;
handler.register = true;

export default handler;
