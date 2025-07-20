import { promises as fs } from 'fs';

let handler = async (m, { conn, usedPrefix, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    m.react("🏎️");
    let txt = `Hola! Soy *ᥡᥙkі sᥙ᥆ᥙ* (｡•̀ᴗ-)✧
Veo que estas interesado en el Lamborghini Aventador SVJ, eh? 
Aqui tienes la información! (⁠◠⁠‿⁠・⁠)⁠—⁠☆
╭┈ ↷
│ᰔ Cliente » @${userId.split('@')[0]}
╰─────────────────

• :･ﾟ⊹˚• \`『 Info  sobre 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『     el      』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 Lamborghini 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  Aventador  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『     SVJ     』\` •˚⊹:･ﾟ•

Bueno, *según mi amigo ChatGPT*, esta es la información sobre el Lamborghini Aventador SVJ 🚗:


• :･ﾟ⊹˚• \`『   Detalles  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『     del     』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 Lamborghini 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  Aventador  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『    SVJ a    』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『   comprar   』\` •˚⊹:･ﾟ•

❍ Acerca del Lamborghini Aventador SVJ:
ᰔᩚ *Detalles*
> ✦ Precio: 10000 Yenes
> ✦ Color: Verde

❍ Comprar el Lamborghini Aventador SVJ:
ᰔᩚ *#Comprar_LamboAveSVJ*
> ✦ Este comando sirve para comprar tu Lamborghini Aventador SVJ (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧.
`;
let mention = conn.parseMention(txt);
try {
let img = await fs.readFile("./src/McLaren720s.jpg");

    await conn.sendMessage(
      m.chat,
      {
        image: img,
        fileName: "ᥡᥙkі sᥙ᥆ᥙ",
        mimetype: "image/png",
        caption: txt,
        fileLength: 1900,
        contextInfo: {
          mentionedJid: mention,
          isForwarded: true,
          forwardingScore: 999,
        },
      },
    );
  } catch (e) {
  conn.reply(m.chat, txt, m, { mentions: mention })
    conn.reply(m.chat, "❎ Error al mostrar el menú principal : " + e, m);
  }
};
handler.command = ["info_lamboavesvj"];
export default handler;
