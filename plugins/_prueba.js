//© código creado por Deylin 
//https://github.com/Deylin-Eliac 
//➤ no quites créditos

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args }) => {
  const canal = '120363403119941672@newsletter' // ID del canal
  const name = args[0] || 'Sticker URL'
  const url = args[1] || 'https://sticker.ly/s/ABCDEFG'

  const text = `📋 Pulsa el botón para copiar el siguiente enlace:\n\n🔗 ${url}`

  const content = proto.Message.fromObject({
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          body: { text },
          footer: { text: 'Pikachu Bot by Deylin' },
          header: {
            hasMediaAttachment: false
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: `📎 Copiar ${name}`,
                  copy_code: url
                })
              }
            ]
          }
        }
      }
    }
  })

  const msg = generateWAMessageFromContent(canal, content, {})
  await conn.relayMessage(canal, msg.message, { messageId: msg.key.id })

  await m.reply('✅ Enlace enviado al canal con botón de copiar.')
}

handler.command = ['cop']
handler.tags = ['tools']
handler.help = ['cop [nombre] [url]']
// Ejemplo: .cop Grupo https://chat.whatsapp.com/...

export default handler