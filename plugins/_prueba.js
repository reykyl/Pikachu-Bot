let handler = async (m, { conn }) => {
  const meme = 'https://i.pinimg.com/736x/18/8f/02/188f02fa1535296a47943f1e28e2cc6b.jpg';
  const texto = `
╭─〔 *🟡 𝑴𝑬𝑴𝑬 𝑫𝑬 𝑳𝑨 𝑯𝑶𝑹𝑨* 〕─⬣
│📸 Disfruta este meme fresco 😄
│🌐 Fuente: ${meme}
╰─────────────⬣`.trim();

  try {
    await conn.sendMessage('0029VbAix53FnSz4CU0a580q@newsletter', {
      image: { url: meme },
      caption: texto
    }, { upload: conn.waUploadToServer });
    m.reply('✅ Meme enviado manualmente al canal');
  } catch (e) {
    m.reply('❌ Error al enviar: ' + e.message);
  }
};

handler.command = /^probarcanal$/i;
export default handler;