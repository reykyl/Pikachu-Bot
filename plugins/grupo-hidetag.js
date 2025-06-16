let handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  const texto = m.text || ''
  const comando = /^[./!]?([a-z]+)\s?/i.exec(texto)?.[1]?.toLowerCase()

  const comandos = ['n', 'notify', 'notificar', 'hidetag', 'tag']
  if (!comando || !comandos.includes(comando)) return

  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, '🚫 Este comando es solo para *admins*.', m)
  }

  const users = participants.map(p => p.id)

  // Extraer el mensaje quitando el comando
  const mensaje = texto.replace(new RegExp(`^[./!]?${comando}`, 'i'), '').trim() ||
                  m.quoted?.text || 
                  m.quoted?.caption || 
                  '*¡Pika Pika saludos!* ⚡'

  await conn.sendMessage(m.chat, {
    text: mensaje + '\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡',
    mentions: users
  }, { quoted: m })
}

handler.group = true
handler.admin = true
handler.customPrefix = /^[./!]?([a-z]+)/i
handler.command = () => false // Para forzar solo customPrefix
handler.exp = 0

export default handler