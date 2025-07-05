//© código creado por Deylin 
//https://github.com/Deylin-Eliac 
//➤ no quites créditos

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const canal = '120363403119941672@newsletter' // ← ID de tu canal
  const texto = '✨ Pulsa el botón para abrir el canal oficial'
  const url = 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'

  const content = proto.Message.fromObject({
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          body: { text: texto },
          footer: { text: 'Pikachu Bot by Deylin' },
          header: { hasMediaAttachment: false },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: '📢 Abrir canal',
                  url: url,
                  merchant_url: url
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

  await m.reply('✅ Botón enviado al canal correctamente.')
}

handler.command = ['canalbtn']
handler.help = ['canalbtn']
handler.tags = ['tools']

export default handler