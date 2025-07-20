import Jimp from "jimp";
import { promises as fs } from 'fs';

let handler = async (m, { conn, usedPrefix, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    m.react("🏎️");
    let txt = `Hola! Soy *ᥡᥙkі sᥙ᥆ᥙ* (｡•̀ᴗ-)✧
Veo que quieres comprar un super carro, eh? 
Aqui tienes la lista! (⁠◠⁠‿⁠・⁠)⁠—⁠☆
╭┈ ↷
│ᰔ Cliente » @${userId.split('@')[0]}
│❀ Superautos disponibles: 3 
╰─────────────────

• :･ﾟ⊹˚• \`『 Info sobre 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 el McLaren 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『    720s    』\` •˚⊹:･ﾟ•

Bueno, *según mi amigo ChatGPT*, esta es la información sobre el McLaren 720s 🚗:
El McLaren 720S es un superdeportivo británico lanzado en 2017, parte de la Serie Super de McLaren. Equipa un motor V8 biturbo de 4.0 litros que produce 720 caballos de fuerza, lo que le permite acelerar de 0 a 100 km/h en 2.9 segundos. Destaca por su diseño aerodinámico, puertas tipo diédricas y chasis de fibra de carbono, ofreciendo un equilibrio impresionante entre rendimiento extremo y manejo refinado.

• :･ﾟ⊹˚• \`『 Detalles 』\` •˚⊹:･ﾟ•
 :･ﾟ⊹˚• \`『 del McLaren 』\` •˚⊹:･ﾟ
• :･ﾟ⊹˚• \`『 a comprar 』\` •˚⊹:･ﾟ•

❍ Comprar los superdeportivos:
ᰔᩚ *#Comprar_McLaren720s*
> ✦ Este comando sirve para comprar tu McLaren 720s (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧.
> ✦ Precio: 10000 Yenes
> ✦ Color: Naranja
`;
let mention = conn.parseMention(txt);
try {
const image = await Jimp.read("./src/doc_image.jpg");
    image.resize(400, 400);
    const imager = await image.getBufferAsync(Jimp.MIME_JPEG);

let img = await fs.readFile("./src/menu.jpg");

    await conn.sendMessage(
      m.chat,
      {
        document: img,
        fileName: "ᥡᥙkі sᥙ᥆ᥙ",
        mimetype: "image/png",
        caption: txt,
        fileLength: 1900,
        jpegThumbnail: imager,
        contextInfo: {
          mentionedJid: mention,
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "",
            body: `あ ${wm}`,
            thumbnail: img,
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
    );
  } catch (e) {
  conn.reply(m.chat, txt, m, { mentions: mention })
    conn.reply(m.chat, "❎ Error al mostrar el menú principal : " + e, m);
  }
};
handler.command = ["menu", "help", "menú", "commands", "comandos", "?"];
export default handler;
