import casasBase from '../src/propiedades/casas.js';
import { promises as fs } from 'fs';

let handler = async (m, { conn, args }) => {
  const chatId = m.chat;
  const tipoSolicitado = (args[0] || '').toLowerCase();

  const tiposValidos = ['pequeña', 'edificiogrande', 'edificiopequeño', 'mansion'];

  if (!tiposValidos.includes(tipoSolicitado)) {
    return conn.reply(m.chat,
      `❌ Debes especificar un tipo de propiedad válido:\n• Pequeña\n• EdificioPequeño\n• EdificioGrande\n• Mansion\n\nEjemplo:\n#buscarcasalibre Pequeña`,
      m);
  }

  // Inicializar el grupo si no tiene propiedades
  global.propiedades = global.propiedades || {};
  global.propiedades[chatId] = global.propiedades[chatId] || { casas: {} };
  const grupo = global.propiedades[chatId].casas;

  // Registrar casas base si no están en el grupo
  for (let casa of casasBase) {
    if (!grupo[casa.id]) {
      grupo[casa.id] = {
        ...casa,
        dueño: null,
        inquilinos: [],
        publicada: true
      };
    }
  }

  // Filtrar casas del tipo solicitado que estén libres
  const disponibles = Object.values(grupo).filter(c =>
    c.tipo.toLowerCase() === tipoSolicitado && c.dueño === null && c.publicada
  );

  if (disponibles.length === 0) {
    return conn.reply(m.chat, `🚫 No hay casas *${tipoSolicitado}* disponibles actualmente en este grupo.`, m);
  }

  const casaSeleccionada = disponibles[Math.floor(Math.random() * disponibles.length)];

  let mensaje = `🏡 *Casa disponible encontrada:*\n\n` +
                `🆔 ID: ${casaSeleccionada.id}\n` +
                `🏷️ Tipo: ${casaSeleccionada.tipo}\n` +
                `🎨 Color: ${casaSeleccionada.color}\n` +
                `👥 Capacidad: ${casaSeleccionada.capacidad} personas\n` +
                `📍 Estado: Libre\n\n` +
                `Puedes comprarla usando:\n*#comprarcasa ${casaSeleccionada.id}*`;

  const imagen = await fs.readFile(casaSeleccionada.imagen);
  await conn.sendMessage(m.chat, { image: imagen, caption: mensaje }, { quoted: m });
};

handler.help = ['buscarcasalibre <tipo>'];
handler.tags = ['propiedades'];
handler.command = ['buscarcasalibre'];
handler.group = true;
handler.register = true;

export default handler;
