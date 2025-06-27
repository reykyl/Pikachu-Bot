import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `🔗 *Envía la URL del video de YouTube que deseas descargar.*\n\n📌 Ejemplo:\n${usedPrefix + command} https://www.youtube.com/watch?v=dQw4w9WgXcQ`, m);
  }

  let url = args[0];
  let api = command === 'ytmp3'
    ? `https://mode-api-sigma.vercel.app/api/mp3?url=${url}`
    : `https://mode-api-sigma.vercel.app/api/mp4?url=${url}`;

  try {
    conn.reply(m.chat, `⏳ Descargando... esto puede tardar unos segundos...`, m);
    let res = await fetch(api);
    let data = await res.json();

    if (!data || !data.url) throw new Error('❌ No se pudo obtener el archivo.');

    let caption = `✅ *Título:* ${data.title || 'Desconocido'}\n📥 *Tipo:* ${command === 'ytmp3' ? 'Audio (MP3)' : 'Video (MP4)'}`;

    await conn.sendFile(m.chat, data.url, data.title + (command === 'ytmp3' ? '.mp3' : '.mp4'), caption, m);
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `⚠️ *Error al descargar el archivo.*\nIntenta con otro enlace.`, m);
  }
};

handler.help = ['ytmp3 <url>', 'ytmp4 <url>'];
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytmp4'];
handler.register = true;

export default handler;