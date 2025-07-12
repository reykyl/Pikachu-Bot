import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "🚀 *¡Comparte este bot con tus contactos!*"
          },
          footer: {
            text: "✨ Copilot para todos"
          },
          header: {
            title: "🤖 Kirito-Bot MD",
            subtitle: "Invítalo a tu grupo",
            hasMediaAttachment: false
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                  title: 'Compartir Kirito',
                  sections: [
                    {
                      title: "Enviar a un contacto",
                      highlight_label: "Recomendar",
                      rows: [
                        {
                          header: "Kirito Bot",
                          title: "Compartir Kirito",
                          description: "Bot para grupos y comandos",
                          id: "share_kirito"
                        }
                      ]
                    }
                  ]
                })
              }
            ]
          },
          contextInfo: {
            forwardedNewsletterMessageInfo: {
              newsletterName: "Kirito Oficial",
              newsletterJid: '120363XXXXXXX-XXXX@g.us'
            }
          }
        }
      }
    }
  }, {});

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  // Captura respuesta del botón (dentro del mismo handler)
  conn.ev.once('messages.upsert', async ({ messages }) => {
    const res = messages[0];
    const selected = res?.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.singleSelectReply?.selectedRowId;

    if (selected === 'share_kirito') {
      await conn.sendMessage(res.key.remoteJid, {
        text: `🚀 ¡Gracias por compartir Kirito-Bot!\n\n✅ Enlace para obtenerlo:\nhttps://wa.me/504XXXXXXXX?text=Hola+quiero+el+bot+Kirito`
      }, { quoted: res });
    }
  });
};

handler.command = ['copilot'];
handler.help = ['copilot'];
handler.tags = ['tools'];
handler.register = false;

export default handler;