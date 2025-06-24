let handler = async (m, { conn, args, participants, usedPrefix, command }) => {

  if (!m.isGroup) {
    return conn.reply(m.chat, `${emojis} Este comando solo funciona en grupos.`, m, rcanal);
  }

  let prefix = (args[0] || '').replace(/[^\d+]/g, '');
  if (!prefix || !prefix.startsWith('+') || prefix.length < 3) {
    return conn.reply(m.chat, `⚠️ Usa el comando correctamente.\n\n*Ejemplo:* ${usedPrefix + command} +504`, m, rcanal);
  }

  let matching = participants
    .map(u => u.id)
    .filter(jid => jid.startsWith(prefix.replace('+', '')));

  if (matching.length === 0) {
    return conn.reply(m.chat, `${emojis} No encontré usuarios con el prefijo *${prefix}*.`, m, rcanal);
  }

  let text = `*${emojis} ¡Pika Pika! Lista de números que comienzan con ${prefix}*\n\n`;
  text += matching.map((u, i) => `${i + 1}. @${u.split('@')[0]}`).join('\n');
  text += `\n\n🌎 Total encontrados: *${matching.length}*`;

  await conn.reply(m.chat, text, m, { mentions: [m.sender], ...rcanal });
};

handler.help = ['litsnuber +prefijo'];
handler.tags = ['grupo'];
handler.command = /^litsnuber$/i;
handler.group = true;

export default handler;