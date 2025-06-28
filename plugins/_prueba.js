async function handler(m, { conn, orgs, participants, groupMetadata }) {
  const group = m.chat;
  const totalMembers = participants.length;
  const buttonMessage = {
    text: `https://chat.whatsapp.com/${await conn.groupInviteCode(group)}`;

  const buttonMessage = {
    text: `*⚡🌩️──『 𝑳𝑰𝑵𝑲 𝑷𝑰𝑲𝑨𝑪𝑯𝑼 』──🌩️⚡*\n📛 *Grupo:* ${groupMetadata.subject}\n👥 *Miembros:* ${totalMembers}\n🔗 *Enlace mágico:* ${link}\n🐭 ¡Pikachu dice que lo compartas con los mejores entrenadores! ⚡`,
    footer: 'Pikachu',
    buttons: [
      {
        buttonId: 'copy-link',
        buttonText: { displayText: 'Copiar enlace' },
        type: 1
      }
    ],
    headerType: 1
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });

  conn.on('action', async (action) => {
    if (action.type === 'button' && action.buttonId === 'copy-link') {
      await conn.sendMessage(m.chat, { text: `Enlace copiado: ${link}` });
    }
  });
}

handler.tags = ['grupo'];
handler.command = ['link', 'enlace'];
handler.group = true;
handler.botAdmin = true;
export default handler;