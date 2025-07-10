const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, { 
    text: 'prueba:',
    buttons: [
      {
        buttonId: '.owner',
        buttonText: { displayText: '.creador' },
      },
      {
        buttonId: '.menu',
        buttonText: { displayText: '.menu' },
      },
       ],
    footer: '¡ - BOT!',
    viewOnce: true,
  }, { quoted: m });
};

handler.tags = ['tools'];
handler.help = ['webinfo'];
handler.command = ['m'];

export default handler;