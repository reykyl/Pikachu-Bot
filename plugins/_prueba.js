

const handler = async (m, { conn, text, usedPrefix, command }) => {
    return conn.reply(m.chat, `Hola XD`, m, rcanal)
};
 handler.command = ['xd'];

export default handler;