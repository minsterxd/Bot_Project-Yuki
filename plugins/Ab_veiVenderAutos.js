let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];
  if (!user) return conn.reply(m.chat, `🚫 Usuario no encontrado.`, m);

  // Determinar autos con usos disponibles
  const autos = ['mclaren720s', 'ferrari488pista', 'lamboavesvj'];
  const disponibles = autos.filter(k => (user[k] || 0) > 0);
  if (!disponibles.length) {
    return conn.reply(m.chat, `🚗 No tienes vehículos con usos disponibles para vender.`, m);
  }

  // Pedir al usuario que seleccione un auto usando tu sistema
  const texto = disponibles.map(a => `#${a}`).join('\n');
  await conn.sendMessage(m.chat, {
    text: `🚘 @${m.sender.split('@')[0]}, elige el vehículo que deseas vender usando uno de estos comandos:\n\n${texto}`,
    mentions: [m.sender]
  });

  global.seleccionDeAuto = global.seleccionDeAuto || {};
  global.seleccionDeAuto[m.sender] = {
    opciones: disponibles,
    resolve: async (seleccion) => {
      const usos = user[seleccion];
      const porcentaje = usos / 100000;
      const precioBase = 19000;
      const valor = Math.round(porcentaje * precioBase);

      // Guardar oferta
      global.ventaAutos = global.ventaAutos || {};
      global.ventaAutos[m.sender] = { vehiculo: seleccion, valor };

      await conn.sendMessage(m.chat, {
        text: `💰 Tu *${seleccion}* tiene ${usos} usos restantes.\nValor de venta: *${valor}* monedas.\nPara confirmar, escribe *#confirmarventa* dentro de 30 s.`,
        mentions: [m.sender]
      });

      // Cancelar automáticamente si no confirma
      setTimeout(() => {
        if (global.ventaAutos?.[m.sender]) {
          delete global.ventaAutos[m.sender];
          conn.reply(m.chat, `⌛ Se agotó el tiempo. Venta cancelada.`, m);
        }
      }, 30000);
    },
    timeout: setTimeout(() => {
      delete global.seleccionDeAuto[m.sender];
      conn.reply(m.chat, `⏱️ Tiempo agotado para seleccionar auto. Venta cancelada.`, m);
    }, 30000)
  };
};

handler.help = ['venderautos'];
handler.tags = ['autos'];
handler.command = ['venderautos'];
handler.group = true;
handler.register = true;

export default handler;
