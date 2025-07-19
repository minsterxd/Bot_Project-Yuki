import Jimp from "jimp";
import { promises as fs } from 'fs';

let handler = async (m, { conn, usedPrefix }) => {
    m.react("🍂");
    let name = await conn.getName(m.sender);
    let txt = `🍄 ${ucapan()}, @${m.sender.split("@")[0]} !

Hola! Soy *${botname}* (｡•̀ᴗ-)✧
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
        fileName: "ѕуℓρнιєттє'ѕ",
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
      { quoted: m }
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
  if (time >= 18) return "Good night.";
  if (time >= 15) return "Good afternoon.";
  if (time >= 10) return "Good afternoon.";
  if (time >= 4) return "Good morning.";
  return "Hello.";
}
var xStr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
var yStr = Object.freeze({
1: ['ᴀ', 'ʙ', 'ᴄ', 'ᴅ', 'ᴇ', 'ꜰ', 'ɢ', 'ʜ', 'ɪ', 'ᴊ', 'ᴋ', 'ʟ', 'ᴍ', 'ɴ', 'ᴏ', 'ᴘ', 'q', 'ʀ', 'ꜱ', 'ᴛ', 'ᴜ', 'ᴠ', 'ᴡ', 'x', 'ʏ', 'ᴢ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
2: ['𝑎', '𝑏', '𝑐', '𝑑', '𝑒', '𝑓', '𝑔', 'ℎ', '𝑖', '𝑗', '𝑘', '𝑙', '𝑚', '𝑛', '𝑜', '𝑝', '𝑞', '𝑟', '𝑠', '𝑡', '𝑢', '𝑣', '𝑤', '𝑥', '𝑦', '𝑧', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
3: ['𝐚', '𝐛', '𝐜', '𝐝', '𝐞', '𝐟', '𝐠', '𝐡', '𝐢', '𝐣', '𝐤', '𝐥', '𝐦', '𝐧', '𝐨', '𝐩', '𝐪', '𝐫', '𝐬', '𝐭', '𝐮', '𝐯', '𝐰', '𝐱', '𝐲', '𝐳', '𝟏', '𝟐', '𝟑', '𝟒', '𝟓', '𝟔', '𝟕', '𝟖', '𝟗', '𝟎'],
4: ['𝒂', '𝒃', '𝒄', '𝒅', '𝒆', '𝒇', '𝒈', '𝒉', '𝒊', '𝒋', '𝒌', '𝒍', '𝒎', '𝒏', '𝒐', '𝒑', '𝒒', '𝒓', '𝒔', '𝒕', '𝒖', '𝒗', '𝒘', '𝒙', '𝒚', '𝒛', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
5: ['𝗮', '𝗯', '𝗰', '𝗱', '𝗲', '𝗳', '𝗴', '𝗵', '𝗶', '𝗷', '𝗸', '𝗹', '𝗺', '𝗻', '𝗼', '𝗽', '𝗾', '𝗿', '𝘀', '𝘁', '𝘂', '𝘃', '𝘄', '𝘅', '𝘆', '𝘇', '𝟭', '𝟮', '𝟯', '𝟰', '𝟱', '𝟲', '𝟳', '𝟴', '𝟵', '𝟬'],
6: ['ᵃ', 'ᵇ', 'ᶜ', 'ᵈ', 'ᵉ', 'ᶠ', 'ᵍ', 'ʰ', 'ⁱ', 'ʲ', 'ᵏ', 'ˡ', 'ᵐ', 'ⁿ', 'ᵒ', 'ᵖ', 'ᵠ', 'ʳ', 'ˢ', 'ᵗ', 'ᵘ', 'ᵛ', 'ʷ', 'ˣ', 'ʸ', 'ᶻ', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁰'],
7: ['ᗩ', 'ᗷ', 'ᑕ', 'ᗪ', 'ᗴ', 'ᖴ', 'ᘜ', 'ᕼ', 'I', 'ᒍ', 'K', 'ᒪ', 'ᗰ', 'ᑎ', 'O', 'ᑭ', 'ᑫ', 'ᖇ', 'Տ', 'T', 'ᑌ', 'ᐯ', 'ᗯ', '᙭', 'Y', 'ᘔ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
8: ['𝙖', '𝙗', '𝙘', '𝙙', '𝙚', '𝙛', '𝙜', '𝙝', '𝙞', '𝙟', '𝙠', '𝙡', '𝙢', '𝙣', '𝙤', '𝙥', '𝙦', '𝙧', '𝙨', '𝙩', '𝙪', '𝙫', '𝙬', '𝙭', '𝙮', '𝙯', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
9: ['𝘢', '𝘣', '𝘤', '𝘥', '𝘦', '𝘧', '𝘨', '𝘩', '𝘪', '𝘫', '𝘬', '𝘭', '𝘮', '𝘯', '𝘰', '𝘱', '𝘲', '𝘳', '𝘴', '𝘵', '𝘶', '𝘷', '𝘸', '𝘹', '𝘺', '𝘻', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
10: ['𝖺', '𝖻', '𝖼', '𝖽', '𝖾', '𝖿', '𝗀', '𝗁', '𝗂', '𝗃', '𝗄', '𝗅', '𝗆', '𝗇', '𝗈', '𝗉', '𝗊', '𝗋', '𝗌', '𝗍', '𝗎', '𝗏', '𝗐', '𝗑', '𝗒', '𝗓', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
11: ['Ⓐ︎', 'Ⓑ', '︎Ⓒ', '︎Ⓓ︎', 'Ⓔ︎', 'Ⓕ︎', 'Ⓖ︎', 'Ⓗ︎', 'Ⓘ︎', 'Ⓙ︎', 'Ⓚ︎', 'Ⓛ︎', 'Ⓜ︎', 'Ⓝ︎', 'Ⓞ︎', 'Ⓟ', '︎Ⓠ︎', 'Ⓡ︎', 'Ⓢ', '︎Ⓣ︎', 'Ⓤ︎', 'Ⓥ︎', 'Ⓦ︎', 'Ⓧ︎', 'Ⓨ︎', 'Ⓩ︎', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
12: ['🅐︎', '🅑︎', '🅒', '︎🅓︎', '🅔︎', '🅕︎', '🅖︎', '🅗', '︎🅘︎', '🅙︎', '🅚', '︎🅛︎', '🅜', '︎🅝︎', '🅞', '︎🅟', '︎🅠︎', '🅡︎', '🅢', '︎🅣', '︎🅤', '︎🅥︎', '🅦︎', '🅧︎', '🅨︎', '🅩︎', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
13: ['𝓪', '𝓫', '𝓬', '𝓭', '𝓮', '𝓯', '𝓰', '𝓱', '𝓲', '𝓳', '𝓴', '𝓵', '𝓶', '𝓷', '𝓸', '𝓹', '𝓺', '𝓻', '𝓼', '𝓽', '𝓾', '𝓿', '𝔀', '𝔁', '𝔂', '𝔃', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
14: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ', 'ⓕ', 'ⓖ', 'ⓗ', 'ⓘ', 'ⓙ', 'ⓚ', 'ⓛ', 'ⓜ', 'ⓝ', 'ⓞ', 'ⓟ', 'ⓠ', 'ⓡ', 'ⓢ', 'ⓣ', 'ⓤ', 'ⓥ', 'ⓦ', 'ⓧ', 'ⓨ', 'ⓩ', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⓪'],
15: ['𝚊', '𝚋', '𝚌', '𝚍', '𝚎', '𝚏', '𝚐', '𝚑', '𝚒', '𝚓', '𝚔', '𝚕', '𝚖', '𝚗', '𝚘', '𝚙', '𝚚', '𝚛', '𝚜', '𝚝', '𝚞', '𝚟', '𝚠', '𝚡', '𝚢', '𝚣', '𝟷', '𝟸', '𝟹', '𝟺', '𝟻', '𝟼', '𝟽', '𝟾', '𝟿', '𝟶'],
16: ['🄰', '🄱', '🄲', '🄳', '🄴', '🄵', '🄶', '🄷', '🄸', '🄹', '🄺', '🄻', '🄼', '🄽', '🄾', '🄿', '🅀', '🅁', '🅂', '🅃', '🅄', '🅅', '🅆', '🅇', '🅈', '🅉', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⓪'],
17: ['𝕒', '𝕓', '𝕔', '𝕕', '𝕖', '𝕗', '𝕘', '𝕙', '𝕚', '𝕛', '𝕜', '𝕝', '𝕞', '𝕟', '𝕠', '𝕡', '𝕢', '𝕣', '𝕤', '𝕥', '𝕦', '𝕧', '𝕨', '𝕩', '𝕪', '𝕫', '𝟙', '𝟚', '𝟛', '𝟜', '𝟝', '𝟞', '𝟟', '𝟠', '𝟡', '𝟘'],
18: ['【a】', '【b】', '【c】', '【d】', '【e】', '【f】', '【g】', '【h】', '【i】', '【j】', '【k】', '【l】', '【m】', '【n】', '【o】', '【p】', '【q】', '【r】', '【s】', '【t】', '【u】', '【v】', '【w】', '【x】', '【y】', '【z】', '【1】', '【2】', '【3】', '【4】', '【5】', '【6】', '【7】', '【8】', '【9】', '【0】'],
19: ['ａ', 'ｂ', 'ｃ', 'ｄ', 'ｅ', 'ｆ', 'ｇ', 'ｈ', 'ｉ', 'ｊ', 'ｋ', 'ｌ', 'ｍ', 'ｎ', 'ｏ', 'ｐ', 'ｑ', 'ｒ', 'ｓ', 'ｔ', 'ｕ', 'ｖ', 'ｗ', 'ｘ', 'ｙ', 'ｚ', '１', '２', '３', '４', '５', '６', '７', '８', '９', '０'],
20: ['𝖆', '𝖇', '𝖈', '𝖉', '𝖊', '𝖋', '𝖌', '𝖍', '𝖎', '𝖏', '𝖐', '𝖑', '𝖒', '𝖓', '𝖔', '𝖕', '𝖖', '𝖗', '𝖘', '𝖙', '𝖚', '𝖛', '𝖜', '𝖝', '𝖞', '𝖟', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
})

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

global.menu = async function getMenu() {
  let text = "";
  let help = Object.values(global.plugins)
    .filter((plugin) => !plugin.disabled)
    .map((plugin) => {
      return {
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      };
    });

  let tags = {};
  for (let plugin of help) {
    if (plugin && plugin.tags) {
      for (let tag of plugin.tags) {
        if (tag) tags[tag] = tag.toUpperCase();
      }
    }
  }
  for (let category of Object.keys(tags)) {
    let cmds = await Promise.all(help
      .filter(
        (menu) => menu.tags && menu.tags.includes(category) && menu.help
      )
      .map(async (menu) => {
        return await Promise.all(menu.help
          .map(async (cmd) => `𖦹 𓈒 \`${await style(cmd, 10)}\``));
      }));

    if (cmds.length > 0) {
      text += `乂 \`${await style(tags[category], 7)}\`\n\n${cmds.map(cmdArray => cmdArray.join('\n')).join('\n')}\n\n`;
    }
  }
  text += `\`${footer}\``;
  global.menutext = text;
};
