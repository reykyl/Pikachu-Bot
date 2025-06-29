import fetch from 'node-fetch';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, command }) => {
  if (!text || !/^https?:\/\/(www\.)?(viddey\.cc|xnxx\.es)\/\S+/.test(text)) {
    throw `🚫 Enlace inválido. Usa el comando así:\n\n*${command} <enlace de viddey.cc o xnxx.es>*`;
  }

  await m.reply('⏳ Procesando el video, por favor espera...');

  try {
    const res = await fetch(text);
    const html = await res.text();
    const $ = cheerio.load(html);

    let videoUrl;

    if (/viddey\.cc/.test(text)) {
      videoUrl = $('video source').attr('src') || $('video').attr('src');
      if (!videoUrl) throw '❌ No se encontró el video en Viddey.';
      if (!videoUrl.startsWith('http')) videoUrl = `https://viddey.cc${videoUrl}`;
    } else if (/xnxx\.es/.test(text)) {
      const jsonScript = $('script[type="application/ld+json"]').html();
      const jsonData = JSON.parse(jsonScript);
      videoUrl = jsonData.contentUrl;
      if (!videoUrl) throw '❌ No se encontró el video en XNXX.';
    }

    await conn.sendFile(m.chat, videoUrl, 'video.mp4', `✅ Video descargado con éxito`, m);
  } catch (e) {
    console.error(e);
    m.reply(`⚠️ Error al obtener el video:\n${e.message || e}`);
  }
};

handler.command = ['viddey', 'vdown', 'xnxx'];
export default handler;