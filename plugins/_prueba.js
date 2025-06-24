const handler = async (m, { conn }) => {
  const codigo = 'MI_CODIGO_SECRETO_123';

  const mensaje = `🎉 Aquí está tu código:\n\n\`\`\`\n${codigo}\n\`\`\``;

  await conn.sendMessage(m.chat, {
    text: mensaje,
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363#######@newsletter.whatsapp.net', // <- ID del canal (puede ser uno falso)
        serverMessageId: 100,
        newsletterName: 'Canal Oficial'
      }
    }
  }, { quoted: m });
};

handler.command = ['hcopy'];
export default handler;