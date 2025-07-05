//© código creado por Deylin 
//https://github.com/Deylin-Eliac 
//➤ no quites créditos

import { proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const canal = '120363403119941672@newsletter'

  // Simulamos una lista de enlaces como ejemplo
  const results = [
    { name: 'Sticker 1', url: 'https://sticker.ly/s/ABCDEFG1' },
    { name: 'Sticker 2', url: 'https://sticker.ly/s/ABCDEFG2' },
    { name: 'Sticker 3', url: 'https://sticker.ly/s/ABCDEFG3' },
    { name: 'Sticker 4', url: 'https://sticker.ly/s/ABCDEFG4' },
    { name: 'Sticker 5', url: 'https://sticker.ly/s/ABCDEFG5' },
    { name: 'Sticker 6', url: 'https://sticker.ly/s/ABCDEFG6' }
  ]

  const buttons = []
  for (const result of results) {
    buttons.push({
      name: "cta_copy",
      buttonParamsJson: JSON.stringify({
        display_text: `📎 Copiar ${result.name}`,
        copy_code: result.url
      })
    })
  }

  const txt = `📋 Pulsa uno de los botones para copiar el enlace deseado.\n\nTotal: ${results.length} enlaces.`

  const thumbnail = {
    mediaAttachment: {
      imageMessage: {
        jpegThumbnail: null,
        url: 'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/pika.jpg'
      }
    }
  }

  // Mensaje interactivo para el canal (1 solo si <= 5 botones)
  if (buttons.length <= 5) {
    let msg = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: true,
              ...thumbnail
            }),
            body: proto.Message.InteractiveMessage.Body.create({ text: txt }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Pikachu Bot by Deylin"
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: buttons
            })
          })
        }
      }
    }

    await conn.relayMessage(canal, msg, { messageId: m.key.id })

  } else {
    // Si hay más de 5 botones, se envían en 2 mensajes
    let firstMsg = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: true,
              ...thumbnail
            }),
            body: proto.Message.InteractiveMessage.Body.create({ text: txt }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Presiona un botón para copiar (1/2)"
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: buttons.slice(0, 5)
            })
          })
        }
      }
    }

    await conn.relayMessage(canal, firstMsg, { messageId: m.key.id })

    await new Promise(resolve => setTimeout(resolve, 1000))

    const secondMsgId = m.key.id + Math.random().toString(36).slice(2, 10)

    let secondMsg = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: true,
              ...thumbnail
            }),
            body: proto.Message.InteractiveMessage.Body.create({
              text: "Continuación de enlaces:"
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Presiona un botón para copiar (2/2)"
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: buttons.slice(5)
            })
          })
        }
      }
    }

    await conn.relayMessage(canal, secondMsg, { messageId: secondMsgId })
  }

  await m.reply('✅ Botones enviados correctamente al canal.')
}

handler.command = ['copcanal']
handler.tags = ['tools']
handler.help = ['copcanal']

export default handler