import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `⚡ Ingrese una petición para que Mode IA la responda.`, m, fake)
  }

  try {
    await m.react('🌟')
    conn.sendPresenceUpdate('composing', m.chat)

    let response = await fetch(`https://mode-ia.onrender.com/mode-ia?prompt=${encodeURIComponent(text)}`)
    let data = await response.json()

    if (!data.response) throw 'Sin respuesta válida'
    await m.reply(data.response.trim())
  } catch (e) {
    console.error(e)
    await m.react('⚡️')
    await conn.reply(m.chat, `⚡ Mode IA no puede responder a esa pregunta.`, m, fake)
  }
}

// Aceptar .ia o @ia, mayúsculas o minúsculas
handler.command = /^([.@])ia$/i;
handler.tags = ['ia']

export default handler