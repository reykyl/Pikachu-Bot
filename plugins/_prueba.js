let handler = async (m, { text, conn }) => {
  if (!text) throw '✏️ Escribe el prompt de la imagen. Ejemplo:\n.genera un dragón azul volando en el espacio'

  m.reply('🪄 Generando imagen, espera un momento...')

  try {
    // Codificar el prompt para usarlo en la URL
    let prompt = encodeURIComponent(text.trim())
    let imageUrl = `https://image.pollinations.ai/prompt/${prompt}`

    await conn.sendFile(m.chat, imageUrl, 'imagen.jpg', `🖼️ Imagen generada:\n"${text}"`, m)
  } catch (e) {
    console.error(e)
    m.reply(`❌ Ocurrió un error al generar la imagen:\n${e.message}`)
  }
}

handler.help = ['genera <prompt>']
handler.tags = ['ai', 'imagen']
handler.command = ['genera', 'imagina']

export default handler