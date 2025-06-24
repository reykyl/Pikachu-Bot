let handler = async (m, { conn }) => {
  const texto = `Texto que se podrá copiar con el botón de WhatsApp`;
  const bloqueCodigo = ['```', texto, '```'].join('\n');

  await conn.sendMessage(m.chat, {
    text: `📋 *Copiar texto fácil:*\n\n${bloqueCodigo}`,
    footer: 'Presiona el botón copiar que aparece automáticamente si tu WhatsApp lo soporta.',
    buttons: [
      {
        buttonId: '.h',
        buttonText: { displayText: '📄 Repetir' },
        type: 1
      },
      {
        buttonId: '.infoh',
        buttonText: { displayText: 'ℹ️ ¿Cómo funciona?' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m });
};

handler.command = ['h'];
export default handler;