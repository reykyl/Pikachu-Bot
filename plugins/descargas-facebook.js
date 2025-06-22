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

  let videoData = result.find(i => i.resolution?.includes("720p")) || result.find(i => i.resolution?.includes("360p"));
  let imageData = result.filter(i => i.url && i.url.endsWith(".jpg") || i.url.endsWith(".png"));

  // Si hay video, enviar el video
  if (videoData) {
    let {
      title = "Desconocido",
      resolution = videoData.resolution || "Sin datos",
    } = videoData;

    let infoMsg = `
⚡─────『 𝑷𝒊𝒌𝒂𝒄𝒉𝒖 𝑩𝒐𝒕 ⚡️』─────⚡

🎞️ *Resolución:* ${resolution}
🌐 *Origen:* Facebook
🔗 *Enlace:* ${args[0]}

💛 ¡Pika-Pika! Aquí tienes tu video listo para ver y compartir. ¡Disfrútalo!

─────────────────────────`.trim();

    try {
      await conn.sendMessage(m.chat, {
        video: { url: videoData.url },
        caption: infoMsg,
        fileName: 'facebook_video.mp4',
        mimetype: 'video/mp4'
      }, { quoted: m });

      await m.react(done);
    } catch (e) {
      await m.react(error);
      return conn.reply(m.chat, `${emojis} Pikachu se enredó con los cables... no se pudo enviar el video.`, m, rcanal);
    }

  } else if (imageData.length > 0) {
    // Si hay imágenes, enviarlas como álbum
    try {
      const messages = imageData.map(img => ({
        image: { url: img.url },
        caption: `${emojis} Imagen de Facebook`,
      }));

      await conn.sendMessage(m.chat, messages, { quoted: m });
      await m.react(done);
    } catch (e) {
      await m.react(error);
      return conn.reply(m.chat, `${emojis} Pika... no pude enviar las imágenes.`, m, rcanal);
    }
  } else {
    return conn.reply(m.chat, `${emojis} No se encontró ni video ni imágenes válidas.`, m, rcanal);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;