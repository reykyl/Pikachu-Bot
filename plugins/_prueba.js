import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `🎥 *Enlace faltante*\n\nUsa el comando así:\n${usedPrefix + command} https://youtu.be/tuVideo`, m);
  }

  const url = args[0];
  const apiUrl = `https://mode-api-sigma.vercel.app/api/mp4?url=${url}`;

  try {
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.video?.download?.url) {
      throw '❌ No se pudo descargar el contenido.';
    }

    const info = json.video;
    const media = info.download;

    const caption = `🎬 *Título:* ${info.title}\n👤 *Autor:* ${info.author}\n📦 *Tamaño:* ${media.size}\n🎚️ *Calidad:* ${media.quality}\n📁 *Tipo:* ${media.extension.toUpperCase()}`;

    await conn.sendMessage(m.chat, { image: { url: info.image }, caption }, { quoted: m });

    await conn.sendFile(
      m.chat,
      media.url,
      media.filename,
      null,
      m
    );
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `⚠️ *Error al descargar el video.*\nEs posible que el enlace esté roto o el video sea privado.`, m);
  }
};

handler.help = ['ytmp4 <url>'];
handler.tags = ['descargas'];
handler.command = ['ytmp4'];
handler.register = true;

export default handler;