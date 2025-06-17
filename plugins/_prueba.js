let handler = async (m, { conn, text, quoted }) => {
  if (!text.includes('|') && !quoted?.isImage) {
    return m.reply(`Uso correcto:\n.enlace <url> | <título> | <descripción> | <url imagen>\n\nO responde a una imagen y usa:\n.enlace <url> | <título> | <descripción>`)
  }

  let url, title, body, thumbnail

  if (quoted?.isImage && text.includes('|')) {
    
    [url, title, body] = text.split('|').map(v => v.trim())
    if (!url || !title || !body) return m.reply('Faltan datos. Usa: <url> | <título> | <descripción>')

    try {
      thumbnail = await quoted.download()
    } catch (e) {
      return m.reply('No se pudo descargar la imagen respondida.')
    }

  } else {
    
    let [u, t, b, thumbUrl] = text.split('|').map(v => v.trim())
    if (!u || !t || !b || !thumbUrl) return m.reply('Faltan datos. Usa: <url> | <título> | <descripción> | <url imagen>')
    url = u
    title = t
    body = b
    thumbnail = undefined // Usará thumbnailUrl
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
          ? { thumbnail } // Si respondió a imagen, usa el buffer
          : { thumbnailUrl: text.split('|')[3]?.trim() }) // Si no, usa URL
      }
    }
  }

  await conn.sendMessage(m.chat, doc, { quoted: m })
}

handler.help = ['editenlace']
handler.tags = ['tools']
handler.command = ['editenlace']

export default handler