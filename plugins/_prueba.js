let handler = async (m, { conn }) => {
  const texto = `h text`;

  
  const bloqueCodigo = [
    '```',
    texto,
    '```'
  ].join('\n');

  await conn.sendMessage(m.chat, {
    text: bloqueCodigo
  }, { quoted: m });
};

handler.command = ['h'];
export default handler;