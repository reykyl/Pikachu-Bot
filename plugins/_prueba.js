
import fetch from 'node-fetch';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, command }) => {
  if (!text || !/^https?:\/\/(www\.)?viddey\.cc\/\S+/.test(text)) {
    throw `🚫 Enlace inválido. Usa el comando así:\n\n*${command} https://viddey.cc/a41-2/*`;
  }

  await m.reply('⏳ Obteniendo video desde Viddey...');

  try {
    const res = await fetch(text);
    const html = await res.text();
    const $ = cheerio.load(html);

    
    const videoUrl = $('video source').attr('src') || $('video').attr('src');

    if (!videoUrl) {
      throw '❌ No se encontró el video. El sitio puede haber cambiado o el video fue eliminado.';
    }

    
    const finalUrl = videoUrl.startsWith('http') ? videoUrl : `https://viddey.cc${videoUrl}`;

    await conn.sendFile(m.chat, finalUrl, 'video.mp4', `✅ Video descargado desde Viddey`, m);
  } catch (e) {
    console.error(e);
    m.reply(`⚠️ Error al obtener el video:\n${e.message || e}`);
  }
};

handler.command = ['viddey', 'vdown'];
export default handler;