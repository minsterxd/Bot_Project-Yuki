import { promises as fs } from 'fs';

let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    if (!user) {
        return conn.reply(m.chat, `${emoji} El usuario no se encuentra en la base de Datos.`, m);
    }
    if (user.ferrari488pista > 1) {
        return conn.reply(m.chat, `Ya tienes un Ferrari 488 Pista, porque querrías otro?`, m);
    }
    if (user.coin < 10000) {
        return conn.reply(m.chat, `Su dinero es insuficiente para comprar un Ferrari 488 Pista. 💔`, m);
    }
    let Purchferrari488pista = 100000; 
    user.ferrari488pista += Purchferrari488pista;
    user.coin -= 10000; 
    let img = await fs.readFile("./src/autos/super/Ferrari488Pista.jpg");
    let info = `Compraste con éxito tu Ferrari 488 Pista. Disfrútalo ❤️. Y gracias por esos deliciosos 10000 Yenes (⁠ ⁠/⁠^⁠ω⁠^⁠)⁠/`;
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

handler.help = ['comprarferrari488pista'];
handler.tags = ['comprarferrari488pista'];
handler.command = ['comprar_ferrari488pista']
handler.group = true;
handler.register = true;

export default handler;
