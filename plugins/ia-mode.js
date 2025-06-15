import fetch from 'node-fetch'

async function callModeIA(text) {
  let response = await fetch(`https://mode-ia.onrender.com/mode-ia?prompt=${encodeURIComponent(text)}`)
  let data = await response.json()
  if (!data.response) throw 'Sin respuesta válida'
  return data.response.trim()
}

// Handler 1: con prefijo (como .mode, .ia)
var handlerPrefix = async (m, { text }) => {
  if (!text) return conn.reply(m.chat, `✨ Ingrese una petición para que Mode IA lo responda.`, m)
  try {
    await m.react('✨')
    conn.sendPresenceUpdate('composing', m.chat)
    let reply = await callModeIA(text)
    await m.reply(reply)
  } catch (e) {
    await m.react('🌟')
    await conn.reply(m.chat, `💢 Mode IA no puede responder a esa pregunta.`, m)
  }
}

handlerPrefix.command = ['modeia', 'mode', 'ia']
handlerPrefix.help = ['modeia']
handlerPrefix.tags = ['ai']
handlerPrefix.group = true
handlerMention.command = new RegExp // evita conflicto
handlerMention.customPrefix = /^@(?:ia|modeia|mode)/i
handlerMention.nonPrefix = true
handlerMention.group = true

export default [handlerPrefix, handlerMention]