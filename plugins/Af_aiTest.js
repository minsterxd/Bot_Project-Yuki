import fs from 'fs/promises'
import { createHash } from 'crypto'
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

  // Ver si se debe hacer resumen
  if (mensajesChat[chatId].length >= MAX_MENSAJES || tiempoInactivo >= UMBRAL_INACTIVIDAD) {
    await hacerResumen(chatId, mensajesChat[chatId])
    mensajesChat[chatId] = []
  }

  // === 🧠 Disparadores naturales para que Yuki responda sin comando ===
  const textoLower = texto.toLowerCase()
  const nombreBot = (global.botname || 'yuki').toLowerCase()
  const mencionanABot = textoLower.includes(nombreBot)

  const patrones = [
    /recuerdas\b/,
    /te acuerdas\b/,
    /recordás\b/,
    /\byuki\b/,
  ]

  const debeResponder = patrones.some(rx => rx.test(textoLower)) || mencionanABot

  if (debeResponder) {
    const recuerdo = buscarRecuerdo(chatId, textoLower)
    const respuesta = await responderConIA(texto, recuerdo)
    if (respuesta) {
      await conn.sendMessage(chatId, { text: respuesta }, { quoted: m })
    }
  }
}

async function hacerResumen(chatId, mensajes) {
  const contenido = mensajes.map(m => m.texto).join('\n')
  const prompt = `Haz un resumen breve de la siguiente conversación:\n\n${contenido}`

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
    return res.data?.result || "No tengo idea."
  } catch (e) {
    console.error("❌ Error al consultar IA:", e)
    return "Hubo un problema al intentar pensar eso."
  }
}

async function responderConIA(texto, recuerdo) {
  const prompt = `Tú eres una bot llamada Yuki. Eres divertida, amable y curiosa. Estás en un grupo de WhatsApp.

Este es el mensaje recibido:
"${texto}"

Este es un recuerdo relevante:
"${recuerdo || 'No hay recuerdo relevante'}"

Responde de forma natural y amable.`
  return await pedirAIA(prompt)
}

export default {
  all: handlerChat
}
