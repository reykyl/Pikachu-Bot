// Comando sin prefijo: "kick" - Expulsa a un usuario mencionado

const handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  const text = m?.text?.toLowerCase()?.trim();

  if (!m.isGroup || !text) return;

  // Detecta solo si el texto es 'kick' exactamente
  if (text === 'kick') {
    if (!isAdmin) {
      return conn.reply(m.chat, '⚠️ Este comando solo lo pueden usar *admins*.', m);
    }

    if (!isBotAdmin) {
      return conn.reply(m.chat, '🛑 El bot no es *admin*, no puedo expulsar a nadie.', m);
    }

    if (!m.mentionedJid || m.mentionedJid.length === 0) {
      return conn.reply(m.chat, '❌ Debes *mencionar a alguien* para expulsar.\nEjemplo:\n*kick @usuario*', m);
    }

    const user = m.mentionedJid[0];

    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
      return conn.reply(m.chat, '👢 Usuario expulsado exitosamente.', m);
    } catch (e) {
      console.log('[❌ ERROR AL EXPULSAR]', e);
      return conn.reply(m.chat, '🚫 No pude expulsar al usuario. Asegúrate que no sea admin.', m);
    }
  }
};

// Detecta solo el mensaje "kick", sin prefijo
handler.customPrefix = /^kick$/i;
handler.command = new RegExp(); // comando vacío para no requerir prefijo
handler.group = true; // Solo en grupos
handler.register = true; // Opcional: para mostrar en lista

export default handler;