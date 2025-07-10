import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: 'Gracias por usar el bot. ¿Qué deseas hacer ahora?',
    footer: '¡Hasta pronto!',
    buttons: [
      { buttonId: '#owner', buttonText: { displayText: 'Creador 🍟' }, type: 1 },
      { buttonId: '#menu', buttonText: { displayText: 'Menu 📚' }, type: 1 }
    ],
    headerType: 1
  });
};

handler.help = ['m'];
handler.tags = ['tools'];
handler.command = ['m'];

export default handler;