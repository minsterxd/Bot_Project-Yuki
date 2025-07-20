import { promises as fs } from 'fs';

let handler = async (m, { conn, usedPrefix, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    m.react("🏎️");
    let txt = `Hola! Soy *ᥡᥙkі sᥙ᥆ᥙ* (｡•̀ᴗ-)✧
Veo que estas interesado en el McLaren 720s, eh? 
Aqui tienes la información! (⁠◠⁠‿⁠・⁠)⁠—⁠☆
╭┈ ↷
│ᰔ Cliente » @${userId.split('@')[0]}
╰─────────────────

• :･ﾟ⊹˚• \`『 Info sobre 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『 el McLaren 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『    720s    』\` •˚⊹:･ﾟ•

Bueno, *según mi amigo ChatGPT*, esta es la información sobre el McLaren 720s 🚗:
El McLaren 720S es un superdeportivo británico lanzado en 2017, parte de la Serie Super de McLaren. Equipa un motor V8 biturbo de 4.0 litros que produce 720 caballos de fuerza, lo que le permite acelerar de 0 a 100 km/h en 2.9 segundos. Destaca por su diseño aerodinámico, puertas tipo diédricas y chasis de fibra de carbono, ofreciendo un equilibrio impresionante entre rendimiento extremo y manejo refinado.

• :･ﾟ⊹˚• \`『 Detalles 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『    del   』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  McLaren 』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  720s a  』\` •˚⊹:･ﾟ•
• :･ﾟ⊹˚• \`『  comprar 』\` •˚⊹:･ﾟ•

❍ Acerca del McLaren 720s:
ᰔᩚ *Detalles*
> ✦ Precio: 10000 Yenes
> ✦ Color: Naranja

❍ Comprar el McLaren 720s:
ᰔᩚ *#Comprar_McLaren720s*
> ✦ Este comando sirve para comprar tu McLaren 720s (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧.
`;
let mention = conn.parseMention(txt);
try {
let img = await fs.readFile("./src/autos/super/McLaren720s.jpg");

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
handler.command = ["info_mclaren720s"];
export default handler;
