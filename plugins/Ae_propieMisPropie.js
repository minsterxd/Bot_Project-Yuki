import { promises as fs } from 'fs';

let handler = async (m, { conn }) => {
  const chatId = m.chat;
  const userId = m.sender;

  // Asegurarse de que el objeto global de propiedades esté definido
  global.propiedades = global.propiedades || {};
  const grupoPropiedades = global.propiedades[chatId]?.casas || {};

  // Filtrar casas que pertenezcan al usuario
  const propiedadesUsuario = Object.values(grupoPropiedades).filter(c => c.dueño === userId);

  if (propiedadesUsuario.length === 0) {
    return conn.reply(m.chat, '🏠 No tienes propiedades en este grupo.', m);
  }

  for (let casa of propiedadesUsuario) {
    // Calcular renta (ej: 250 por inquilino)
    const rentaPorInquilino = casa.rentaDiaria || 250; // Puedes cambiarlo o hacerlo editable en el futuro
    const cantidadInquilinos = casa.inquilinos?.length || 0;
    const rentaTotal = cantidadInquilinos * rentaPorInquilino;

    // Mostrar inquilinos como lista de JIDs
    let listaInquilinos = 'Ninguno';
    if (cantidadInquilinos > 0) {
      listaInquilinos = casa.inquilinos.map(jid => `• ${jid}`).join('\n');
      // TODO: Integrar función para mostrar @nombres si lo deseas
    }

    let texto = `🏡 *Propiedad*\n\n` +
                `🆔 ID: ${casa.id}\n` +
                `🏷️ Tipo: ${casa.tipo}\n` +
                `🎨 Color: ${casa.color}\n` +
                `👥 Capacidad: ${casa.capacidad} personas\n` +
                `👤 Dueño: Tú\n` +
                `📢 Publicada: ${casa.publicada ? 'Sí' : 'No'}\n\n` +
                `🧍‍♂️ Inquilinos actuales: ${cantidadInquilinos}/${casa.capacidad - 1}\n` +
                `📋 Lista de inquilinos:\n${listaInquilinos}\n\n` +
                `💰 Renta total diaria: ${rentaTotal} monedas\n` +
                `📌 Renta por inquilino: ${rentaPorInquilino} monedas`;

    try {
      const buffer = await fs.readFile(casa.imagen);
      await conn.sendMessage(m.chat, { image: buffer, caption: texto }, { quoted: m });
    } catch (e) {
      await conn.reply(m.chat, texto + '\n\n⚠️ No se pudo cargar la imagen.', m);
    }
  }
};

handler.help = ['mispropiedades'];
handler.tags = ['propiedades'];
handler.command = ['mispropiedades', 'misp'];
handler.group = true;
handler.register = true;

export default handler;
