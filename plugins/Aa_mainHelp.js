import Jimp from "jimp";
import { promises as fs } from 'fs';

let handler = async (m, { conn, usedPrefix, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    m.react("🍂");
    let txt = `🍄 ${ucapan()}, @${m.sender.split("@")[0]} !

Hola! Soy *ᥡᥙkі sᥙ᥆ᥙ* (｡•̀ᴗ-)✧
Aquí tienes la lista de comandos
╭┈ ↷
│ᰔᩚ Cliente » @${userId.split('@')[0]}
│❀ Modo » Publico
│✦ Bot » ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
│ⴵ Activada » ${uptime}
│✰ Usuarios » ${totalreg}
│✧ Comandos » ${totalCommands}
│🜸 Baileys » Multi Device
╰─────────────────
Crea un *Sub-Bot* con tu número utilizando *#qr* o *#code*

• :･ﾟ⊹˚• \`『 Comandos 』\` •˚⊹:･ﾟ•

❍ Categorías:
ᰔᩚ *#ListaInfo*
> ✦ Comandos para ver el estado e información de la bot.
ᰔᩚ *#ListaBuscadores*
> ✦ Comandos para realizar búsquedas en distintas plataformas.
ᰔᩚ *#ListaDescargas*
> ✦ Comandos de descargas para varios archivos.
ᰔᩚ *#ListaEco*
> ✦ Comandos de economía y rpg para ganar dinero y otros recursos.
ᰔᩚ *#ListaGacha*
> ✦ Comandos de gacha para reclamar y colecciónar personajes.
ᰔᩚ *#ListaStickers*
> ✦ Comandos para creaciones de stickers, etc.
ᰔᩚ *#ListaTools*
> ✦ Comandos de herramientas con muchas funciones.
ᰔᩚ *#ListaPerfil*
> ✦ Comandos de perfil para ver, configurar y comprobar estados de tu perfil.
ᰔᩚ *#ListaGrupos*
> ✦ Comandos de grupos para una mejor gestión de ellos.
ᰔᩚ *#ListaAnime*
> ✦ Comandos de reacciones de anime.
ᰔᩚ *#ListaJuegos*
> ✦ Comandos de juegos para jugar con tus amigos.
ᰔᩚ *#ListaSuperautos*
> ✦ Comandos para poder ver información acerca del sistema de vehículos de la bot.
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

function ucapan() {
  const time = moment.tz("America/Los_Angeles").format("HH");
  if (time >= 18) return "Buenas noches.";
  if (time >= 15) return "Buenas tardes.";
  if (time >= 10) return "Buenas tardes.";
  if (time >= 4) return "Buenos días.";
  return "Hola.";
};

global.style = async function styles(text, style = 1) {
  var replacer = [];
  xStr.map((v, i) =>
    replacer.push({
      original: v,
      convert: yStr[style][i],
    })
  );
  var str = text.toLowerCase().split("");
  var output = [];
  str.map((v) => {
    const find = replacer.find((x) => x.original == v);
    find ? output.push(find.convert) : output.push(v);
  });
  return output.join("");
};

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
};
