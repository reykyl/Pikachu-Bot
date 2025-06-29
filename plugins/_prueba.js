import fetch from 'node-fetch';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, command }) => {
  if (!text || !/^https?:\/\/\S+/.test(text)) {
   return conn.reply(m.chat, `🚫 Enlace inválido. Usa el comando así:\n\n*${command} https://sitio.com/video123*`, m, rcanal);
  }

  await m.reply('⏳ Obteniendo video...');

  try {
    const res = await fetch(text, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const videoUrl =
      $('video source').attr('src') ||
      $('video').attr('src') ||
      $('meta[property="og:video"]').attr('content') ||
      $('meta[name="twitter:player:stream"]').attr('content');

    if (!videoUrl) {
      throw '❌ No se encontró el video. Puede que el sitio haya cambiado o el video esté protegido.';
    }

    const finalUrl = videoUrl.startsWith('http') ? videoUrl : new URL(videoUrl, text).href;

    await conn.sendFile(m.chat, finalUrl, 'video.mp4', `✅ Video descargado correctamente`, m);
  } catch (e) {
    console.error(e);
    m.reply(`⚠️ Error al obtener el video:\n${e.message || e}`);
  }
};

handler.command = ['xxx', 'porn', 'vdown'];
export default handler;