let handler = async (m, { conn }) => {
  const texto = 'Hola';
  const bloqueCodigo = [ hola, '```', texto, '```'].join('\n');

  await conn.sendMessage(m.chat, {
    text: bloqueCodigo
  }, { quoted: m });
};

handler.command = ['h'];
export default handler;