import fetch from 'node-fetch'

async function callModeIA(text) {
  let response = await fetch(`https://mode-ia.onrender.com/mode-ia?prompt=${encodeURIComponent(text)}`)
  let data = await response.json()
  if (!data.response) throw 'Sin respuesta válida'
  return data.response.trim()
}

// Handler con prefijo (ej. .mode, .ia)
let handlerPrefix = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `✨ Ingrese una petición para que Mode IA lo responda.`, m)
  try {
    await m.react('✨')
    conn.sendPresenceUpdate('composing', m.chat)
    let reply = await callModeIA(text)
    await conn.reply(m.chat, reply, m)
  } catch (e) {
    await m.react('🌟')
    await conn.reply(m.chat, `💢 Mode IA no puede responder a esa pregunta.`, m)
  }
}
handlerPrefix.command = ['mode', 'modeia', 'ia']
handlerPrefix.help = ['modeia']
handlerPrefix.tags = ['ai']
handlerPrefix.group = true

// Handler sin prefijo, solo con mención (ej. @ia hola)
let handlerMention = async (m, { conn, text }) => {
  if (!text) return
  try {
    await m.react('✨')
    conn.sendPresenceUpdate('composing', m.chat)
    let reply = await callModeIA(text)
    await conn.reply(m.chat, reply, m)
  } catch (e) {
    await m.react('🌟')
    await conn.reply(m.chat, `💢 Mode IA no puede responder a esa pregunta.`, m)
  }
}
handlerMention.customPrefix = /^@(?:ia|mode|modeia)/i
handlerMention.nonPrefix = true
handlerMention.group = true
handlerMention.command = new RegExp // necesario para evitar conflictos

export default [handlerPrefix, handlerMention]