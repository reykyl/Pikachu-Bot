import { googleImage } from '@bochilteam/scraper';

const handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, '🍬 Por favor, ingresa un término de búsqueda.', m, rcanal);
  }

  await m.react(rwait);

  conn.reply(m.chat, '🍭 Descargando su imagen, espere un momento...', m, {
    contextInfo: {
      externalAdReply: {
        mediaUrl: null,
        mediaType: 1,
        showAdAttribution: true,
        title: packname,
        body: dev,
        previewType: 0,
        thumbnail: icono,
        sourceUrl: channel
      }
    }
  });

  try {
    const res = await googleImage(text);
    if (!res || !res.length) throw new Error('No se encontraron imágenes.');

    
    const getRandomImage = () => res[Math.floor(Math.random() * res.length)];

    const messages = [
      ['🖼 Imagen 1', dev, getRandomImage(), [[]], [[]], [[]], [[]]],
      ['🖼 Imagen 2', dev, getRandomImage(), [[]], [[]], [[]], [[]]],
      ['🖼 Imagen 3', dev, getRandomImage(), [[]], [[]], [[]], [[]]],
      ['🖼 Imagen 4', dev, getRandomImage(), [[]], [[]], [[]], [[]]]
    ];

    
    await conn.sendCarousel(m.chat, `🍬 Resultado de ${text}`, '⪛✰ Imagen - Búsqueda ✰⪜', null, messages, m);

  } catch (err) {
    console.error(err);
    await conn.reply(m.chat, `❌ Ocurrió un error al buscar imágenes:\n${err.message}`, m);
  }
};

handler.help = ['imagen'];
handler.tags = ['buscador', 'tools', 'descargas'];
handler.command = ['image', 'imagenh'];
handler.register = true;

export default handler;