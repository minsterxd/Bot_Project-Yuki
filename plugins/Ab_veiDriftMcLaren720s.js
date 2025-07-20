import { promises as fs } from 'fs';

let handler = async (m, { conn, usedPrefix, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    m.react("🏎️");
    let user = global.db.data.users[m.sender];
    if (!user) {
        return conn.reply(m.chat, `${emoji} El usuario no se encuentra en la base de Datos.`, m);
    }
    if (user.mclaren720s = 0) {
        return conn.reply(m.chat, `No tienes ningún McLaren 720s en tu garaje! Haz #Info_McLaren720s para obtener información sobre el auto.`, m);
    }
    let McLaren720s = 1;
    user.mclaren720s -= McLaren720s; 
    let img = await fs.readFile("./src/McLaren720s_Drift.jpg");
    let info = `@${userId.split('@')[0]} Esta haciendo *Drifting* con su McLaren720s!`;
    await conn.sendMessage(
      m.chat,
      {
        image: img,
        fileName: "ᥡᥙkі sᥙ᥆ᥙ",
        mimetype: "image/png",
        caption: info,
        fileLength: 1900
      },
    );
};

handler.help = ['driftmclaren'];
handler.tags = ['driftmclaren720s'];
handler.command = ['drift_mclaren720s']
handler.group = true;
handler.register = true;

export default handler;
