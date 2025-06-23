

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const userId = m.sender;
  if (isUserBlocked(userId)) {
    return conn.reply(m.chat, '❌ Pika! No puedes usar este comando porque estás en la lista negra eléctrica.', m);
  }

  if (!text || !text.trim()) {
    let thumbnailBuffer = null;
    try {
      const response = await axios.get('https://qu.ax/GbxoW.jpg', { responseType: 'arraybuffer' });
      thumbnailBuffer = Buffer.from(response.data, 'binary');
    } catch {}

    return conn.reply(
      m.chat,
      `⚡️ Usa el comando así:\n\n*${usedPrefix + command} <nombre de la canción>*\n> Ejemplo: ${usedPrefix + command} Mi Vida Eres Tú\n\n🐭 ¡Pikachu está listo para cantar contigo!`,
      m,
      {
        contextInfo: {
          externalAdReply: {
            title: '🎵 Pikachu-Bot Music ⚡',
            previewType: 'PHOTO',
            thumbnail: thumbnailBuffer || null,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
            sourceUrl: 'https://pikachu-bot.com'
          }
        }
      }
    );
  }

  const limaTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }));
  const userNumber = m.sender.split('@')[0];
  const reactionMessage = await conn.reply(
    m.chat,
    `🎶 @${userNumber}, estoy buscando tu canción con todo mi poder eléctrico... ¡Pika!`,
    m,
    { mentions: [m.sender] }
  );

  await conn.sendMessage(m.chat, { react: { text: '⚡', key: reactionMessage.key } }, { quoted: m });

  try {
    const searchResults = await yts(text.trim());
    if (!searchResults?.videos?.length) throw new Error('⚠️ Pika... No encontré nada con ese nombre.');

    const videoInfo = searchResults.videos[0];
    const { title, timestamp: duration, views, ago, url: videoUrl } = videoInfo;

    let thumbnailBuffer = null;
    try {
      const response = await axios.get(videoInfo.image, { responseType: 'arraybuffer' });
      thumbnailBuffer = Buffer.from(response.data, 'binary');
    } catch {}

    const description = `⚡🐭 \`Pikachu-Bot - Descargas Pokémon\`

*🎵 Título:* ${title}
> ⏱️ *Duración:* ${duration || 'Desconocida'}
> 👁️ *Vistas:* ${views.toLocaleString()}
> 📅 *Publicado:* ${ago || 'Desconocido'}
> 🔗 *URL:* ${videoUrl}

🎧 ¡Pikachu encontró tu canción con éxito!`;

    await conn.reply(
      m.chat,
      description,
      m,
      {
        contextInfo: {
          externalAdReply: {
            title: title,
            body: "✨ Pikachu-Bot Music ⚡",
            previewType: 'PHOTO',
            thumbnail: thumbnailBuffer || null,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
          }
        }
      }
    );

    const downloadData = await getDownloadUrl(videoUrl);
    if (!downloadData || !downloadData.url) {
      await conn.sendMessage(m.chat, { react: { text: '🔴', key: reactionMessage.key } }, { quoted: m });
      throw new Error('💔 Pikachu no pudo descargar la canción... inténtalo otra vez.');
    }

    await conn.sendMessage(m.chat, { react: { text: '🟢', key: reactionMessage.key } }, { quoted: m });
    const success = await sendAudioNormal(conn, m.chat, downloadData.url, downloadData.title || title);
    if (!success) throw new Error('⚠️ Pika... no pude enviarte la música.');

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '🔴', key: reactionMessage.key } }, { quoted: m });
    return conn.reply(m.chat, `⚡️ Ocurrió un error eléctrico: *${error.message || 'Error desconocido'}*`, m);
  }
};

handler.command = /^play$/i;
handler.help = ['play <canción>'];
handler.tags = ['descargas'];

export default handler;