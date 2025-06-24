const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
    if (usedPrefix.toLowerCase() === 'a') return;

    const customEmoji = global.db?.data?.chats?.[m.chat]?.customEmoji || '🧃';
    m.react(customEmoji);

    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        return;
    }

    const mensaje = args.join` `;
    const info = mensaje ? `╰➤ ✉️ *Mensaje:* ${mensaje}` : "╰➤ ⚠️ *Invocación general*";

    let texto = `
╭══ *LLAMADO A TODOS* ══⬣
│  🧃 *Total:* ${participants.length}
│  ⚡ *Grupo:* ${await conn.getName(m.chat)}
${info}
╰═══⬣\n`;

    // ⚡ Peticiones en paralelo para mayor velocidad
    const resultados = await Promise.all(participants.map(async (miembro) => {
        const number = miembro.id.split('@')[0];
        try {
            const res = await fetch(`https://g-mini-ia.vercel.app/api/infonumero?numero=${number}`);
            const data = await res.json();
            return `┃ ${data.bandera || "🌐"} @${number}`;
        } catch (e) {
            console.log(`❌ Error obteniendo bandera de ${number}:`, e);
            return `┃ 🌐 @${number}`;
        }
    }));

    texto += `╰══⬣\n✨ *${dev}* ⚔️`;

    conn.sendMessage(m.chat, {
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