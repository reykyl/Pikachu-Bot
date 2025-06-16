var handler = async (m, { conn, participants, usedPrefix, command }) => {
    const texto = m.text?.trim().toLowerCase() || '';
    const comandos = ['kick', 'echar', 'hechar', 'sacar', 'ban'];

    const coincidencia = comandos.find(cmd => texto.startsWith(usedPrefix + cmd) || texto.startsWith(cmd));
    if (!coincidencia) return;

    const pikachu = 'Ｏ(≧∇≦)Ｏ🧃';
    const sadchu = 'Ｏ(≧∇≦)Ｏ🧃';

    if (!m.mentionedJid[0] && !m.quoted) {
        return conn.reply(m.chat, `${pikachu} ¡Pika Pika! Debes mencionar a alguien para expulsarlo del grupo.`, m);
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    if (user === conn.user.jid) {
        return conn.reply(m.chat, `${sadchu} ¡Pika! No puedo eliminarme a mí mismo.`, m);
    }

    if (user === ownerGroup) {
        return conn.reply(m.chat, `${sadchu} ¡Pikachu no se mete con el líder del grupo!`, m);
    }

    if (user === ownerBot) {
        return conn.reply(m.chat, `${sadchu} ¡Ese es mi entrenador! No puedo hacer eso.`, m);
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    conn.reply(m.chat, `${pikachu} ¡Pika Pika! Usuario eliminado con un Impactrueno.`, m);
};

// No dependemos del sistema de prefijos aquí
handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = /^$/; // No usamos esta detección
handler.admin = true;
handler.group = true;
handler.register = true;
handler.botAdmin = true;

export default handler;