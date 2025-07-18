let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    
    let txt = `
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
  `.trim()

  await conn.sendMessage(m.chat, { 
      text: txt,
      contextInfo: {
          mentionedJid: [m.sender, userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: channelRD.id,
              newsletterName: channelRD.name,
              serverMessageId: -1,
          },
      },
  }, { quoted: m })

}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
