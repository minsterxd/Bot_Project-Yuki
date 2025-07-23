let handler = async (m, { conn, participants, args }) => {
  const chatId = m.chat;
  const sender = m.sender;

  if (!args[0]) {
    return conn.reply(m.chat, '❌ Debes mencionar a un usuario o escribir *todos* para expulsar inquilinos.\nEjemplo:\n#expulsarinquilino @usuario\n#expulsarinquilino todos', m);
  }

  global.propiedades = global.propiedades || {};
  const grupoPropiedades = global.propiedades[chatId]?.casas || {};

  const propiedadesUsuario = Object.values(grupoPropiedades).filter(c => c.dueño === sender);

  if (propiedadesUsuario.length === 0) {
    return conn.reply(m.chat, '🚫 No tienes propiedades en este grupo.', m);
  }

  // Expulsión masiva
  if (args[0].toLowerCase() === 'todos') {
    let totalExpulsados = 0;
    for (let casa of propiedadesUsuario) {
      for (let jid of casa.inquilinos) {
        try {
          await conn.sendMessage(jid, {
            text: `🚪 Has sido expulsado de la casa *${casa.id}* por el propietario.`
          });
        } catch (e) {
          console.log(`❗ No se pudo notificar a ${jid}`);
        }
      }
      totalExpulsados += casa.inquilinos.length;
      casa.inquilinos = [];
    }

    return conn.reply(m.chat, `✅ Se han expulsado a *${totalExpulsados}* inquilino(s) de todas tus propiedades.`, m);
  }

  // Expulsión individual
  if (!m.mentionedJid?.length) {
    return conn.reply(m.chat, '❌ Debes mencionar a un usuario para expulsarlo.\nEjemplo:\n#expulsarinquilino @usuario', m);
  }

  const expulsado = m.mentionedJid[0];
  let casaObjetivo = null;

  for (let casa of propiedadesUsuario) {
    if (casa.inquilinos.includes(expulsado)) {
      casaObjetivo = casa;
      break;
    }
  }

  if (!casaObjetivo) {
    return conn.reply(m.chat, '🚫 El usuario mencionado no vive en ninguna de tus propiedades.', m);
  }

  casaObjetivo.inquilinos = casaObjetivo.inquilinos.filter(jid => jid !== expulsado);

  const nombreExpulsado = (await conn.getName(expulsado)) || 'usuario';

  conn.reply(m.chat, `✅ Has expulsado a @${expulsado.split('@')[0]} de la propiedad *${casaObjetivo.id}*.`, m, {
    mentions: [expulsado]
  });

  try {
    await conn.sendMessage(expulsado, {
      text: `🚪 Has sido expulsado de la casa *${casaObjetivo.id}* por el propietario.`
    });
  } catch (e) {
    console.log(`❗ No se pudo notificar a ${expulsado}`);
  }
};

handler.help = ['expulsarinquilino @usuario | todos'];
handler.tags = ['propiedades'];
handler.command = ['expulsarinquilino'];
handler.group = true;
handler.register = true;

export default handler;
