let handler = async function (m, { conn, participants, groupMetadata }) {
  if (!m.isGroup) return m.reply('⚠️ *Este comando solo se puede usar en grupos, entrenador.* ⚡');

  const normalizeJid = jid => jid?.replace(/[^0-9]/g, '');
  const participantList = groupMetadata.participants || [];

  const result = participantList.map(participant => ({
    id: participant.id,
    lid: participant.lid || null,
    admin: participant.admin || null
  }));

  const senderData = result.find(user => normalizeJid(user.id) === normalizeJid(m.sender));
  const senderLid = senderData?.lid || '❌ *No se encontró tu LID.*';

  const totalLids = result.filter(p => p.lid && normalizeJid(p.id) !== normalizeJid(m.sender)).length;

  const pikachuMessage = `⚡️ *CENTRO DE IDENTIFICACIÓN PIKACHU* ⚡️
━━━━━━━━━━━━━━━━━━━━━━━
👤 *Tu LID:* 
${senderLid}

🧑‍🤝‍🧑 *Usuarios con LID (además de ti):* 
${totalLids} ncontrados ⚡

📡 *Total de usuarios:* ${result.length}
━━━━━━━━━━━━━━━━━━━━━━━`;

  return m.reply(pikachuMessage);
};

handler.command = ['lid'];
handler.help = ['lid'];
handler.tags = ['grupo'];

export default handler;