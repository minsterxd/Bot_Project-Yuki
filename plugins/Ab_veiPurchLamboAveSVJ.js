import { promises as fs } from 'fs';

let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    if (!user) {
        return conn.reply(m.chat, `${emoji} El usuario no se encuentra en la base de Datos.`, m);
    }
    if (user.lamboavesvj > 1) {
        return conn.reply(m.chat, `Ya tienes un Lamborghini Aventador SVJ, porque querrías otro?`, m);
    }
    if (user.coin < 10000) {
        return conn.reply(m.chat, `Su dinero es insuficiente para comprar un Lamborghini Aventador SVJ. 💔`, m);
    }
    let Purchlamboavesvj = 100000; 
    user.lamboavesvj += Purchlamboavesvj;
    user.coin -= 10000; 
    let img = await fs.readFile("./src/autos/super/LamboAveSVJ.jpg");
    let info = `Compraste con éxito tu Lamborghini Aventador SVJ. Disfrútalo ❤️. Y gracias por esos deliciosos 10000 Yenes (⁠ ⁠/⁠^⁠ω⁠^⁠)⁠/`;
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

handler.help = ['comprarlamboavesvj'];
handler.tags = ['comprarlamboavesvj'];
handler.command = ['comprar_lamboavesvj']
handler.group = true;
handler.register = true;

export default handler;
