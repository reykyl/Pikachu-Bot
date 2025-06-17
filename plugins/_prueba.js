let handler = async (m, { conn, text, quoted }) => {
  if (!text.includes('|')) {
    return m.reply(`Uso correcto:\n\n➡️ Si respondes una imagen:\n.editenlace <url> | <título> | <descripción>\n\n➡️ Sin responder imagen:\n.editenlace <url> | <título> | <descripción> | <url imagen>`)
  }

  let url, title, body, thumbnail

  if (quoted?.isImage) {
    const parts = text.split('|').map(v => v.trim())
    if (parts.length < 3) {
      return m.reply('Faltan datos. Usa: <url> | <título> | <descripción>')
    }

    [url, title, body] = parts

    try {
      thumbnail = await quoted.download()
    } catch (e) {
      return m.reply('No se pudo descargar la imagen respondida.')
    }

  } else {
    const parts = text.split('|').map(v => v.trim())
    if (parts.length < 4) {
      return m.reply('Faltan datos. Usa: <url> | <título> | <descripción> | <url imagen>')
    }

    [url, title, body, thumbnailUrl] = parts
    thumbnail = undefined // Se usará thumbnailUrl directamente en el mensaje
  }

  const doc = {
    text: '',
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 1,
        title: title,
        body: body,
        mediaUrl: url,
        sourceUrl: url,
        renderLargerThumbnail: true,
        ...(thumbnail
          ? { thumbnail } // Si respondió imagen
          : { thumbnailUrl }) // Si usó una URL de imagen
      }
    }
  }

  await conn.sendMessage(m.chat, doc, { quoted: m })
}

handler.help = ['editenlace']
handler.tags = ['tools']
handler.command = ['editenlace']

export default handler