import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  const texto = m.text?.trim() || ''
  const comandos = ['hidetag', 'notify', 'notificar', 'tag', 'n']

  // Detectar comando con o sin prefijo
  const match = comandos.find(cmd =>
    texto.toLowerCase().startsWith(cmd) ||
    texto.toLowerCase().startsWith('.' + cmd) ||
    texto.toLowerCase().startsWith('!' + cmd) ||
    texto.toLowerCase().startsWith('/' + cmd)
  )
  if (!match) return

  if (!isAdmin && !isOwner) {
    return conn.reply(m.chat, '⚠️ Este comando es solo para admins.', m)
  }

  // Extraer texto sin el comando
  const textoSinComando = texto.replace(new RegExp(`^[./!/]?${match}\\s*`, 'i'), '')
  const mensaje = textoSinComando || (m.quoted?.text || '*¡Pika Pika saludos!* ⚡')

  const users = participants.map(p => p.id)

  const content = generateWAMessageFromContent(m.chat, {
    extendedTextMessage: {
      text: mensaje + '\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡',
      contextInfo: {
        mentionedJid: users
      }
    }
  }, { userJid: conn.user.id })

  await conn.relayMessage(m.chat, content.message, { messageId: content.key.id })
}

handler.group = true
handler.admin = true
handler.command = /^$/  // Desactiva sistema clásico de comandos

export default handler