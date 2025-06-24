const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix.toLowerCase() === 'a') return;

  const customEmoji = global.db?.data?.chats?.[m.chat]?.customEmoji || '🧃';
  m.react(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    return;
  }

  const dev = 'By: 𝐁𝐨𝐭 𝐳𝐳𝐳';
  const mensaje = args.join` `;
  const info = mensaje ? `╰➤ ✉️ *Mensaje:* ${mensaje}` : '╰➤ ⚠️ *Invocación general*';

  const countryFlags = {
    "1": "🇺🇸", "44": "🇬🇧", "52": "🇲🇽", "54": "🇦🇷", "55": "🇧🇷",
    "57": "🇨🇴", "58": "🇻🇪", "34": "🇪🇸", "91": "🇮🇳", "51": "🇵🇪",
    // Puedes agregar más según necesites...
  };

  function getFlag(number) {
    for (let len = 4; len >= 1; len--) {
      const prefix = number.slice(0, len);
      if (countryFlags[prefix]) return countryFlags[prefix];
    }
    return "🌐";
  }

  let texto = `
╭══ *LLAMADO A TODOS* ══⬣
│  🧃 *Total:* ${participants.length}
│  ⚡ *Grupo:* ${await conn.getName(m.chat)}
${info}
╰═══⬣\n`;

  for (const user of participants) {
    const number = user.id.split('@')[0];
    const flag = getFlag(number);
    texto += `┃ ${flag} @${number}\n`;
  }

  texto += `╰══⬣\n✨ *${dev}* ⚔️`;

  await conn.sendMessage(m.chat, {
    text: texto.trim(),
    mentions: participants.map(p => p.id)
  }, { quoted: m });
};

handler.help = ['todos *<mensaje>*'];
handler.tags = ['grupo'];
handler.command = ['tagall', 'todos'];
handler.admin = true;
handler.group = true;

export default handler;