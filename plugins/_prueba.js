const handler = async (m, { conn }) => {
    const userId = m.mentionedJid?.[0] || m.sender
return conn.reply(m.chat, `hola @${userId.split('@')[0]} ${global.saludo}`, m)};

handler.command = ['hola'];

export default handler;