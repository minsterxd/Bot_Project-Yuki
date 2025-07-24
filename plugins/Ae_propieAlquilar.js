let handler = async (m, { conn, args }) => {
  const chatId = m.chat;
  const userId = m.sender;
  const idCasa = args[0]?.toLowerCase();

  if (!idCasa) {
    return conn.reply(m.chat, '❌ Debes especificar el ID de la casa. Ejemplo:\n*#alquilarcasa casa1*', m);
  }

  // Inicializar propiedades si no existen
  global.propiedades = global.propiedades || {};
  global.propiedades[chatId] = global.propiedades[chatId] || { casas: {} };
  const grupo = global.propiedades[chatId].casas;

  const casa = grupo[idCasa];

  if (!casa) {
    return conn.reply(m.chat, '🚫 No se encontró una casa con ese ID.', m);
  }

  if (!casa.dueño) {
    return conn.reply(m.chat, '⚠️ Esa casa no tiene dueño aún, no puedes alquilarla.', m);
  }

  // Verificar si ya es inquilino
  casa.inquilinos = casa.inquilinos || [];
  if (casa.inquilinos.includes(userId)) {
    return conn.reply(m.chat, '✅ Ya estás registrado como inquilino en esta casa.', m);
  }

  // Verificar espacio
  const capacidadMaxima = casa.capacidad;
  const cantidadOcupada = casa.inquilinos.length;
  const espacioDisponible = capacidadMaxima - 1; // 1 espacio reservado para el dueño

  if (cantidadOcupada >= espacioDisponible) {
    return conn.reply(m.chat, '🚷 Esta casa ya está llena y no acepta más inquilinos.', m);
  }

  // Registrar como inquilino
  casa.inquilinos.push(userId);

  // Confirmar al usuario
  conn.reply(m.chat, `✅ Te has unido como inquilino a la casa *${idCasa}*.`, m);

  // Notificar al dueño si no es el mismo
  if (casa.dueño !== userId) {
    conn.sendMessage(chatId, {
      text: `📢 @${userId.split('@')[0]} ahora es inquilino de tu casa *${idCasa}*.`,
      mentions: [userId, casa.dueño]
    });
  }
};

handler.help = ['alquilarcasa <id>'];
handler.tags = ['propiedades'];
handler.command = ['alquilarcasa'];
handler.group = true;
handler.register = true;

export default handler;
