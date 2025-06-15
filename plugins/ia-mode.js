import fetch from 'node-fetch'

var handler = async (m, { text, usedPrefix, command, args }) => {
  if (!text) return conn.reply(m.chat, `✨ Ingrese una petición para que Mode IA lo responda.`, m)
  try {
    await m.react('✨')
    conn.sendPresenceUpdate('composing', m.chat)

    let response = await fetch(`https://mode-ia.onrender.com/mode-ia?prompt=${encodeURIComponent(text)}`)
    let data = await response.json()

    if (!data.response) throw 'Sin respuesta válida'
    await m.reply(data.response.trim())
  } catch (e) {
    await m.react('🌟')
    await conn.reply(m.chat, `💢 Mode IA no puede responder a esa pregunta.`, m)
  }
}

handler.command = ['modeia', 'mode', 'ia']
handler.help = ['modeia']
handler.tags = ['ai']
handler.group = true


handler.customPrefix = /^(@ia|ia|modeia|mode)/i
handler.command = new RegExp 
handler.nonPrefix = true 

export default handler