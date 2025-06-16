/* Hecho por Angel Brou mejorado por Kirito */

import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `⚡ Por favor, ingresa el nombre de una canción de Spotify.`, m, rcanal);
  
  await m.react('🕒');
  conn.reply(m.chat, `*🎧 Buscando tu canción en Spotify...*`, m, rcanal);
  
  try {
    let res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    let gyh = await res.json();

    if (!gyh.result || !gyh.result.downloadUrl) throw '❌ No se encontró ninguna canción.';

    const { title, url, thumbnail, duration, playcount } = gyh.result;
    const doc = {
      audio: { url: gyh.result.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: url,
          title: title,
          body: `Duración: ${duration} | Reproducciones: ${playcount || 'N/D'}`,
          sourceUrl: url,
          thumbnailUrl: thumbnail || "https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/refs/heads/main/src/IMG-20250613-WA0194.jpg",
          renderLargerThumbnail: true
        }
      }
    };

    await conn.sendMessage(m.chat, doc, { quoted: m });
    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, '🚫 Hubo un error al buscar la canción.', m);
  }
};

handler.help = ['spotify *<texto>*'];
handler.tags = ['descargas'];
handler.command = ['spotify'];

export default handler;