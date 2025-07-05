import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return conn.reply(m.chat, `Usa: ${usedPrefix}${command} https://qu.ax/abc123`, m);
  const url = args[0];

  await m.reply('⏳ Obteniendo video de qu.ax...');

  try {
    
    const res = await fetch(url);
    const html = await res.text();

    
    const videoUrlMatch = html.match(/<source[^>]+src="([^"]+)"/i);

    if (!videoUrlMatch) {
      return conn.reply(m.chat, '❌ No se pudo encontrar la URL directa del video.', m);
    }

    const videoUrl = videoUrlMatch[1];

    await m.reply('⏳ Descargando video...');

    
    const videoRes = await fetch(videoUrl);
    if (!videoRes.ok) throw new Error('Error descargando video');
    const buffer = await videoRes.arrayBuffer();

    
    await conn.sendMessage(m.chat, { video: Buffer.from(buffer), mimetype: 'video/mp4', caption: '🎥 Aquí tienes tu video de qu.ax' }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '❌ Ocurrió un error descargando el video.', m);
  }
}

handler.help = ['quax <url>'];
handler.tags = ['downloader'];
handler.command = /^quax$/i;

export default handler;