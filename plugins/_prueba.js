import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted || !m.quoted.fileSha256) {
    return m.reply(`📸 Responde a una imagen con *${usedPrefix + command}* para convertirla en anime.`);
  }

  let mime = m.quoted.mimetype || '';
  if (!/image\/(jpe?g|png)/.test(mime)) {
    return m.reply('🚫 Solo se permiten imágenes en formato .jpg o .png.');
  }

  try {
    const imgBuffer = await m.quoted.download(); // descarga la imagen enviada

    m.reply('🎨 Convirtiendo tu imagen a estilo anime, espera un momento...');

    
    const res = await fetch('https://g-mini-ia.vercel.app/api/toanimeconverter.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: imgBuffer
    });

    if (!res.ok) throw await res.text();

    let animeImg = await res.buffer();

    await conn.sendFile(m.chat, animeImg, 'anime.jpg', '✨ Aquí está tu versión anime!', m);

  } catch (err) {
    console.error(err);
    m.reply('❌ Hubo un error al procesar tu imagen. Asegúrate de que la API esté funcionando correctamente.');
  }
};

handler.help = ['anime'];
handler.tags = ['ai', 'fun'];
handler.command = /^anime$/i;

export default handler;