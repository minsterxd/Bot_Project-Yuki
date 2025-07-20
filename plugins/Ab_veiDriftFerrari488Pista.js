import { promises as fs } from 'fs';

let handler = async (m, { conn, usedPrefix, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    m.react("🏎️");
    if (!user) {
        return conn.reply(m.chat, `${emoji} El usuario no se encuentra en la base de Datos.`, m);
    }
    user.ferrari488pista = user.ferrari488pista || 0;
    if (!user.ferrari488pista || user.ferrari488pista < 1) {
        return conn.reply(m.chat, `No tienes ninguna Ferrari 488 Pista en tu garaje! Haz #Info_Ferrari488Pista para obtener información sobre el auto.`, m);
    }
    let ferrari488pista = 1;
    user.ferrari488pista -= ferrari488pista; 
    let img = await fs.readFile("./src/autos/super/Ferrari488Pista_Drift.jpg");
    let info = `@${userId.split('@')[0]} Esta haciendo *Drifting* con su Ferrari 488 Pista!`;
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

handler.help = ['driftferrari488pista'];
handler.tags = ['driftferrari488pista'];
handler.command = ['drift_ferrari488pista']
handler.group = true;
handler.register = true;

export default handler;
