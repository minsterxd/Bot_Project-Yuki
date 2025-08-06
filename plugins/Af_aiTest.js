import fs from 'fs/promises'
import axios from 'axios'

let memoriaPath = './memoria.json'
let memoria = {}

try {
  memoria = JSON.parse(await fs.readFile(memoriaPath))
} catch {
  memoria = {}
  await fs.writeFile(memoriaPath, JSON.stringify(memoria, null, 2))
}

const UMBRAL_INACTIVIDAD = 2 * 60 * 1000 // 2 minutos
const MAX_MENSAJES = 50
let mensajesChat = {}
let tiempoUltimoMensaje = {}

setInterval(async () => {
  const ahora = Date.now()
  for (const chatId in mensajesChat) {
    const tiempo = tiempoUltimoMensaje[chatId] || 0
    if (mensajesChat[chatId]?.length > 0 && ahora - tiempo >= UMBRAL_INACTIVIDAD) {
      await hacerResumen(chatId, mensajesChat[chatId])
      mensajesChat[chatId] = []
    }
  }
}, 60 * 1000)

async function handlerChat(m) {
  const conn = m.conn
  if (!m.message || m.key.fromMe || !m.isGroup) return

  const chatId = m.chat
  const texto = m.text || m.message.conversation || ''
  const usuario = m.sender
  const ahora = Date.now()

  mensajesChat[chatId] = mensajesChat[chatId] || []
  tiempoUltimoMensaje[chatId] = tiempoUltimoMensaje[chatId] || ahora
  mensajesChat[chatId].push({ texto, usuario, timestamp: ahora })
  tiempoUltimoMensaje[chatId] = ahora

  if (mensajesChat[chatId].length >= MAX_MENSAJES) {
    await hacerResumen(chatId, mensajesChat[chatId])
    mensajesChat[chatId] = []
  }

  const textoLower = texto.toLowerCase()
  const nombreBot = (global.botname || 'yuki').toLowerCase()
  const mencionanBot = textoLower.includes(nombreBot)

  const patrones = [
    /recuerdas\b/,
    /te acuerdas\b/,
    /recordás\b/,
    /\byuki\b/,
  ]

  const botJid = conn?.user?.id?.split(':')[0] || conn?.user?.jid || ''
  const respondeABot =
    m.quoted &&
    (
      m.quoted.sender === botJid ||
      m.quoted.participant === botJid ||
      (m.quoted.id && m.quoted.id.includes(botJid))
    )

  const debeResponderPorRegla = patrones.some(rx => rx.test(textoLower)) || mencionanBot || respondeABot

  const recuerdo = buscarRecuerdo(chatId, textoLower)
  const contexto = mensajesChat[chatId].slice(-10).map(m => `- ${m.usuario}: ${m.texto}`).join('\n')

  const decision = await decidirParticipacion(texto, contexto, recuerdo)

  const debeResponder = decision?.responder || debeResponderPorRegla

  if (debeResponder && decision?.respuestas?.length) {
    for (let i = 0; i < decision.respuestas.length; i++) {
      const quotedOption = i === 0 ? { quoted: m } : {}
      await conn.sendMessage(chatId, { text: decision.respuestas[i] }, quotedOption)
      await new Promise(res => setTimeout(res, 600))
    }
  }
}

async function hacerResumen(chatId, mensajes) {
  const contenido = mensajes.map(m => m.texto).join('\n')
  const prompt = `Haz un resumen breve (1 párrafo) de la siguiente conversación:\n\n${contenido}`

  try {
    const resumen = await pedirAIA(prompt)
    const palabrasClave = extraerPalabrasClave(resumen)

    memoria[chatId] = memoria[chatId] || []
    memoria[chatId].push({
      resumen,
      palabrasClave,
      timestamp: Date.now()
    })

    await fs.writeFile(memoriaPath, JSON.stringify(memoria, null, 2))
  } catch (e) {
    console.error('❌ Error al hacer resumen:', e)
  }
}

function buscarRecuerdo(chatId, texto) {
  const recuerdos = memoria[chatId] || []
  const claves = texto.toLowerCase().match(/\b\w{4,}\b/g) || []

  for (let r of recuerdos.reverse()) {
    if (claves.some(k => r.palabrasClave.includes(k))) {
      return r.resumen
    }
  }
  return null
}

function extraerPalabrasClave(texto) {
  return [...new Set((texto.match(/\b\w{4,}\b/g) || []).slice(0, 10))].map(k => k.toLowerCase())
}

async function pedirAIA(prompt) {
  try {
    const res = await axios.post("https://Luminai.my.id", {
      content: prompt,
      user: "grupo-global",
      prompt: prompt,
      webSearchMode: false
    })
    return res.data?.result || "No estoy segura de eso."
  } catch (e) {
    console.error("❌ Error al consultar IA:", e)
    return "Algo salió mal con la respuesta."
  }
}

async function decidirParticipacion(mensaje, contexto, recuerdo) {
  const prompt = `
Eres Yuki, una bot joven e informal que forma parte de un grupo de WhatsApp. Observas las conversaciones y decides si vale la pena intervenir o no. No interrumpes si otros están hablando entre sí, pero respondes si alguien se dirige a todos o a ti.

Últimos mensajes recientes:
${contexto}

Mensaje actual:
"${mensaje}"

Recuerdo relevante:
"${recuerdo || 'No hay recuerdo relevante'}"

¿Deberías participar en esta conversación? Si sí, responde de forma casual, breve y con máximo 1 emoji si quieres. Divide tu respuesta en 1 a 5 frases si es necesario.

Responde en formato JSON válido como este:
{
  "responder": true,
  "respuestas": ["Hola! Qué bueno que estés bien", "¿Qué hicieron hoy?"]
}
`

  try {
    const respuesta = await pedirAIA(prompt)
    const data = JSON.parse(respuesta)
    return data
  } catch (e) {
    console.error('❌ Error al decidir participación:', e)
    return { responder: false, respuestas: [] }
  }
}
