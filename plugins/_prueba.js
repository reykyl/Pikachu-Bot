let handler = async (m, { conn }) => {
  const texto = `Texto que se podrá copiar con el botón de WhatsApp`;

  const bloqueCodigo = [
    '```',
    texto,
    '```'
  ].join('\n');

  await conn.sendMessage(m.chat, {
    text: `h:\n\n${bloqueCodigo}`,
    footer: 'P',
    buttons: [
      { buttonId: '.h', buttonText: { displayCopy: '📄 Ver otra vez' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m });
};

handler.command = ['h'];
export default handler;