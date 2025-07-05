//© código creado por Deylin 
//https://github.com/Deylin-Eliac 
//➤ no quites créditos

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args }) => {
  const canal = '120363403119941672@newsletter' // ← tu canal oficial aquí
  const name = args[0] || 'Sticker URL'
  const url = args[1] || 'https://sticker.ly/s/ABCDEFG'

  const text = `📋 Pulsa el botón para copiar el siguiente enlace:\n\n🔗 ${url}`

  const messageContent = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Pikachu Bot by Deylin'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: `📎 Copiar ${name}`,
                  copy_code: url
                })
              }
            ]
          })
        })
      }
    }
  }

  const msg = generateWAMessageFromContent(canal, messageContent, {})
  await conn.relayMessage(canal, msg.message, { messageId: msg.key.id })

  await m.reply('✅ Mensaje enviado correctamente al canal.')
}

handler.command = ['cop']
handler.tags = ['tools']
handler.help = ['cop [nombre] [url]']
// ejemplo: .cop Grupo https://chat.whatsapp.com/...

export default handler