import fetch from 'node-fetch'

var handler = async (m, { text, usedPrefix, command }) => {
  
  const body = m.text || ''
  const prefixRegex = /^[@.]/ 
  const commandRegex = /^(modeia|mode)/i

  
  if (!prefixRegex.test(body) && !commandRegex.test(body)) return
  if (!commandRegex.test(body.slice(1))) return

  let prompt = body.replace(prefixRegex, '').replace(commandRegex, '').trim()
  if (!prompt) return conn.reply(m.chat, `🤖 Ingrese una petición para que Mode IA lo responda.`, m)

  try {
    await m.react('🌟')
    conn.sendPresenceUpdate('composing', m.chat)

    let response = await fetch(`https://mode-ia.onrender.com/mode-ia?prompt=${encodeURIComponent(prompt)}`)
    let data = await response.json()

    if (!data.response) throw 'Sin respuesta válida'
    await m.reply(data.response.trim())
  } catch (e) {
    await m.react('⚡️')
    await conn.reply(m.chat, `🤖 Mode IA no puede responder a esa pregunta.`, m)
  }
}


handler.command = ['modeia', 'mode']
handler.help = ['modeia']
handler.tags = ['ai']
handler.group = true
handler.customPrefix = /^[@.](modeia|mode)/i
handler.before = async (m) => true 
handler.prefix = false 

export default handler