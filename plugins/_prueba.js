import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `✧ Ejemplo: ${usedPrefix}${command} Waguri Edit`, m);

  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }});

  let results = await yts(text);
  let tes = results.videos[0];
  if (!tes) return conn.reply(m.chat, 'No se encontró ningún video.', m);

  const apiUrl = `https://www.apis-anomaki.zone.id/downloader/ytv?url=${encodeURIComponent(tes.url)}`;

  const respuesta = await fetch(apiUrl);
  if (!respuesta.ok) return conn.reply(m.chat, 'Error al obtener datos de la API.', m);

  const keni = await respuesta.json();
  const format = keni.result.formats[0];
  if (!format || !format.url) return conn.reply(m.chat, 'No hay URL de video disponible.', m);

  const { url, qualityLabel = 'no encontrado', fps = 'no encontrado' } = format;
  const { title } = keni.result;

  const safeTitle = title.replace(/[\\\/:*?"<>|]/g, '');

  const caption = `
*💮 PLAY VIDEO 💮*

✧ : \`titulo;\` ${tes.title || 'no encontrado'}
✧ : \`duracion;\` ${tes.duration || 'no encontrado'}
✧ : \`calidad;\` ${qualityLabel}
✧ : \`fps;\` ${fps}

> ${wm}
> Pedido de @${m.sender.split('@')[0]}`;

  await conn.sendMessage(m.chat, {
    video: { url },
    mimetype: "video/mp4",
    fileName: `${safeTitle}.mp4`,
    caption,
    mentions: [m.sender]
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }});
};

handler.help = ['playvideo *<consulta>*'];
handler.tags = ['descargas'];
handler.command = /^(playvideo|playvid)$/i;

export default handler;