let handler = async (m, { conn }) => {
  await conn.reply(m.chat, 'Hola ⚡ Cómo estás', m)
}

handler.command = ['hola'] 

export default handler


// Deylin 
/*const handler = async (m, { conn, text, usedPrefix, command }) => {
    return conn.reply(m.chat, `Hola XD`, m, rcanal)
};
 handler.command = ['xd'];

export default handler;*/