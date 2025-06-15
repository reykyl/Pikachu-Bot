import fetch from 'node-fetch'

const callModeIA = async (text) => {
  const response = await fetch(`https://mode-ia.onrender.com/mode-ia?prompt=${encodeURIComponent(text)}`)
  const data = await response.json()
  if (!data.response) throw 'Sin respuesta válida'
  return data.response.trim()
}

const handler = async (m, { text, args }) => {
  const raw = m.text || ''
  const prompt = raw
    .replace(/^(@ia|@modeia|@mode|modeia|mode|ia)\s*/i, '')
    .trim()

  if (!prompt) return conn.reply(m.chat, `✨ Ingrese una petición para que Mode IA lo responda.`, m)

  try {
    await m.react('✨')
    conn.sendPresenceUpdate('composing', m.chat)
    const reply = await callModeIA(prompt)
    await m.reply(reply)
  } catch (e) {
    console.error(e)
    await m.react('🌟')
    await conn.reply(m.chat, `💢 Mode IA no puede responder a esa pregunta.`, m)
  }
}


handler.help = ['@ia', '.ia'];
handler.customPrefix = /^(@ia|@modeia|@mode|modeia|mode|ia)$/i
handler.command = new RegExp
handler.rowner = true;

export default handler;