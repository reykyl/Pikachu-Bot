import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args }) => {
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

  const msg = generateWAMessageFromContent(m.chat, messageContent, {})
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.command = ['cop']
handler.tags = ['tools']
handler.help = ['cop [nombre] [url]']
// ejemplo: .cop Grupo https://chat.whatsapp.com/...

export default handler