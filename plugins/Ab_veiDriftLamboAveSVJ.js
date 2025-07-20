import { promises as fs } from 'fs';

let handler = async (m, { conn, usedPrefix, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    m.react("🏎️");
    if (!user) {
        return conn.reply(m.chat, `${emoji} El usuario no se encuentra en la base de Datos.`, m);
    }
    user.lamboavesvj = user.lamboavesvj || 0;
    if (!user.lamboavesvj || user.lamboavesvj < 1) {
        return conn.reply(m.chat, `No tienes ningún Lamborghini Aventador SVJ en tu garaje! Haz #Info_LamboAveSVJ para obtener información sobre el auto.`, m);
    }
    let lamboavesvj= 1;
    user.lamboavesvj -= lamboavesvj; 
    let img = await fs.readFile("./src/autos/super/LamboAveSVJ_Drift.jpg");
    let info = `@${userId.split('@')[0]} Esta haciendo *Drifting* con su Lamborghini Aventador SVJ!`;
    await conn.sendMessage(
      m.chat,
      {
        image: img,
            fileName: "ᥡᥙkі sᥙ᥆ᥙ",
            mimetype: "image/png",
            caption: info,
            fileLength: 1900,
            contextInfo: {
                mentionedJid: [userId]
            },
      },
    );
};

handler.help = ['driftlamboavesvj'];
handler.tags = ['driftlamboavesvj'];
handler.command = ['drift_lamboavesvj']
handler.group = true;
handler.register = true;

export default handler;
