let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    
    let txt = `
• :･ﾟ⊹˚• \`『 Juegos 』\` •˚⊹:･ﾟ•

❍ Comandos de juegos para jugar con tus amigos.
ᰔᩚ *#amistad • #amigorandom* 
> ✦ hacer amigos con un juego. 
ᰔᩚ *#chiste*
> ✦ La bot te cuenta un chiste.
ᰔᩚ *#consejo* 
> ✦ La bot te da un consejo. 
ᰔᩚ *#doxeo • #doxear* + <mencion>
> ✦ Simular un doxeo falso.
ᰔᩚ *#facto*
> ✦ La bot te lanza un facto. 
ᰔᩚ *#formarpareja*
> ✦ Forma una pareja. 
ᰔᩚ *#formarpareja5*
> ✦ Forma 5 parejas diferentes.
ᰔᩚ *#frase*
> ✦ La bot te da una frase.

ᰔᩚ *#aplauso* + <mencion>
> ✦ Aplaudirle a alguien.
ᰔᩚ *#marron* + <mencion>
> ✦ Burlarte del color de piel de un usuario. 
ᰔᩚ *#suicidar*
> ✦ Suicidate. 
ᰔᩚ *#iq • #iqtest* + <mencion>
> ✦ Calcular el iq de alguna persona. 
ᰔᩚ *#meme*
> ✦ La bot te envía un meme aleatorio. 
ᰔᩚ *#morse*
> ✦ Convierte un texto a codigo morse. 
ᰔᩚ *#nombreninja*
> ✦ Busca un nombre ninja aleatorio.
ᰔᩚ *#personalidad* + <mencion>
> ✦ La bot busca tu personalidad. 
ᰔᩚ *#piropo*
> ✦ Lanza un piropo.
ᰔᩚ *#pregunta*
> ✦ Hazle una pregunta a la bot.
ᰔᩚ *#ship • #pareja*
> ✦ La bot te da la probabilidad de enamorarte de una persona. 
ᰔᩚ *#sorteo*
> ✦ Empieza un sorteo. 
ᰔᩚ *#top*
> ✦ Empieza un top de personas.
ᰔᩚ *#ahorcado*
> ✦ Diviertete con la bot jugando el juego ahorcado.
ᰔᩚ *#mates • #matematicas*
> ✦ Responde las preguntas de matemáticas para ganar recompensas.
ᰔᩚ *#ppt*
> ✦ Juega piedra papel o tijeras con la bot.
ᰔᩚ *#sopa • #buscarpalabra*
> ✦ Juega el famoso juego de sopa de letras.
ᰔᩚ *#pvp • #suit* + <mencion>
> ✦ Juega un pvp contra otro usuario.
ᰔᩚ *#ttt*
> ✦ Crea una sala de juego.
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

handler.help = ['listajuegos']
handler.tags = ['main']
handler.command = ['listajuegos']

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
