
const handler = async (m, { conn }) => {
  let msg = generateWAMessageFromContent(m.chat, {
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
                title: "",
                subtitle: "",
                hasMediaAttachment: true
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      "display_text": "Creador 🍟",
                      "id": "#owner"
                    })
                  },
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      "display_text": "Menu 📚",
                      "id": "#menu"
                    })
                  }
                ]
              })
            })
          }
        }
      }, {});

      msg.message.viewOnceMessage.message.interactiveMessage.header.imageMessage = proto.Message.ImageMessage.fromObject(media.imageMessage);
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
      await conn.sendMessage(m.chat, { audio: { url: farewellAudioUrl }, mimetype: 'audio/mp4', ptt: true });
    }
  }
  return true;
};

handler.help = ['m'];
handler.tags = ['tools'];
handler.command = ['m'];

export default handler;
