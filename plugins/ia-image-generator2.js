let handler = async (m, { text, conn }) => {
  

  if (!text) {
    return await conn.reply(m.chat, `${emojis} Escribe el prompt de la imagen. Ejemplo:\n.genera un dragón azul volando en el espacio`, m, rcanal)
  }

  await conn.reply(m.chat, `${emojis} Generando imagen de: "${text}", espera un momento...`, m, rcanal)

  try {
    let prompt = encodeURIComponent(text.trim())
    let imageUrl = `https://anime-xi-wheat.vercel.app/api/ia-img?prompt=${prompt}`

    await conn.sendFile(m.chat, imageUrl, 'imagen.jpg', `"${emojis}" Imagen generada:\n"${text}"`, m)
  } catch (e) {
    console.error(e)
    m.reply(`❌ Ocurrió un error al generar la imagen:\n${e.message}`)
  }
}

handler.help = ['genera <prompt>']
handler.tags = ['ai']
handler.command = ['genera', 'imagina']

export default handler