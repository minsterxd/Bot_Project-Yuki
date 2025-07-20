import { promises as fs } from 'fs';

let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    if (!user) {
        return conn.reply(m.chat, `${emoji} El usuario no se encuentra en la base de Datos.`, m);
    }
    if (user.mclaren720s > 1) {
        return conn.reply(m.chat, `Ya tienes un McLaren 720s, porque querrías otro?`, m);
    }
    if (user.coin < 10000) {
        return conn.reply(m.chat, `Su dinero es insuficiente para comprar un McLaren720s. 💔`, m);
    }
    let PurchMcLaren720s = 100000; 
    user.mclaren720s += PurchMcLaren720s;
    user.coin -= 10000; 
    let img = await fs.readFile("./src/McLaren720s.jpg");
    let info = `Compraste con éxito tu McLaren 720s. Disfrútalo ❤️. Y gracias por esos deliciosos 10000 Yenes (⁠ ⁠/⁠^⁠ω⁠^⁠)⁠/`;
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

handler.help = ['comprarmclaren'];
handler.tags = ['comprarmclaren720s'];
handler.command = ['comprar_mclaren720s']
handler.group = true;
handler.register = true;

export default handler;
