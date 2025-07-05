//© código creado por Deylin 
//https://github.com/Deylin-Eliac 
//➤ no quites créditos

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text }) => {
  const canal = '120363403119941672@newsletter' // ID de tu canal

  if (!text.includes('|')) throw `✳️ Usa el formato:\n.publi <función> | <código>\n\nEjemplo:\n.publi Activar bienvenida | WEL-29382`

  const [funcionRaw, codigoRaw] = text.split('|')
  const funcion = funcionRaw.trim()
  const codigo = codigoRaw.trim()

  const mensaje = `📋 *Nuevo código*\n\n📌 *Función:* ${funcion}\n🔢 *Código:* ${codigo}`

  const content = proto.Message.fromObject({
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          body: { text: mensaje },
          footer: { text: 'Pikachu Bot by Deylin' },
          header: {
            hasMediaAttachment: false
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: '📎 Copiar código',
                  copy_code: codigo
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

  await m.reply('✅ Publicación enviada al canal.')
}

handler.command = ['publi']
handler.help = ['publi <función> | <código>']
handler.tags = ['tools']

export default handler