import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  const texto = m.text?.trim().toLowerCase() || ''
  const comandos = ['hidetag', 'notify', 'notificar', 'tag', 'n']

  // Detectar si inicia con un comando válido (con o sin prefijo)
  const usado = comandos.find(cmd =>
    texto === cmd || 
    texto.startsWith(cmd + ' ') ||
    texto.startsWith('.' + cmd) || texto.startsWith('.' + cmd + ' ') ||
    texto.startsWith('!' + cmd) || texto.startsWith('!' + cmd + ' ') ||
    texto.startsWith('/' + cmd) || texto.startsWith('/' + cmd + ' ')
  )

  if (!usado) return

  // Verifica permisos
  if (!isAdmin && !isOwner) return conn.reply(m.chat, '⚠️ Solo los admins pueden usar este comando.', m)

  // Elimina el comando del texto para obtener solo el mensaje
  const textoSinComando = m.text.replace(new RegExp(`^[./!/]?${usado}\\s*`, 'i'), '') || (m.quoted?.text || '*¡Pika Pika saludos!* ⚡')
  const mensaje = `${textoSinComando}\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡`
  const users = participants.map(u => u.id)

  // Enviar como mensaje oculto
  try {
    const fake = generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: mensaje,
        contextInfo: {
          mentionedJid: users
        }
      }
    }, {
      userJid: conn.user.id,
      quoted: null
    })

    await conn.relayMessage(m.chat, fake.message, { messageId: fake.key.id })

  } catch (e) {
    await conn.reply(m.chat, '❌ Hubo un error al enviar el hidetag.', m)
    console.error(e)
  }
}

// Requisitos
handler.group = true
handler.admin = true
handler.command = /^$/ // Desactivamos el sistema de comandos para hacerlo manual

export default handler