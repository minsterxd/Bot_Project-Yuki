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

• :･ﾟ⊹˚• \`『 Info  sobre 』\` ˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『     el      』\` ˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 Lamborghini 』\` ˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  Aventador  』\` ˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『     SVJ     』\` ˚⊹:･ﾟ•

Bueno, *según mi amigo ChatGPT*, esta es la información sobre el Lamborghini Aventador SVJ 🚗:
El Lamborghini Aventador SVJ (Super Veloce Jota) es una versión de alto rendimiento del Aventador, lanzada en 2018. Monta un motor V12 atmosférico de 6.5 litros que produce 770 caballos de fuerza, logrando una aceleración de 0 a 100 km/h en 2.8 segundos. Destaca por su aerodinámica activa (sistema ALA), tracción total y chasis ligero. Es un superdeportivo diseñado para ofrecer máxima velocidad, agarre y emoción, con un enfoque directo en el rendimiento en pista.

• :･ﾟ⊹˚• \`『   Detalles  』\` ˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『     del     』\` ˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 Lamborghini 』\` ˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  Aventador  』\` ˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『    SVJ a    』\` ˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『   comprar   』\` ˚⊹:･ﾟ•

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
let img = await fs.readFile("./src/LamboAveSVJ.jpg");

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
