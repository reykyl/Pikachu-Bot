let handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  const body = m.text || ''
  const texto = body.trim().toLowerCase()

  const comandos = ['n', 'notify', 'notificar', 'tag', 'hidetag']
  const usado = comandos.find(c => 
    texto.startsWith(c + ' ') || 
    texto === c || 
    texto.startsWith('.' + c) || 
    texto.startsWith('!' + c) || 
    texto.startsWith('/' + c)
  )

  if (!usado) return

  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, '🚫 Este comando es solo para *admins*.', m)
  }

  const textoMensaje = body.replace(new RegExp(`^[./!\\s]*${usado}`, 'i'), '').trim() 
                      || m.quoted?.text 
                      || '*¡Pika Pika saludos!* ⚡'

  const mentions = participants.map(u => u.id)

  await conn.sendMessage(m.chat, {
    text: textoMensaje + '\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡',
    mentions
  }, { quoted: m })
}

handler.group = true
handler.admin = true
handler.command = /^$/ // Evita detección por sistema de prefijo

export default handler