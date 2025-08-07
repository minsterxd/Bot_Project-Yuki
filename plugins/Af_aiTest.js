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

const mensajesPendientes = {}
const temporizadores = {}

async function handlerChat(m) {
  const conn = m.conn
  if (!m.message || m.key.fromMe || !m.isGroup) return

  const chatId = m.chat
  const usuario = m.sender
  const texto = m.text || m.message.conversation || ''
  const ahora = Date.now()

  mensajesChat[chatId] = mensajesChat[chatId] || []
  tiempoUltimoMensaje[chatId] = ahora

  // Guardar mensaje globalmente para resumen
  mensajesChat[chatId].push({ texto, usuario, timestamp: ahora })

  // Guardar mensaje por usuario para análisis posterior
  mensajesPendientes[chatId] = mensajesPendientes[chatId] || {}
  mensajesPendientes[chatId][usuario] = mensajesPendientes[chatId][usuario] || []
  mensajesPendientes[chatId][usuario].push(texto)

  // Cancelar temporizador anterior si existe
  if (temporizadores[chatId]?.[usuario]) {
    clearTimeout(temporizadores[chatId][usuario])
  }

  // Crear nuevo temporizador
  temporizadores[chatId] = temporizadores[chatId] || {}
  temporizadores[chatId][usuario] = setTimeout(async () => {
    const mensajesUsuario = mensajesPendientes[chatId][usuario]
    delete mensajesPendientes[chatId][usuario] // Limpiar

    const contextoReciente = mensajesChat[chatId]
      .slice(-8)
      .map(m => `• ${m.usuario}: ${m.texto}`)
      .join('\n')

    const recuerdo = buscarRecuerdo(chatId, mensajesUsuario.join(' ').toLowerCase())
    const decision = await decidirResponder(mensajesUsuario.join('\n'), contextoReciente, recuerdo)

    if (decision.responder && decision.respuesta) {
      await conn.sendMessage(chatId, { text: decision.respuesta })
    }

  }, 15 * 1000) // 15 segundos
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

async function decidirResponder(texto, contexto, recuerdo) {
  const prompt = `
Eres Yuki, una bot joven, divertida y social, que participa en grupos de WhatsApp como si fueras una persona más. No eres moderadora, ni protagonista.

Solo debes responder si se cumplen una o más de estas condiciones:
- Te mencionan explícitamente (ej: "Yuki", "bot", "ia", etc.)
- Alguien parece estar hablándote directamente (ej: te hacen una pregunta o te saludan)
- La conversación se queda en silencio o parece que podrías sumar algo **sin interrumpir**
- O si ocurre algo gracioso, tierno o llamativo y tu comentario podría aportar valor.

❌ No debes responder si:
- Las personas están conversando entre sí claramente
- Nadie parece dirigirse a ti
- El mensaje es muy corto o no tiene contexto
- No tienes nada realmente interesante que decir

Este es el último mensaje recibido:
"${texto}"

Últimos mensajes del grupo:
${contexto}

Recuerdo relevante: "${recuerdo || 'No hay recuerdo relevante'}"

¿Deberías responder? Si sí, responde con un JSON como este:
{
  "responder": true,
  "respuesta": "Tu respuesta aquí"
}

Si no deberías decir nada, responde:
{
  "responder": false
}`

  try {
    const raw = await pedirAIA(prompt)
    const parsed = JSON.parse(raw)
    return parsed
  } catch (e) {
    console.error("⚠️ Error al decidir si responder:", e)
    return { responder: false }
  }
}

export default {
  all: handlerChat
}
