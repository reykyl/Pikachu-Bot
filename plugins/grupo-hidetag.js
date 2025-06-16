let handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  const body = m.text || ''
  const texto = body.trim().toLowerCase()

  // Comandos aceptados con o sin prefijo
  const comandos = ['n', 'notify', 'notificar', 'hidetag', 'tag']
  const usado = comandos.find(c => 
    texto === c || 
    texto.startsWith(c + ' ') ||
    texto.startsWith('.' + c) ||
    texto.startsWith('!' + c) ||
    texto.startsWith('/' + c)
  )
  if (!usado) return // No es un comando válido

  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, '🚫 Este comando es solo para *admins*.', m)
  }

  // Extraer texto del mensaje
  const mensaje = body.replace(new RegExp(`^[./!\\s]*${usado}`, 'i'), '').trim() 
                  || m.quoted?.text 
                  || '*¡Pika Pika saludos!* ⚡'

  const users = participants.map(u => u.id)

  await conn.sendMessage(m.chat, {
    text: mensaje + '\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡',
    mentions: users
  }, { quoted: m })
}

handler.group = true
handler.admin = true
handler.command = /^$/ // sin comando registrado

export default handler