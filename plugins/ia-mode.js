import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `⚡ Ingrese una petición para que Mode IA la responda.`, m, fake)
  }

  try {
    await m.react('🌟')
    conn.sendPresenceUpdate('composing', m.chat)

    
    const id = m.sender || 'anon'
    const url = `https://g-mini-ia.vercel.app/api/mode-ia?prompt=${encodeURIComponent(text)}&id=${encodeURIComponent(id)}`

    const response = await fetch(url)
    const data = await response.json()

    if (!data.response) throw 'Sin respuesta válida'
    await m.reply(data.response.trim())
  } catch (e) {
    console.error(e)
    await m.react('⚡️')
    await conn.reply(m.chat, `⚡ Mode IA no puede responder a esa pregunta.`, m, fake)
  }
}

handler.help = ['ia *<texto>*']
handler.tags = ['ia']
handler.command = ['ia']
handler.register = true
handler.group = true

export default handler