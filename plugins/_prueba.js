var handler = async (m, { conn, participants, isAdmin, isBotAdmin, args, usedPrefix, command }) => 
{
  await conn.reply(m.chat, `hola soy bajo perfil🐉`  ', m, rcanal)
}

handler.command = ['soy'] 

export default handler


//@⁨~NEOTOKIO⁩
/*let handler = async (m, { conn }) => {
  await conn.reply(m.chat, 'Hola ⚡ Cómo estás', m)
}

handler.command = ['hola'] 

export default handler*/


// Deylin 
/*const handler = async (m, { conn, text, usedPrefix, command }) => {
    return conn.reply(m.chat, `Hola XD`, m, rcanal)
};
 handler.command = ['xd'];

export default handler;*/