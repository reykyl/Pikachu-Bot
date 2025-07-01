import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted || !m.quoted.fileSha256) {
    return m.reply(`📸 Responde a una imagen con *${usedPrefix + command}* para convertirla en anime.`);
  }

  let mime = m.quoted.mimetype || '';
  if (!/image\/(jpe?g|png)/.test(mime)) {
    return m.reply('🚫 Solo se permiten imágenes en formato JPG o PNG.');
  }

  try {
    const imgBuffer = await m.quoted.download();

    m.reply('🎨 Convirtiendo tu imagen a estilo anime...');

    
    const form = new FormData();
    form.append('data', imgBuffer, { filename: 'input.jpg' });

    
    const response = await fetch('https://hf.space/embed/TachibanaYoshino/AnimeGANv2/+/api/predict/', {
      method: 'POST',
      body: form,
    });

    const json = await response.json();

    const animeUrl = json?.data?.[0]?.[0];
    if (!animeUrl) {
      return m.reply('❌ No se pudo obtener la imagen estilo anime. Intenta con otra foto.');
    }

    
    const animeRes = await fetch(animeUrl);
    const animeBuffer = await animeRes.buffer();

    await conn.sendFile(m.chat, animeBuffer, 'anime.jpg', '✨ Aquí está tu versión anime', m);

  } catch (err) {
    console.error(err);
    m.reply('❌ Error al procesar tu imagen. Intenta nuevamente.');
  }
};

handler.help = ['anime'];
handler.tags = ['ai', 'fun'];
handler.command = /^anime$/i;

export default handler;