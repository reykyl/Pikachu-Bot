let handler = async (m, { conn }) => {
  const meme = 'https://i.pinimg.com/736x/7a/c6/27/7ac62716f5ebba2cad1c2239e482b763.jpg';
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