import fetch from 'node-fetch'

let handler = async (m, { text, conn }) => {
  const emojis = '🧃'

  if (!text) {
    return await conn.reply(m.chat, `${emojis} Escribe el prompt de la imagen. Ejemplo:\n.genera un dragón azul volando en el espacio`, m)
  }

  await conn.reply(m.chat, `${emojis} Generando imagen de: "${text}", espera un momento...`, m)

  try {
    let prompt = encodeURIComponent(text.trim())
    let imageUrl = `https://anime-xi-wheat.vercel.app/api/ia-img?prompt=${prompt}`

    let res = await fetch(imageUrl)
    if (!res.ok) throw new Error('No se pudo obtener la imagen')

    let buffer = await res.buffer()

    await conn.sendFile(m.chat, buffer, 'imagen.jpg', `${emojis} Imagen generada:\n"${text}"`, m)
  } catch (e) {
    console.error(e)
    m.reply(`❌ Ocurrió un error al generar la imagen:\n${e.message}`)
  }
}

handler.help = ['genera <prompt>']
handler.tags = ['ai']
handler.command = ['genera', 'imagina']

export default handler