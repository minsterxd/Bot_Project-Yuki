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

\`『 Comandos 』\`

❍ Comandos.
ᰔᩚ *#ComprarAutos* 
> ✦ Este comando sirve para comprar tus superdeportivos favoritos.
ᰔᩚ *#VenderAutos* 
> ✦ Este comando sirve para vender los autos que ya no quieras utilizar. No recomendable usarlo.
ᰔᩚ *#Drift* 
> ✦ Con este comando puedes hacer drift con cualquiera de los autos, solamente gastando un uso del total del auto.
ᰔᩚ *#Garaje*
> ✦ Con este comando puedes ver tus vehículos disponibles, información sobre su estado general y sus mejoras.
ᰔᩚ *#Carrera @usuario*
> ✦ Juega a las carreras contra otro usuario.
ᰔᩚ *#CarreraBot (dificultad)*
> ✦ Juega a las carreras contra un bot. 
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
