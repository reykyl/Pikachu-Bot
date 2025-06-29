import fetch from 'node-fetch';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, command }) => {
  if (!text || !/^https?:\/\/(www\.)?\S+\.\S+/.test(text)) {
        return conn.reply(m.chat, `🚫 Enlace inválido. Usa el comando así:\n\n*${command} https://sitio.com/video123*`, m, rcanal);
  }

  await m.reply('🔍 Buscando video, espera un momento...');

  try {
    const res = await fetch(text, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    // Intenta encontrar el video por varios selectores comunes
    let videoUrl =
      $('video > source').attr('src') ||
      $('video').attr('src') ||
      $('meta[property="og:video"]').attr('content') ||
      $('meta[name="twitter:player:stream"]').attr('content');

    if (!videoUrl) {
      throw '❌ No se encontró el video. Puede que el sitio haya cambiado o el video esté restringido.';
    }

    // Si es relativo, lo volvemos absoluto
    if (!/^https?:\/\//.test(videoUrl)) {
      const baseUrl = new URL(text);
      videoUrl = baseUrl.origin + videoUrl;
    }

    await conn.sendFile(m.chat, videoUrl, 'video.mp4', `✅ Video descargado desde:\n${text}`, m);
  } catch (e) {
    console.error(e);
    await m.reply(`⚠️ Ocurrió un error:\n${e.message || e}`);
  }
};

handler.command = ['pornvid', 'xxxvid', 'vdown', 'viddey'];
handler.help = ['pornvid <url>'];
handler.tags = ['downloader', 'nsfw'];

export default handler;