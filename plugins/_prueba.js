

const handler = async (m, { conn, text, usedPrefix, command }) => {
    return conn.reply(m.chat, "*Ｏ(≧∇≦)Ｏ🧃* *Pikachu-Bot* | Dime el nombre de la canción que estás buscando, ¡Pika!", m, rcanal)
};
 handler.command = ['xd'];

export default handler;