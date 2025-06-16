import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  const texto = m.text?.trim()
  if (!texto) return

  const comandos = ['hidetag', 'notify', 'notificar', 'tag', 'n']
  const regex = new RegExp(`^[./!\\s]*(${comandos.join('|')})(\\s+.*)?$`, 'i')

  // Verifica si es uno de los comandos válidos con o sin prefijo
  const match = texto.match(regex)
  if (!match) return

  // Validación de permisos
  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, '⚠️ Este comando es solo para *admins*.', m)
  }

  // Texto a enviar (parte después del comando)
  const body = match[2]?.trim() || (m.quoted?.text || '*¡Pika Pika saludos!* ⚡')
  const mensaje = `${body}\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡`

  const users = participants.map(p => p.id)

  const msg = generateWAMessageFromContent(m.chat, {
    extendedTextMessage: {
      text: mensaje,
      contextInfo: {
        mentionedJid: users
      }
    }
  }, { userJid: conn.user.id })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.group = true
handler.admin = true
handler.command = /^$/ // evita que el sistema tradicional lo capture

export default handler