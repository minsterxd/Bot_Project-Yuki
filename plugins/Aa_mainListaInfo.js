let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    
    let txt = `
• :･ﾟ⊹˚• \`『 Info-Bot 』\` •˚⊹:･ﾟ•

❍ Comandos para ver estado e información de la Bot.
ᰔᩚ *#help • #menu*
> ✦ Ver la lista de comandos de la Bot.
ᰔᩚ *#uptime • #runtime*
> ✦ Ver tiempo activo o en linea de la Bot.
ᰔᩚ *#sc • #script*
> ✦ Link del repositorio oficial de la Bot
ᰔᩚ *#staff • #colaboradores*
> ✦ Ver la lista de desarrolladores de la Bot.
ᰔᩚ *#serbot • #serbot code*
> ✦ Crea una sesión de Sub-Bot.
ᰔᩚ *#bots • #sockets*
> ✦ Ver la lista de Sub-Bots activos.
ᰔᩚ *#creador*
> ✦ Contacto del creador de la Bot.
ᰔᩚ *#status • #estado*
> ✦ Ver el estado actual de la Bot.
ᰔᩚ *#links • #grupos*
> ✦ Ver los enlaces oficiales de la Bot.
ᰔᩚ *#infobot • #infobot*
> ✦ Ver la información completa de la Bot.
ᰔᩚ *#sug • #newcommand*
> ✦ Sugiere un nuevo comando.
ᰔᩚ *#p • #ping*
> ✦ Ver la velocidad de respuesta del Bot.
ᰔᩚ *#reporte • #reportar*
> ✦ Reporta alguna falla o problema de la Bot.
ᰔᩚ *#sistema • #system*
> ✦ Ver estado del sistema de alojamiento.
ᰔᩚ *#speed • #speedtest*
> ✦ Ver las estadísticas de velocidad de la Bot.
ᰔᩚ *#views • #usuarios*
> ✦ Ver la cantidad de usuarios registrados en el sistema.
ᰔᩚ *#funciones • #totalfunciones*
> ✦ Ver todas las funciones de la Bot.
ᰔᩚ *#ds • #fixmsgespera*
> ✦ Eliminar archivos de sesión innecesarios.
ᰔᩚ *#editautoresponder*
> ✦ Configurar un Prompt personalizado de la Bot.
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

handler.help = ['listainfo']
handler.tags = ['main']
handler.command = ['listainfo']

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
