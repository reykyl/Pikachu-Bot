import { igdl } from 'ruhend-scraper';

const handler = async (m, { args, conn }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emojis} ¡Pika! Necesitas enviar un enlace de *Instagram*.`, m, rcanal);
  }

  try {
    await m.react(rwait);
    const res = await igdl(args[0]);
    const data = res.data;

    if (!data || data.length === 0) {
      await m.react(error);
      return conn.reply(m.chat, `${emojis} Pikachu no encontró ningún archivo... prueba con otro link.`, m, rcanal);
    }

    for (let media of data) {
      await conn.sendFile(
        m.chat,
        media.url,
        'instagram.mp4',
        `
⚡─────『 𝑷𝒊𝒌𝒂𝒄𝒉𝒖 𝑩𝒐𝒕 ⚡️』─────⚡

📷 *Instagram Downloader*
🔗 *Link:* ${args[0]}

💛 ¡Pika-Pika! Aquí tienes tu media:
⟢ ¡Disfruta el contenido!

─────────────────────────
`.trim(),
        m,
        rcanal
      );
    }

    await m.react(done);
  } catch (e) {
    await m.react(error);
    return conn.reply(m.chat, `${emojis} Pikachu se cayó intentando descargar... ocurrió un error.`, m, rcanal);
  }
};

handler.command = ['instagram', 'ig'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig'];
handler.group = true;

export default handler;