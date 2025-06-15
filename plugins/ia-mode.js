import fetch from 'node-fetch'

const emoji = '🤖' // Define el emoji
const rcanal = null // Ajusta si tienes un valor para esto (puedes quitarlo si no lo usas)

var handler = async (m, { text }) => {
  const prompt = text || m.text?.replace(/^@ia/i, '').trim()

  if (!prompt) return conn.reply(m.chat, `${emoji} Ingrese una petición para que Mode IA lo responda.`, m, rcanal)
  try {
    await m.react('🌟')
    conn.sendPresenceUpdate('composing', m.chat)

    let response = await fetch(`https://mode-ia.onrender.com/mode-ia?prompt=${encodeURIComponent(prompt)}`)
    let data = await response.json()

    if (!data.response) throw 'Sin respuesta válida'
    await m.reply(data.response.trim())
  } catch (e) {
    await m.react('⚡️')
    await conn.reply(m.chat, `${emoji} Mode IA no puede responder a esa pregunta.`, m, rcanal)
  }
}

// Acepta solo `.ia` como comando con prefijo
handler.command = ['ia']
// Y también permite sin prefijo cuando se usa `@ia`
handler.customPrefix = /^@ia/i
handler.nonPrefix = true

handler.help = ['ia']
handler.tags = ['ai']
handler.group = true

export default handler