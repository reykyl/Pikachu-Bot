async function handler(m, { conn, participants, groupMetadata }) {
  const group = m.chat;
  const totalMembers = participants.length;
  const link = `https://chat.whatsapp.com/${await conn.groupInviteCode(group)}`;

  const buttonMessage = {
    text: `*⚡🌩️──『 𝑳𝑰𝑵𝑲 𝑷𝑰𝑲𝑨𝑪𝑯𝑼 』──🌩️⚡*\n\n📛 *Grupo:* ${groupMetadata.subject}\n👥 *Miembros:* ${totalMembers}\n🔗 *Enlace mágico:* ${link}\n\n🐭 ¡Pikachu dice que lo compartas con los mejores entrenadores! ⚡`,
    footer: 'Pikachu',
    buttons: [
      {
        buttonId: '.link',
        buttonText: { displayText: '📋 Copiar enlace' },
        type: 1
      }
    ],
    headerType: 1
  };

  await conn.sendMessage(group, buttonMessage, { quoted: m });
}

handler.tags = ['grupo'];
handler.command = ['linkh', 'enlace'];
handler.group = true;
handler.botAdmin = true;

export default handler;