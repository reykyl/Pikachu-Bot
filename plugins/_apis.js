//import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

/*let handler = async (m, { conn }) => {
  const text = `*🔧 APIs desarrolladas por Deylin*

*🌐 Prueba APIs directamente aquí:* 
https://paka-apis.vercel.app/

_________________________________

[1] https://anime-xi-wheat.vercel.app/api/pinterest?q=
> Pinterest: Buscador de imágenes en Pinterest.

[2] https://anime-xi-wheat.vercel.app/api/ia-img?prompt=
> Generador de imágenes con IA.

[3] https://g-mini-ia.vercel.app/api/gemini
> Gemini IA: Responde preguntas, analiza imágenes y genera contenido visual.

[4] https://mode-ia.onrender.com/mode-ia?prompt=
> Mode-IA: Inteligencia artificial para responder preguntas en formato texto.

[5] https://ytumode-api.vercel.app/api/search?q=
> Buscador de contenido en YouTube.

[6] https://mode-api-sigma.vercel.app/api/mp3?url=
> Descarga de audio desde YouTube.

[7] https://mode-api-sigma.vercel.app/api/mp4?url=
> Descarga de video desde YouTube.

[8] https://g-mini-ia.vercel.app/api/meme
> Buscador de memes aleatorios.

[9] https://g-mini-ia.vercel.app/api/infonumero?numero=
> Información de un número: país y bandera (para welcome y tagall).

🔒 *Nota:* Usa estas APIs con precaución. No hagas spam de peticiones.
`

  const messageContent = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Pikachu Bot by Deylin'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: '✐ Canal oficial',
                  url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m',
                  merchant_url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
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

handler.command = ['api', 'apis', 'servicios']
handler.tags = ['main']
handler.help = ['api', 'apis', 'servicios']

export default handler*/


//© código creado por Deylin 
//https://github.com/Deylin-eliac 
//➤ no quites créditos

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

// Objeto para guardar tiempos de uso por usuario
const cooldown = new Map()

const handler = async (m, { conn }) => {
  const user = m.sender

  const now = Date.now()
  const waitTime = 2000 

  
  if (cooldown.has(user) && now - cooldown.get(user) < waitTime) {
    return conn.reply(m.chat, '🕒 Espera 2 segundos para volver a usar este comando.', m)
  }

  
  cooldown.set(user, now)

  const texto = `✨ Pulsa el botón para unirte al canal oficial`.trim()

  const messageContent = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: texto }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Pikachu Bot by Deylin' }),
          header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: '✐ Canal oficial',
                  url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m',
                  merchant_url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
                })
              }
            ]
          })
        })
      }
    }
  }

  const msg = generateWAMessageFromContent(m.chat, messageContent, { quoted: m })
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.command = ['can']
handler.register = true
handler.help = ['can']
handler.tags = ['info']

export default handler