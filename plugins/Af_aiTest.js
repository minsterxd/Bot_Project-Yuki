import fs from 'fs/promises'
import axios from 'axios'

let memoriaPath = './memoria.json'
let memoria = {}

// Cargar memoria al inicio
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

async function handlerChat(m) {
  const conn = m.conn
  if (!m.message || m.key.fromMe || m.isGroup !== true) return

  const chatId = m.chat
  const texto = m.text || m.message.conversation || ''
  const usuario = m.sender
  const ahora = Date.now()

  // Inicializar buffers
  mensajesChat[chatId] = mensajesChat[chatId] || []
  tiempoUltimoMensaje[chatId] = tiempoUltimoMensaje[chatId] || ahora

  mensajesChat[chatId].push({ texto, usuario, timestamp: ahora })
  const tiempoInactivo = ahora - tiempoUltimoMensaje[chatId]
  tiempoUltimoMensaje[chatId] = ahora

  // Resumir si toca
  if (mensajesChat[chatId].length >= MAX_MENSAJES || tiempoInactivo >= UMBRAL_INACTIVIDAD) {
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

  const respondeABot = m.quoted && m.quoted.sender && m.quoted.sender.endsWith('@s.whatsapp.net') &&
    m.quoted.sender.includes(global.conn?.user?.split(':')[0])

  const debeResponder = patrones.some(rx => rx.test(textoLower)) || mencionanBot || respondeABot

  if (debeResponder) {
    const recuerdo = buscarRecuerdo(chatId, textoLower)
    const respuestas = await responderConIA(texto, recuerdo)
    if (respuestas.length > 0) {
      for (const r of respuestas) {
        await conn.sendMessage(chatId, { text: r }, { quoted: m })
        await new Promise(res => setTimeout(res, 600)) // Espera corta entre mensajes
      }
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

async function responderConIA(texto, recuerdo) {
  const prompt = `
Tú eres una bot llamada Yuki. Eres joven, divertida, informal y hablas como una persona común. Responde con frases cortas y sin usar muchos emojis (usa como máximo 1 ocasionalmente).

Este es el mensaje recibido:
"${texto}"

Recuerdo relevante: "${recuerdo || 'No hay recuerdo relevante'}"

Responde como si estuvieras en una conversación de WhatsApp normal. Si corresponde, puedes dividir tu respuesta en varias frases cortas (máximo 5), como si fueran mensajes enviados por separado.
`

  const respuestaLarga = await pedirAIA(prompt)

  // Dividir la respuesta en frases (máximo 5)
  let frases = respuestaLarga
    .split(/(?<=[.?!])\s+/) // Separar por oraciones
    .map(f => f.trim())
    .filter(f => f.length > 0)
    .slice(0, 5) // Limitar a 5 respuestas

  return frases
}

export default {
  all: handlerChat
}
