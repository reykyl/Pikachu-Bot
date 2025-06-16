// sinprefijo-kick.js
var handler = async (m, { conn }) => {
  if (!m.mentionedJid || !m.mentionedJid.length) {
    return m.reply("👀 Menciona a alguien para expulsarlo.");
  }
  await conn.groupParticipantsUpdate(m.chat, [m.mentionedJid[0]], "remove");
  m.reply("Ｏ(≧∇≦)Ｏ ¡Fueraaa! 🚪");
};

handler.customPrefix = /^(kick)$/i; // Sin prefijo: escucha cuando alguien dice "kick"
handler.command = new RegExp; // Esto es obligatorio para los sin prefijo

export default handler;