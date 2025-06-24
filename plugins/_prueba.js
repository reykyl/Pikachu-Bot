import { proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  const texto = `Texto que se podrá copiar con el botón de WhatsApp`;
  const bloqueCodigo = ['```', texto, '```'].join('\n');

  const cards = [
    {
      header: {
        title: '📋 Copiar texto fácil',
        subtitle: 'Presiona el botón copiar',
      },
      body: {
        text: bloqueCodigo
      },
      footer: {
        text: 'Este texto puede ser copiado si tu WhatsApp lo permite.'
      },
      buttons: [
        {
          quickReplyButton: {
            displayText: '📄 Ver otra vez',
            id: '.h'
          }
        }
      ]
    },
    {
      header: {
        title: '📌 Info',
        subtitle: '¿Cómo funciona esto?'
      },
      body: {
        text: 'WhatsApp genera automáticamente un botón de copiar si el texto está dentro de comillas invertidas (```).'
      },
      footer: {
        text: 'Puedes usar este truco en cualquier comando.'
      },
      buttons: [
        {
          quickReplyButton: {
            displayText: '🔁 Repetir',
            id: '.h'
          }
        }
      ]
    }
  ];

  const carousel = proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards });

  await conn.sendMessage(m.chat, {
    interactiveMessage: {
      carouselMessage: carousel
    }
  }, { quoted: m });
};

handler.command = ['h'];
export default handler;