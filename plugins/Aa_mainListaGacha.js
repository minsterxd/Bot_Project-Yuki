let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    
    let txt = `
• :･ﾟ⊹˚• \`『 Gacha 』\` •˚⊹:･ﾟ•

❍ Comandos de gacha para reclamar y colecciónar personajes.
ᰔᩚ *#rollwaifu • #rw • #roll*
> ✦ Waifu o husbando aleatorio.
ᰔᩚ  *#claim • #c • #reclamar*
> ✦ Reclamar un personaje.
ᰔᩚ *#harem • #waifus • #claims*
> ✦ Ver tus personajes reclamados.
ᰔᩚ *#charimage • #waifuimage • #wimage* 
> ✦ Ver una imagen aleatoria de un personaje.
ᰔᩚ *#charinfo • #winfo • #waifuinfo*
> ✦ Ver información de un personaje.
ᰔᩚ *#givechar • #givewaifu • #regalar*
> ✦ Regalar un personaje a otro usuario.
ᰔᩚ *#vote • #votar*
> ✦ Votar por un personaje para subir su valor.
ᰔᩚ *#waifusboard • #waifustop • #topwaifus*
> ✦ Ver el top de personajes con mayor valor.
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
handler.command = ['ListaGacha']

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
