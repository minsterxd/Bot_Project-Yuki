async function handler(m, { conn, args, usedPrefix, command }) {
  const user = global.db.data.users[m.sender];
  const type = 'exp'; // aquí usamos la experiencia
  const minTransfer = 100; // mínimo a transferir

  if (!args[0] || !args[1]) {
    const helpMessage = `📘 Debes mencionar a quien quieras transferir *experiencia (XP)*.\n> Ejemplo: *${usedPrefix + command} 500 @usuario*`;
    return conn.sendMessage(m.chat, { text: helpMessage, mentions: [m.sender] }, { quoted: m });
  }

  const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(minTransfer, (isNumber(args[0]) ? parseInt(args[0]) : minTransfer))) * 1;
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[1] ? (args[1].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : '';
  
  if (!who) return conn.sendMessage(m.chat, { text: `⚠️ Debes mencionar al usuario correctamente para transferir XP.`, mentions: [m.sender] }, { quoted: m });
  if (!(who in global.db.data.users)) return conn.sendMessage(m.chat, { text: `🚫 El usuario ${who} no está registrado en la base de datos.`, mentions: [m.sender] }, { quoted: m });
  if (user[type] < count) return conn.sendMessage(m.chat, { text: `😢 No tienes suficiente experiencia para transferir.\nTienes: *${user[type]} XP*`, mentions: [m.sender] }, { quoted: m });

  user[type] -= count;
  global.db.data.users[who][type] += count;

  const mentionText = `@${who.split('@')[0]}`;
  conn.sendMessage(m.chat, { text: `✅ Has transferido *${count} XP* a ${mentionText}.\n📊 Ahora te quedan *${user[type]} XP*.`, mentions: [who] }, { quoted: m });
}

handler.help = ['transferxp'];
handler.tags = ['xp'];
handler.command = ['transferxp', 'pasarexp'];
handler.group = true;
handler.register = true;

export default handler;

function isNumber(x) {
  return !isNaN(x);
}
