let handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  const body = m.text || ''
  const texto = body.trim().toLowerCase()

  // Detectar comandos sin prefijo (n, notify, tag...)
  const comandos = ['n', 'notify', 'notificar', 'hidetag', 'tag']
  const usado = comandos.find(c => 
    texto.startsWith(c + ' ') ||
    texto === c ||
    texto.startsWith('.' + c) ||
    texto.startsWith('/' + c) ||
    texto.startsWith('!' + c)
  )

  if (!usado) return // no es un comando válido

  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, '🚫 Este comando es solo para *admins*.', m)
  }

  // Extraer mensaje
  const mensaje = body.replace(new RegExp(`^[./!\\s]*${usado}`, 'i'), '').trim()
    || m.quoted?.text 
    || '*¡Pika Pika saludos!* ⚡'

  const users = participants.map(p => p.id)

  await conn.sendMessage(m.chat, {
    text: mensaje + '\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡',
    mentions: users
  }, { quoted: m })
}

// Requisitos
handler.group = true
handler.admin = true
handler.command = /^$/  // para que no se registre con comandos tradicionales

// Esto es CLAVE para que funcione SIN prefijo:
handler.customPrefix = /^[./!/]?(n|notify|notificar|hidetag|tag)/i
handler.exp = 0

export default handler