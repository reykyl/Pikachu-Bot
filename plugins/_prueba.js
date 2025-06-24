let handler = async (m, { conn }) => {
  const texto = 'Hola';
  const bloqueCodigo = ['```', texto, '```'].join('\n');

  await conn.sendMessage(m.chat, {
    text: 'hola',
    text: bloqueCodigo
  }, { quoted: m });
};

handler.command = ['h'];
export default handler;