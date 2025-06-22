import { igdl } from 'ruhend-scraper';

const handler = async (m, { text, conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emojis} ¡Pika! Necesitas enviar un enlace de Facebook para descargar.`, m, rcanal);
  }

  let res;
  try {
    await m.react(rwait);
    res = await igdl(args[0]);
  } catch (e) {
    return conn.reply(m.chat, `${emojis} Pika... hubo un error al obtener los datos. ¿Seguro que el enlace es válido?`, m, rcanal);
  }

  let result = res?.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, `${emojis} Pikachu no encontró nada... prueba con otro link.`, m, rcanal);
  }

  // Buscar el mejor video o imagen
  let data = result.find(i => i.url && i.url.endsWith('.mp4') && i.resolution === "720p (HD)") ||
             result.find(i => i.url && i.url.endsWith('.mp4') && i.resolution === "360p (SD)") ||
             result.find(i => i.url && i.url.endsWith('.jpg') || i.url.endsWith('.png'));

  if (!data) {
    return conn.reply(m.chat, `${emojis} No se encontró contenido multimedia compatible (video o imagen).`, m, rcanal);
  }

  const isVideo = data.url.endsWith('.mp4');
  const isImage = data.url.endsWith('.jpg') || data.url.endsWith('.png');

  let {
    title = "Desconocido",
    duration = "No disponible",
    size = "Desconocido",
    resolution = data.resolution || "Sin datos",
    thumbnail
  } = data;

  let infoMsg = `
⚡─────『 𝑷𝒊𝒌𝒂𝒄𝒉𝒖 𝑩𝒐𝒕 ⚡️』─────⚡

🎞️ *Resolución:* ${resolution}
🌐 *Origen:* Facebook
🔗 *Enlace:* ${args[0]}

💛 ¡Pika-Pika! Aquí tienes tu archivo multimedia. ¡Disfrútalo!

─────────────────────────`.trim();

  try {
    if (isVideo) {
      await conn.sendMessage(m.chat, {
        video: { url: data.url },
        caption: infoMsg,
        fileName: 'facebook_video.mp4',
        mimetype: 'video/mp4'
      }, { quoted: m });
    } else if (isImage) {
      await conn.sendMessage(m.chat, {
        image: { url: data.url },
        caption: infoMsg
      }, { quoted: m });
    }

    await m.react(done);
  } catch (e) {
    await m.react(error);
    return conn.reply(m.chat, `${emojis} Pikachu se enredó con los cables... no se pudo enviar el contenido.`, m, rcanal);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;