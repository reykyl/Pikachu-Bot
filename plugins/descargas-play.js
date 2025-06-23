import yts from 'yt-search';
import fs from 'fs';
import axios from 'axios';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const MAX_RETRIES = 2;
const TIMEOUT_MS = 10000;
const RETRY_DELAY_MS = 12000;


const getUserGreeting = (userNumber, limaTime) => {
  const hour = limaTime.getHours();
  return `${getGreeting(hour)} @${userNumber}`;
};

const isUserBlocked = (userId) => {
  try {
    const blockedUsers = JSON.parse(fs.readFileSync('./bloqueados.json', 'utf8'));
    return blockedUsers.includes(userId);
  } catch {
    return false;
  }
};

const getDownloadUrl = async (videoUrl) => {
  const apis = [{ url: 'https://api.vreden.my.id/api/ytmp3?url=', type: 'vreden' }];
  for (const api of apis) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await axios.get(`${api.url}${encodeURIComponent(videoUrl)}`, { timeout: TIMEOUT_MS });
        const res = response.data?.result?.download;
        if (res?.url && res?.status) {
          return {
            url: res.url.trim(),
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

const sendAudioPika = async (conn, chat, audioUrl, videoTitle, thumb) => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await conn.sendMessage(chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `${videoTitle}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: videoTitle,
            body: "¡Pika Pikachu-Bot! El bot eléctrico que necesitas.",
            thumbnail: thumb,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
          }
        }
      });
      return true;
    } catch {
      if (attempt < MAX_RETRIES - 1) await wait(RETRY_DELAY_MS);
    }
  }
  return false;
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const userId = m.sender;
  if (isUserBlocked(userId)) {
    return conn.reply(m.chat, '🚫 Lo siento, estás en la lista de usuarios bloqueados.', m);
  }

  if (!text || !text.trim()) {
    return conn.reply(
      m.chat,
      `*Ｏ(≧∇≦)Ｏ🧃* *Pikachu-Bot* | Dime el nombre de la canción que estás buscando, ¡Pika!`,
      m
    );
  }

  const limaTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }));
  const userNumber = m.sender.split('@')[0];

  const loading = await conn.reply(
    m.chat,
    `${getUserGreeting(userNumber, limaTime)}\n🔍 *Estoy buscando tu canción, dame un momento... Pika!*`,
    m,
    { mentions: [m.sender] }
  );

  await conn.sendMessage(m.chat, { react: { text: '⚡', key: loading.key } }, { quoted: m });

  try {
    const searchResults = await yts(text.trim());
    if (!searchResults?.videos?.length) throw new Error('⛔ Pikachu no encontró nada con ese nombre...');

    const videoInfo = searchResults.videos[0];
    const { title, timestamp: duration, views, ago, url: videoUrl, image } = videoInfo;

    let thumb = null;
    try {
      const res = await axios.get(image, { responseType: 'arraybuffer' });
      thumb = Buffer.from(res.data, 'binary');
    } catch {}

    const ficha = `⚡🐭 \`Pikachu-Bot - Descargas Pokémon\`

*🎵 Título:* ${title}
> 🎬 *Duración:* ${duration || 'Desconocida'}
> 🎤 *Canal:* ${videoInfo.author?.name || 'Desconocido'}
> 👀 *Vistas:* ${views.toLocaleString()}
> 📅 *Publicado:* ${ago || 'Desconocido'}
> 🔗 *Enlace:* ${videoUrl}`;

    await conn.reply(
      m.chat,
      ficha,
      m,
      {
        contextInfo: {
          externalAdReply: {
            title: title,
            body: "¡Pika Pikachu-Bot! El bot eléctrico que necesitas.",
            thumbnail: thumb,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: videoUrl
          }
        }
      }
    );

    const downloadData = await getDownloadUrl(videoUrl);
    if (!downloadData || !downloadData.url) {
      await conn.sendMessage(m.chat, { react: { text: '🔴', key: loading.key } });
      throw new Error('❌ Pikachu no pudo descargar la canción desde ninguna fuente.');
    }

    await conn.sendMessage(m.chat, { react: { text: '🟢', key: loading.key } });
    const success = await sendAudioPika(conn, m.chat, downloadData.url, title, thumb);
    if (!success) throw new Error('❌ Pikachu falló al enviar la música.');

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '🔴', key: loading.key } });
    return conn.reply(m.chat, `⚠️ Ocurrió un error eléctrico: ${error.message}`, m);
  }
};

handler.command = /^play$/i;
handler.help = ['play <canción>'];
handler.tags = ['descargas'];

export default handler;