var handler = async (m, { conn, participants, usedPrefix, command }) => {
    

    if (!m.mentionedJid[0] && !m.quoted) {
        return conn.reply(m.chat, `${emojis} ¡Pika! Debes mencionar a un entrenador para expulsarlo del grupo.`, m);
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    if (user === conn.user.jid) {
        return conn.reply(m.chat, `${emojis} ¡Pikachu no se puede autoeliminar!`, m);
    }

    if (user === ownerGroup) {
        return conn.reply(m.chat, `${emojis} ¡Ese es el maestro Pokémon del grupo, no puedo expulsarlo!`, m);
    }

    if (user === ownerBot) {
        return conn.reply(m.chat, `${emojis} ¡Ese es el dueño del bot Pikachu, no puedo atacarlo!`, m);
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

    conn.reply(m.chat, `${emojis} ¡Pika Pika! Un entrenador ha sido expulsado del gimnasio.`, m);
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.admin = true;
handler.group = true;
handler.register = true;
handler.botAdmin = true;

export default handler;