// comando: .applemusic Bad Bunny

import fetch from 'node-fetch'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) return m.reply(`🎵 Escribe el nombre de la canción.\n\nEjemplo:\n${usedPrefix + command} Bad Bunny - Tití me preguntó`);

  try {
    let query = args.join(" ");
    let res = await fetch(`https://ytumode-api.vercel.app/api/search?q=${encodeURIComponent(query)}`);
    let json = await res.json();

    if (!json?.status || !json.result?.[0]) throw '❌ No se encontró ningún resultado';

    let song = json.result[0];
    let { title, url, duration, thumbnail } = song;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `🎵 *Título:* ${title}\n⏱️ *Duración:* ${duration}\n📥 *Descargando audio...*`,
    }, { quoted: m });

    // Ahora descargar el audio en mp3
    let downloadRes = await fetch(`https://mode-api-sigma.vercel.app/api/mp3?url=${encodeURIComponent(url)}`);
    let data = await downloadRes.json();
    if (!data?.status) throw '❌ Error al obtener el audio';

    await conn.sendMessage(m.chat, {
      audio: { url: data.result.url },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.log(e);
    m.reply('❌ Ocurrió un error al buscar o descargar la canción.');
  }
};

handler.help = ['applemusic'].map(v => v + ' <texto>');
handler.tags = ['downloader'];
handler.command = /^applemusic$/i;

export default handler;