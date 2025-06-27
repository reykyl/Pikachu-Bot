/*import fetch from 'node-fetch';
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
          thumbnail: global.thumb,
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

export default handler;*/

import fetch from 'node-fetch';
import yts from 'yt-search';
import { fileTypeFromBuffer } from 'file-type'; // Opcional para validar mime

async function resolveRedirect(url) {
  // Resuelve la URL final siguiendo redirecciones HTTP
  const res = await fetch(url, {
    method: 'HEAD',
    redirect: 'follow',
  });
  return res.url || url;
}

let handler = async (m, { conn, args, usedPrefix }) => {
  if (!args.length) {
    return conn.reply(m.chat, `🎧 *¿Qué canción deseas buscar?*\n\nUsa:\n${usedPrefix}playaudio Alan Walker Faded`, m);
  }

  const searchText = args.join(' ');
  const searchResult = await yts(searchText);

  if (!searchResult.videos.length) {
    return conn.reply(m.chat, `❌ *No se encontró ningún resultado para:* "${searchText}"`, m);
  }

  const video = searchResult.videos[0];
  const apiUrl = `https://mode-api-sigma.vercel.app/api/mp3?url=${encodeURIComponent(video.url)}`;

  try {
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.audio || !json.audio.download || !json.audio.download.url) {
      return conn.reply(m.chat, `❌ *La API no devolvió un enlace válido.*`, m);
    }

    const media = json.audio.download;
    let audioUrl = media.url;

    
    audioUrl = await resolveRedirect(audioUrl);

    
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) throw new Error('No se pudo descargar el audio.');

    const audioBuffer = await audioRes.buffer();

    
    /*
    const type = await fileTypeFromBuffer(audioBuffer);
    const mime = type?.mime || 'audio/mpeg';
    */

    const caption = `🎵 *Título:* ${json.audio.title}\n👤 *Autor:* ${json.audio.author}\n📦 *Tamaño:* ${media.size}\n🎧 *Calidad:* ${media.quality}`;

    await conn.sendMessage(m.chat, {
      image: { url: json.audio.image },
      caption
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      fileName: media.filename || 'audio.mp3',
      mimetype: 'audio/mpeg', 
      ptt: false
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, `⚠️ *Error al descargar o enviar el audio.*\n${error.message}`, m);
  }
};

handler.help = ['playaudio <nombre>'];
handler.tags = ['descargas'];
handler.command = ['playaudio'];
handler.register = true;

export default handler;