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

• :･ﾟ⊹˚• \`『  Comandos  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  sobre la  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  info  de  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 los  super 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 deportivos 』\` •˚⊹:･ﾟ•

❍ Info de los superdeportivos:
ᰔᩚ *#Info_McLaren720s*
> ✦ Puedes ver una foto y la información del McLaren 720s.
ᰔᩚ *#Info_Ferrari488*
> ✦ Puedes ver una foto y la información del Ferrari 488 Pista.
ᰔᩚ *#Info_LamboAveSVG*
> ✦ Puedes ver una foto y la información del Lamborghini Aventador SVG.

• :･ﾟ⊹˚• \`『  Comandos  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『    para    』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『   comprar  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  tu super  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  deportivo 』\` •˚⊹:･ﾟ•

❍ Comprar los superdeportivos:
ᰔᩚ *#Comprar_McLaren720s*
> ✦ Este comando sirve para comprar tu McLaren 720s (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧.
> ✦ Precio: 10000 Yenes
> ✦ Color: Naranja
ᰔᩚ *#Comprar_Ferrari488*
> ✦ Este comando sirve para comprar tu Ferrari 488 Pista (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧.
> ✦ Precio: 10000 Yenes
> ✦ Color: Rojo
ᰔᩚ *#Comprar_LamboAveSVG*
> ✦ Este comando sirve para comprar tu Lamborghini Aventador SVG (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧.
> ✦ Precio: 10000 Yenes
> ✦ Color: Verde

• :･ﾟ⊹˚• \`『 Misceláneo 』\` •˚⊹:･ﾟ•

❍ Así es, tambien puedes hacer *drifting*.
ᰔᩚ *#Drift_(auto)* 
> ✦ Con este comando puedes hacer drift con cualquiera de los autos, solamente gastando un uso del total del auto.
ᰔᩚ *#Garaje*
> ✦ Con este comando puedes ver tus vehículos disponibles y información sobre su estado general. (en desarrollo)
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
handler.command = ["listasuperautos"];
export default handler;
