import yts from 'yt-search';
import fs from 'fs';
import axios from 'axios';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const MAX_RETRIES = 2;
const TIMEOUT_MS = 10000;
const RETRY_DELAY_MS = 12000;

const getDownloadUrl = async (videoUrl) => {
  const apis = [{ url: 'https://api.vreden.my.id/api/ytmp3?url=', type: 'vreden' }];
  for (const api of apis) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await axios.get(`${api.url}${encodeURIComponent(videoUrl)}`, { timeout: TIMEOUT_MS });
        if (
          response.data?.status === 200 &&
          response.data?.result?.download?.url &&
          response.data?.result?.download?.status === true
        ) {
          return {
            url: response.data.result.download.url.trim(),
            title: response.data.result.metadata.title
          };
        }
      } catch {
        if (attempt < MAX_RETRIES - 1) await wait(RETRY_DELAY_MS);
      }
    }
  }
  return null;
};

const sendAudioNormal = async (conn, chat, audioUrl, videoTitle) => {
  let thumbnailBuffer = null;
  try {
    const response = await axios.get('https://qu.ax/WhnpY.jpg', { responseType: 'arraybuffer' });
    thumbnailBuffer = Buffer.from(response.data, 'binary');
  } catch {}

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await conn.sendMessage(
        chat,
        {
          audio: { url: audioUrl },
          mimetype: 'audio/mpeg',
          contextInfo: {
            externalAdReply: {
              title: videoTitle,
              body: '🐭 Pikachu-Bot',
              previewType: 'PHOTO',
              thumbnail: thumbnailBuffer || null,
              mediaType: 1,
              renderLargerThumbnail: false,
              showAdAttribution: true,
            }
          }
        },
        { quoted: null }
      );
      return true;
    } catch {
      if (attempt < MAX_RETRIES - 1) await wait(RETRY_DELAY_MS);
    }
  }
  return false;
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.trim()) {
    let thumbnailBuffer = null;
    try {
      const response = await axios.get('https://qu.ax/WhnpY.jpg', { responseType: 'arraybuffer' });
      thumbnailBuffer = Buffer.from(response.data, 'binary');
    } catch {}

    return conn.reply(
      m.chat,
      `*Ｏ(≧∇≦)Ｏ🧃* *Pikachu-Bot* | Dime el nombre de la canción que estás buscando, ¡Pika!\n\n*Ejemplo:* ${usedPrefix + command} Mi Historia Entre Tus Dedos`,
      m,
      {
        contextInfo: {
          externalAdReply: {
            title: '🐭 Pikachu-Bot',
            previewType: 'PHOTO',
            thumbnail: thumbnailBuffer || null,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
            sourceUrl: 'https://youtube.com'
          }
        }
      }
    );
  }

  const reactionMessage = await conn.reply(
    m.chat,
    "⚡ Buscando tu canción... espera un momento, ¡Pika pika!",
    m
  );

  await conn.sendMessage(m.chat, { react: { text: '🔍', key: reactionMessage.key } }, { quoted: m });

  try {
    const searchResults = await yts(text.trim());
    if (!searchResults?.videos?.length) throw new Error("*(>_<)🧃* Pikachu no encontró nada con ese nombre...");

    const videoInfo = searchResults.videos[0];
    const { title, timestamp: duration, views, ago, url: videoUrl } = videoInfo;

    let thumbnailBuffer = null;
    try {
      const response = await axios.get(videoInfo.image, { responseType: 'arraybuffer' });
      thumbnailBuffer = Buffer.from(response.data, 'binary');
    } catch {}

    const description = `⚡🐭 
              \`Pikachu-Bot - Descargas Pokémon\`
*🎵 Título:* ${title}
> 🎬 *Duración:* ${duration || 'Desconocida'}
> 🎤 *Vistas:* ${views.toLocaleString()}
> 📅 *Publicado:* ${ago || 'Desconocido'}
> 🔗 *Enlace:* ${videoUrl}`;

    await conn.reply(
      m.chat,
      description,
      m,
      {
        contextInfo: {
          externalAdReply: {
            title: title,
            body: '🎵 Pikachu te trajo la info',
            previewType: 'PHOTO',
            thumbnail: thumbnailBuffer || null,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
          }
        }
      }
    );

    const downloadData = await getDownloadUrl(videoUrl);
    if (!downloadData || !downloadData.url) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: reactionMessage.key } }, { quoted: m });
      throw new Error("⛔ Pikachu no pudo descargar la canción.");
    }

    await conn.sendMessage(m.chat, { react: { text: '🎧', key: reactionMessage.key } }, { quoted: m });
    const success = await sendAudioNormal(conn, m.chat, downloadData.url, downloadData.title || title);
    if (!success) throw new Error("❌ Pikachu no pudo enviarte la canción.");

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '⚠️', key: reactionMessage.key } }, { quoted: m });
    return conn.reply(m.chat, `⚠️ Ocurrió un error eléctrico: ${error.message || 'Error desconocido'}`, m);
  }
};

handler.command = /^play$/i;
handler.help = ['play <nombre>'];
handler.tags = ['descargas'];

export default handler;