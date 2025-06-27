import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args.length) {
    return conn.reply(m.chat, `🎥 *¿Qué video deseas buscar?*\n\nUsa el comando así:\n${usedPrefix + command} Alok Headlights`, m);
  }

  const searchText = args.join(' ');
  let searchResult = await yts(searchText);

  if (!searchResult.videos.length) {
    return conn.reply(m.chat, `❌ *No se encontró ningún video con ese nombre.*`, m);
  }

  let video = searchResult.videos[0]; // primer resultado
  let apiUrl = `https://mode-api-sigma.vercel.app/api/mp4?url=${video.url}`;

  try {
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.video?.download?.url) {
      throw '❌ No se pudo descargar el contenido.';
    }

    const info = json.video;
    const media = info.download;

    const infoMessage = `🎬 *Título:* ${info.title}\n👤 *Autor:* ${info.author}\n📦 *Tamaño:* ${media.size}\n🎚️ *Calidad:* ${media.quality}\n📁 *Tipo:* ${media.extension.toUpperCase()}`;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: "¡Pika Pikachu-bot! El bot eléctrico que necesitas.",
          mediaType: 1,
          previewType: 0,
          mediaUrl: video.url,
          sourceUrl: video.url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    };

    await m.react('🎧');
    await conn.reply(m.chat, infoMessage, m, JT);

    await conn.sendFile(
      m.chat,
      media.url,
      media.filename,
      null,
      m
    );
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `⚠️ *Error al descargar el video.*\nVerifica si es muy largo, privado o restringido.`, m);
  }
};

handler.help = ['play2 <nombre del video>'];
handler.tags = ['descargas'];
handler.command = ['play2'];
handler.register = true;

export default handler;