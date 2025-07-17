const handler = async (m, { conn, command, args, isOwner }) => {
  if (!isOwner) return m.reply('Este comando solo lo puede usar el propietario del bot.');

  if (command === 'leavegroup') {
    if (!args[0] || isNaN(args[0])) return m.reply('Debes escribir el número del grupo de la lista. Ejemplo: .leavegroup 3');
    const index = parseInt(args[0]) - 1;

    const chats = Object.entries(conn.chats)
      .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);

    if (index < 0 || index >= chats.length) return m.reply('❌ Número inválido. Usa *.listgroup* para ver los grupos.');

    const [jid] = chats[index];
    const metadata = await conn.groupMetadata(jid).catch(() => null);

    if (!metadata) return m.reply('❌ No se pudo obtener la información del grupo.');

    const groupName = metadata.subject || 'Grupo desconocido';

    await conn.sendMessage(jid, {
      text: '🛑 Lo siento, pero este grupo ha sido descartado de mi base de datos por decisión de mi creador. ¡Adiós!',
    });

    await conn.groupLeave(jid);
    return m.reply(`✅ El bot ha salido del grupo *"${groupName}"*.`);
  }

  // listgroup
  let txt = '';
  try {
    const chats = Object.entries(conn.chats)
      .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);

    if (!chats.length) return m.reply('⚠️ No se encontraron grupos en la base de datos del bot.');

    let i = 0;
    for (const [jid] of chats) {
      const metadata = ((conn.chats[jid] || {}).metadata || (await conn.groupMetadata(jid).catch(() => null))) || {};
      const participants = metadata.participants || [];
      const bot = participants.find(u => conn.decodeJid(u.id) === conn.user.jid) || {};
      const isBotAdmin = bot?.admin || false;
      const isParticipant = participants.some(u => conn.decodeJid(u.id) === conn.user.jid);
      const participantStatus = isParticipant ? 'Participante' : 'Ex-participante';
      const totalParticipants = participants.length;
      const groupName = metadata.subject || await conn.getName(jid);
      const groupLink = isBotAdmin
        ? `https://chat.whatsapp.com/${await conn.groupInviteCode(jid).catch(() => '') || 'Error'}`
        : '(No disponible: sin permisos de admin)';

      txt += `╔═〘 *Grupo ${++i}* 〙═╗
┃ 📌 *Nombre:* ${groupName}
┃ 🆔 *ID:* ${jid}
┃ 👤 *Admin:* ${isBotAdmin ? 'Sí' : 'No'}
┃ 📎 *Estado:* ${participantStatus}
┃ 👥 *Participantes:* ${totalParticipants}
┃ 🔗 *Link:* ${groupLink}
╚══════════════════╝\n\n`;
    }

    m.reply(`📄 *Lista de Grupos del Bot*\n\nTotal: *${chats.length}* grupos encontrados.\n\n${txt}✦ Usa *.leavegroup [número]* para salir de un grupo.`);
  } catch (e) {
    console.error(e);
    m.reply('🚫 Ocurrió un error al obtener la lista de grupos.');
  }
};

handler.help = ['listgroup', 'leavegroup [número]'];
handler.tags = ['owner'];
handler.command = ['listgroup', 'gruposlista', 'grouplist', 'listagrupos', 'leavegroup'];
handler.rowner = true;

export default handler;