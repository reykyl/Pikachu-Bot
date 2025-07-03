import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) return m.reply(`🎵 Escribe el nombre de la canción.\n\nEjemplo:\n${usedPrefix + command} Bad Bunny - Tití me preguntó`);

  try {
    const query = args.join(' ');
    const searchUrl = `https://ytumode-api.vercel.app/api/search?q=${encodeURIComponent(query)}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData?.status || !searchData.result?.[0]) {
      return m.reply('❌ No se encontró ningún resultado.');
    }

    const { title, url, duration, thumbnail } = searchData.result[0];

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `🎵 *Título:* ${title}\n⏱️ *Duración:* ${duration}\n🔗 *Fuente:* YouTube\n\n📥 *Descargando audio...*`,
    }, { quoted: m });

    const mp3Url = `https://mode-api-sigma.vercel.app/api/mp3?url=${encodeURIComponent(url)}`;
    const mp3Res = await fetch(mp3Url);
    const mp3Data = await mp3Res.json();

    if (!mp3Data?.status || !mp3Data.result?.url) {
      return m.reply('❌ No se pudo obtener el audio desde tu API.');
    }

    await conn.sendMessage(m.chat, {
      audio: { url: mp3Data.result.url },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
    }, { quoted: m });

  } catch (e) {
    console.error('[❌ ERROR en applemusic]:', e);
    m.reply('❌ Ocurrió un error al buscar o descargar la canción.');
  }
};

handler.help = ['applemusic'].map(v => v + ' <texto>');
handler.tags = ['downloader'];
handler.command = /^applemusic$/i;

export default handler;