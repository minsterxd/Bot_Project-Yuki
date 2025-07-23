let handler = async (m, { conn }) => {
  const chatId = m.chat;
  const userId = m.sender;

  global.propiedades = global.propiedades || {};
  global.db = global.db || { data: { users: {} } };

  const grupoPropiedades = global.propiedades[chatId]?.casas || {};
  const propiedadesUsuario = Object.values(grupoPropiedades).filter(c => c.dueño === userId);

  if (propiedadesUsuario.length === 0) {
    return conn.reply(m.chat, '🏠 No tienes propiedades para reclamar renta en este grupo.', m);
  }

  let textoFinal = '';
  const ahora = Date.now();
  const diaMs = 24 * 60 * 60 * 1000;

  for (let casa of propiedadesUsuario) {
    const renta = casa.rentaDiaria || 250;
    const inquilinos = casa.inquilinos || [];
    const ultima = casa.ultimaReclamacionRenta || 0;

    if (inquilinos.length === 0) {
      textoFinal += `🏡 *${casa.id}*: No tiene inquilinos, no hay renta para reclamar.\n\n`;
      continue;
    }

    if (ahora - ultima < diaMs) {
      const horasRestantes = Math.ceil((diaMs - (ahora - ultima)) / (1000 * 60 * 60));
      textoFinal += `🏡 *${casa.id}*: Ya reclamaste la renta hoy.\n⏳ Puedes volver a reclamar en ${horasRestantes} horas.\n\n`;
      continue;
    }

    let cobrados = 0;
    let fallidos = [];

    for (let jid of inquilinos) {
      let usuario = global.db.data.users[jid];
      if (!usuario) continue;

      if (usuario.monedas >= renta) {
        usuario.monedas -= renta;
        global.db.data.users[userId].monedas = (global.db.data.users[userId].monedas || 0) + renta;
        cobrados++;
      } else {
        fallidos.push(jid);
      }
    }

    casa.ultimaReclamacionRenta = ahora;

    textoFinal += `🏡 *${casa.id}*:\n✅ Renta cobrada a *${cobrados}* inquilinos.\n`;
    if (fallidos.length > 0) {
      const lista = fallidos.map(jid => `@${jid.split('@')[0]}`).join(', ');
      textoFinal += `⚠️ No se pudo cobrar a: ${lista}\n`;
    }
    textoFinal += '\n';
  }

  conn.reply(m.chat, textoFinal.trim(), m, {
    mentions: [...new Set(textoFinal.match(/@\d+/g) || [])]
  });
};

handler.help = ['reclamarrenta'];
handler.tags = ['propiedades'];
handler.command = ['reclamarrenta'];
handler.group = true;
handler.register = true;

export default handler;
