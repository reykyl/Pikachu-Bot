import fetch from 'node-fetch';

let handler = async (m, { conn, text, command }) => {
  if (!text) throw '🚫 Escribe algo para buscar stickers. Ej: .sticker gato';

  m.reply(`🔍 Buscando stickers de *${text}*...`);

  // Usamos una API pública para buscar imágenes de Pinterest
  const api = `https://api.akuari.my.id/pinterest?query=${encodeURIComponent(text)}`;
  const res = await fetch(api);
  const json = await res.json();

  const links = json.result;

  if (!links || links.length === 0) throw '❌ No encontré stickers. Intenta con otra palabra.';

  // Tomamos máximo 8 imágenes para el álbum
  const images = links.slice(0, 8);

  const stickerBuffers = [];

  for (let url of images) {
    try {
      let buffer = await conn.getFile(url);
      let sticker = await sticker(buffer.data, false, {
        packname: "KiritoBot",
        author: "By Deylin"
      });
      stickerBuffers.push({ sticker });
    } catch (e) {
      console.error('Error generando sticker:', e);
    }
  }

  if (stickerBuffers.length === 0) return m.reply('❌ No se pudieron crear los stickers.');

  await conn.sendAlbumMessage(m.chat, stickerBuffers, m);
};

handler.command = ['sticker', 'stickers', 'buscarsticker'];
handler.help = ['sticker <texto>'];
handler.tags = ['sticker'];

export default handler;