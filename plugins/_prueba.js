const handler = async (m, { conn }) => {
  const codigo = 'DESC20';
  const bloque = ['```', codigo, '```'].join('\n');

  await conn.sendMessage(m.chat, {
    text: bloque
  }, { quoted: m });
};

handler.command = ['copiarcodigo'];
export default handler;