//© código creado por Deylin 
//https://github.com/Deylin-Eliac 
//➤ no quites créditos

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, text }) => {
  const canal = '120363403119941672@newsletter'

  if (!text.includes('|')) throw `✳️ Usa el formato:\n.publi <función> | <código>\n\nEjemplo:\n.publi Activar bienvenida | WEL-29382`

  const [funcionRaw, codigoRaw] = text.split('|')
  const funcion = funcionRaw.trim()
  const codigo = codigoRaw.trim()

  const mensaje = `📋 *Nuevo código*\n\n📌 *Función:* ${funcion}\n🔢 *Código:* ${codigo}`

  const messageContent = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: mensaje }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Pikachu Bot by Deylin' }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: '📎 Copiar código',
                  copy_code: codigo
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

  await m.reply('✅ Mensaje enviado al canal correctamente.')
}

handler.command = ['publi']
handler.help = ['publi <función> | <código>']
handler.tags = ['tools']

export default handler