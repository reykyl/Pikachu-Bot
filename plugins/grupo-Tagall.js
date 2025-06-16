const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
  const mensajeTexto = m.text?.toLowerCase() || '';

  // Detectar si es 'tagall' o 'todos', con o sin prefijo
  if (!/^(\W*)?(tagall|todos)$/.test(mensajeTexto.trim())) return;

  const customEmoji = global.db?.data?.chats?.[m.chat]?.customEmoji || '⚡';
  m.react?.(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail?.('admin', m, conn);
    return;
  }

  const countryFlags = {
    "52": "🇲🇽", "54": "🇦🇷", "55": "🇧🇷", "57": "🇨🇴", "58": "🇻🇪", "51": "🇵🇪",
    "591": "🇧🇴", "593": "🇪🇨", "595": "🇵🇾", "598": "🇺🇾", "507": "🇵🇦",
    "502": "🇬🇹", "503": "🇸🇻", "504": "🇭🇳", "505": "🇳🇮", "506": "🇨🇷"
  };

  const getPrefix = number => {
    for (let i = 4; i >= 1; i--) {
      const sub = number.slice(0, i);
      if (countryFlags[sub]) return sub;
    }
    return null;
  };

  const mensaje = args.join(' ');
  const info = mensaje
    ? `╰🧭 *Mensaje:* ${mensaje}`
    : "╰⚠️ *Invocación general de Pika-bot: los administradores te necesitan.*";

  let listaUsuarios = participants.map(miembro => {
    const number = miembro.id.replace(/\D/g, '');
    const prefix = getPrefix(number);
    const flag = countryFlags[prefix] || "🌐";
    return `⚡ ${flag} @${number}`;
  }).join('\n');

  const texto = `
╭─〔⚡ 𝐏𝐈𝐊𝐀𝐋𝐋 ⚡〕──⬣
│ 🧑‍🤝‍🧑 *Miembros:* ${participants.length}
│ 🏷️ *Grupo:* ${await conn.getName(m.chat)}
${info}
╰────⬣

${listaUsuarios}

🔋 𝐄𝐧𝐞𝐫𝐠í𝐚 𝐋𝐢𝐛𝐞𝐫𝐚𝐝𝐚 ⚡
✨ *by Pikachu™* 🧃
  `.trim();

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: participants.map(p => p.id)
  }, { quoted: m });
};

// Con este truco ya no necesitas prefijo
handler.command = /^$/; // Desactiva el uso tradicional de comandos con prefijo
handler.customPrefix = /^(\W*)?(tagall|todos)$/i; // Detecta 'tagall' o 'todos' con o sin prefijo
handler.group = true;

export default handler;