let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❗Escribe el texto que quieres que sea copiable.\nEjemplo: *.copiar Hola mundo*');
  const bloqueCodigo = ['```', text, '```'].join('\n');

  await conn.sendMessage(m.chat, {
    text: bloqueCodigo
  }, { quoted: m });
};

handler.command = ['copiar'];
export default handler;