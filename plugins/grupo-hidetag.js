let handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  const texto = m.text || ''
  const comandos = ['n', 'notify', 'notificar', 'hidetag', 'tag']

  const usado = comandos.find(c =>
    texto.toLowerCase().startsWith(c + ' ') ||
    texto.toLowerCase() === c ||
    texto.toLowerCase().startsWith('.' + c + ' ') ||
    texto.toLowerCase() === '.' + c ||
    texto.toLowerCase().startsWith('/' + c + ' ') ||
    texto.toLowerCase() === '/' + c ||
    texto.toLowerCase().startsWith('!' + c + ' ') ||
    texto.toLowerCase() === '!' + c
  )

  if (!usado) return

  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, '🚫 Este comando es solo para *admins*.', m)
  }

  const users = participants.map(p => p.id)
  let mensaje = texto.replace(new RegExp(`^[./!\\s]*${usado}`, 'i'), '').trim()

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
handler.customPrefix = /^[./!]?((n|notify|notificar|hidetag|tag))( |$)/i
handler.exp = 0

export default handler