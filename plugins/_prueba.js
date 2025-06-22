const handler = async (m, { conn }) => {
      //const taguser = `@${who.split("@")[0]}`;
return conn.reply(m.chat, `hola ${global.taguser} ${global.saludo}`, m)};

handler.command = ['hola'];

export default handler;