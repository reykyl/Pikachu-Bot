const handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  const text = m.text?.toLowerCase()?.trim();

  if (text === 'kick') {
    if (!m.isGroup) return; // Ignora fuera de grupos

    if (!isAdmin) {
      return conn.reply(m.chat, '⚠️ Este comando solo lo pueden usar *administradores*.', m);
    }

    if (!isBotAdmin) {
      return conn.reply(m.chat, '🛑 El bot no tiene permisos de administrador.', m);
    }

    if (!m.mentionedJid || m.mentionedJid.length === 0) {
      return conn.reply(m.chat, '❌ Debes *mencionar a alguien* para expulsar.', m);
    }

    try {
      await conn.groupParticipantsUpdate(m.chat, [m.mentionedJid[0]], 'remove');
      return conn.reply(m.chat, '👢 Usuario expulsado correctamente.', m);
    } catch (e) {
      console.error(e);
      return conn.reply(m.chat, '🚫 No pude expulsar al usuario. Verifica si el bot tiene permisos o si estás mencionando correctamente.', m);
    }
  }
};

handler.customPrefix = /^kick$/i;
handler.command = new RegExp(); // sin prefijo
handler.group = true;

export default handler;