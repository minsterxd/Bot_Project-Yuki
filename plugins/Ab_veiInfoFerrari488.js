import { promises as fs } from 'fs';

let handler = async (m, { conn, usedPrefix, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    m.react("🏎️");
    let txt = `Hola! Soy *ᥡᥙkі sᥙ᥆ᥙ* (｡•̀ᴗ-)✧
Veo que estas interesado en la Ferrari 488 Pista, eh? 
Aqui tienes la información! (⁠◠⁠‿⁠・⁠)⁠—⁠☆
╭┈ ↷
│ᰔ Cliente » @${userId.split('@')[0]}
╰─────────────────

• :･ﾟ⊹˚• \`『 Info sobre 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 La Ferrari 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 488  Pista 』\` •˚⊹:･ﾟ•

Bueno, *según mi amigo ChatGPT*, esta es la información sobre el McLaren 720s 🚗:
La Ferrari 488 Pista es una versión más radical del 488 GTB, presentada en 2018. Está equipado con un motor V8 biturbo de 3.9 litros que entrega 720 caballos de fuerza, permitiéndole acelerar de 0 a 100 km/h en 2.85 segundos. Su nombre "Pista" (pista de carreras en italiano) refleja su enfoque en el rendimiento en circuito. Destaca por su peso reducido, aerodinámica optimizada y tecnología derivada de la F1, ofreciendo una experiencia de conducción extrema y precisa.

• :･ﾟ⊹˚• \`『  Detalles 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  de   la  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  Ferrari  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 488 Pista 』\` •˚⊹:･ﾟ•

❍ Acerca de la Ferrari 488 Pista:
ᰔᩚ *Detalles*
> ✦ Precio: 10000 Yenes
> ✦ Color: Rojo

❍ Comprar a la Ferrari 488 Pista:
ᰔᩚ *#Comprar_Ferrari488Pista*
> ✦ Este comando sirve para comprar tu Ferrari 488 Pista (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧.
`;
let mention = conn.parseMention(txt);
try {
let img = await fs.readFile("./src/Ferrari488Pista.jpg");

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
handler.command = ["info_ferrari488pista"];
export default handler;
