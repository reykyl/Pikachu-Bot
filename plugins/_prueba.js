import { proto, generateWAMessageFromContent } from "@whiskeysockets/baileys";

let handler = async (m, { conn }) => {
  const texto = 'Hola';
  const bloqueCodigo = ['```', texto, '```'].join('\n');

  const cards = [
    {
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: bloqueCodigo
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: '📋 Pulsa el botón de copiar si tu WhatsApp lo permite.'
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        hasMediaAttachment: false
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: []
      })
    }
  ];

  const responseMessage = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: '🔹 Texto listo para copiar:'
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '💠 Botón de copiar automático de WhatsApp'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: cards
          })
        })
      }
    }
  }, { quoted: m });

  await conn.relayMessage(m.chat, responseMessage.message, { messageId: responseMessage.key.id });
};

handler.command = ['copiar'];
export default handler;