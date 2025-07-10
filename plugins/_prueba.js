import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
  const farewellMsg = 'Gracias por haber usado el bot. ¡Nos vemos pronto!';

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: farewellMsg
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '¡Hasta pronto!'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: '',
            subtitle: '',
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: 'Creador 🍟',
                  id: '#owner'
                })
              },
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: 'Menu 📚',
                  id: '#menu'
                })
              }
            ]
          })
        })
      }
    }
  }, {});

  await conn.relayMessage(m.chat, msg.message, { messageId: m.key.id });
};

handler.help = ['m'];
handler.tags = ['tools'];
handler.command = ['m'];

export default handler;