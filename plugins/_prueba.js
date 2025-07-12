// plugins/compartirbot.js
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    // Definimos el texto principal del mensaje
    const mainText = `*¡Te gusta chatear con Pikachu Bot?*
¡Compártelo con tus amigos y ayúdanos a crecer!

*Nuestro Canal Oficial de WhatsApp:*
👉 ${'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'}

*Nuestro Grupo de WhatsApp:*
Para unirte y chatear con otros usuarios, usa este enlace:
👉 ${'https://chat.whatsapp.com/L4y9r5n0d35I3q2d7sW6X5'}

_Puedes copiar y pegar los enlaces para compartirlos con tus contactos._
`

    // Contenido del mensaje interactivo
    const messageContent = {
        viewOnceMessage: { // Esto crea un mensaje que solo se puede ver una vez (opcional, puedes quitarlo si no lo quieres así)
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: mainText // Usamos el texto principal aquí
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: 'Pikachu Bot por Deylin' // Tu footer personalizado
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        // Aquí puedes agregar una imagen si quieres. Si no, hasMediaAttachment: false.
                        // hasMediaAttachment: true, // Si vas a usar una imagen
                        // imageMessage: { // Si usas una imagen
                        //     url: 'URL_DE_TU_IMAGEN_AQUI',
                        //     mimetype: 'image/jpeg', // O el tipo de tu imagen
                        //     fileLength: 'TAMAÑO_DE_IMAGEN_EN_BYTES', // Aproximado
                        //     height: 200, // Alto de la imagen
                        //     width: 200, // Ancho de la imagen
                        // }
                        hasMediaAttachment: false // Por ahora, sin imagen en el header
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                name: 'cta_url', // Este es el tipo de botón para abrir una URL
                                buttonParamsJson: JSON.stringify({
                                    display_text: '➡️ Ir al Canal', // Texto que se muestra en el botón
                                    url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m', // URL de tu canal
                                    merchant_url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m' // URL adicional (puede ser la misma)
                                })
                            }
                            // No podemos añadir un botón que abra el selector de contactos
                            // con un mensaje predefinido. Eso es una funcionalidad nativa de WhatsApp.
                        ]
                    })
                })
            }
        }
    }

    // Generar y enviar el mensaje
    const msg = generateWAMessageFromContent(m.chat, messageContent, { quoted: m }) // Añadimos quoted: m para que responda al mensaje del usuario
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['compartirbot', 'sharebot']
handler.tags = ['main'] // O la categoría que uses para comandos principales
handler.command = ['compartirbot', 'sharebot'] // El comando que activará este mensaje

export default handler
