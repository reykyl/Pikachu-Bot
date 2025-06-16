let handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  const text = m.text?.trim() || ''
  const comandos = ['n', 'notify', 'notificar', 'hidetag', 'tag']
  
  // Detectar si el mensaje comienza con algún comando permitido
  const cmd = comandos.find(c => text.toLowerCase().startsWith(c) || text.toLowerCase().startsWith('.' + c))
  if (!cmd) return // No ejecutar si no es uno de los comandos válidos

  if (!isAdmin && !isOwner) return conn.reply(m.chat, '⚠️ Este comando es solo para *admins*.', m)

  // Quitar el comando del texto para dejar solo el mensaje
  const mensaje = text.replace(new RegExp(`^[./!\\s]*${cmd}`, 'i'), '').trim() || m.quoted?.text || '*¡Pika Pika saludos!* ⚡'
  const mencionados = participants.map(p => p.id)

  await conn.sendMessage(m.chat, {
    text: mensaje + '\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡',
    mentions: mencionados
  }, { quoted: m })
}

handler.group = true
handler.admin = true
handler.command = /^$/ // sin prefijo

export default handler