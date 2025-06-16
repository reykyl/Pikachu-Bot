// Código hecho por ChatGPT para PikachuBot ⚡

const handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  const text = m?.text?.toLowerCase()?.trim();

  // Solo se ejecuta si el mensaje es 'kick'
  if (text === 'kick') {
    if (!m.isGroup) return; // Solo en grupos
    if (!isAdmin) return conn.reply(m.chat, '⚠️ Solo los *administradores* pueden usar este comando.', m);
    if (!isBotAdmin) return conn.reply(m.chat, '🛑 El bot *no es administrador*.', m);
    if (!m.mentionedJid[0]) return conn.reply(m.chat, '❌ Tienes que *mencionar* a alguien para expulsar.', m);

    // Ejecuta la expulsión
    await conn.groupParticipantsUpdate(m.chat, [m.mentionedJid[0]], 'remove');
    return conn.reply(m.chat, '👢 Usuario expulsado correctamente.', m);
  }
};

handler.customPrefix = /^kick$/i; // Detecta el mensaje 'kick' sin prefijo
handler.command = new RegExp(); // Para que no requiera comando con prefijo
handler.group = true; // Solo en grupos

export default handler;