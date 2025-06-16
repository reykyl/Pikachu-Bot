let handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  const texto = m.text || ''
  const match = texto.trim().match(/^[./!]?(\w+)\s?(.*)/i)
  if (!match) return

  const comando = match[1]?.toLowerCase()
  const contenido = match[2]?.trim()
  const comandosValidos = ['n', 'notify', 'notificar', 'hidetag', 'tag']
  if (!comandosValidos.includes(comando)) return

  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, '🚫 Este comando es solo para *admins*.', m)
  }

  const users = participants.map(p => p.id)
  let mensaje = contenido

  if (!mensaje && m.quoted) {
    mensaje = m.quoted.text || m.quoted.caption || '*📎 Archivo multimedia*'
  }

  if (!mensaje) mensaje = '*¡Pika Pika saludos!* ⚡'

  await conn.sendMessage(m.chat, {
    text: mensaje + '\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡',
    mentions: users
  }, { quoted: m })
}

handler.group = true
handler.admin = true
handler.customPrefix = /^[./!]?(\w+)/i
handler.command = new RegExp('^$') // Necesario para que se registre como "sin comando estándar"
handler.exp = 0

export default handler