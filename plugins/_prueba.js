import fetch from 'node-fetch'

let handler = async (m, { text, conn }) => {
  if (!text) throw '✏️ Escribe el prompt de la imagen. Ejemplo:\n.genera un dragón azul volando en el espacio'

  m.reply('🪄 Generando imagen, espera un momento (puede tardar 10–30 segundos)...')

  try {
    const response = await fetch('https://hf.space/embed/prompthero/openjourney/+/api/predict/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [text]
      })
    })

    const result = await response.json()

    const imageUrl = result.data?.[0]
    if (!imageUrl) throw new Error('No se recibió imagen. El Space puede estar en cola o inactivo.')

    await conn.sendFile(m.chat, imageUrl, 'imagen.png', `🖼️ Imagen generada:\n"${text}"`, m)
  } catch (e) {
    console.error(e)
    m.reply(`❌ Ocurrió un error al generar la imagen:\n${e.message}`)
  }
}

handler.help = ['genera <prompt>']
handler.tags = ['ai', 'imagen']
handler.command = ['genera', 'imagina']

export default handler