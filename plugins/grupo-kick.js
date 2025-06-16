// kick-sin-prefijo.js
var handler = async (m, { conn }) => {
  let target = m.mentionedJid?.[0] || m.quoted?.sender;

  if (!target) return m.reply("👀 Menciona o responde a alguien para expulsarlo.");
  if (!m.isGroup) return m.reply("❌ Este comando solo funciona en grupos.");
  if (!m.isGroupAdmin) return m.reply("😠 Solo los admins pueden usar este comando.");
  if (!conn.user.jid.includes('@s.whatsapp.net')) return m.reply("⚠️ El bot no tiene permisos de administrador.");

  try {
    await conn.groupParticipantsUpdate(m.chat, [target], "remove");
    m.reply("Ｏ(≧∇≦)Ｏ ¡Expulsado! 🚪");
  } catch (e) {
    m.reply("❌ No pude expulsar a ese usuario. ¿Será que es admin?");
  }
};

// Activamos detección sin prefijo
handler.customPrefix = /^(kick)$/i;
handler.command = new RegExp;

export default handler;