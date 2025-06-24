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
╰═══⬣`;

    // Promesas limitadas a 5 por segundo (anti-abuso de la API)
    const resultados = [];
    for (let i = 0; i < participants.length; i++) {
        const number = participants[i].id.split('@')[0];
        try {
            const res = await fetch(`https://g-mini-ia.vercel.app/api/infonumero?numero=${number}`);
            const data = await res.json();
            resultados.push(`┃ ${data.bandera || "🌐"} @${number}`);
        } catch (e) {
            console.error(`❌ Error al obtener la bandera de ${number}:`, e);
            resultados.push(`┃ 🌐 @${number}`);
        }

        // Retraso opcional si hay demasiados usuarios
        if (participants.length > 20 && i % 5 === 0) await new Promise(res => setTimeout(res, 300));
    }

    texto += `\n${resultados.join('\n')}\n╰══⬣\n✨ *Pikachu Bot* ⚡`;

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