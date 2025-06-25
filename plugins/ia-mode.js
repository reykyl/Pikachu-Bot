import fetch from 'node-fetch'

var handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `${emojis} Ingrese una petición para que Mode IA lo responda.`, m, fake)
  try {
    await m.react('🌟')
    conn.sendPresenceUpdate('composing', m.chat)

    let response = await fetch(`https://mode-ia.onrender.com/mode-ia?prompt=${encodeURIComponent(text)}`)
    let data = await response.json()

    if (!data.response) throw 'Sin respuesta válida'
    await m.reply(data.response.trim())
  } catch (e) {
    await m.react('⚡️')
    await conn.reply(m.chat, `${emojis} Mode IA no puede responder a esa pregunta.`, m, fake)
  }
}


handler.command = /^\.?ia$/i;
handler.help = ['ia'];
handler.tags = ['ai'];
handler.group = true;

export default handler;