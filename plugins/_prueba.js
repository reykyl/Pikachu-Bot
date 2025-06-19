import fetch from 'node-fetch'

let handler = async (m, { text, conn }) => {
  if (!text) throw '✏️ Escribe el prompt de la imagen. Ejemplo:\n.genera un dragón azul volando en el espacio'

  m.reply('🪄 Generando imagen, espera un momento (esto puede tardar unos 15-30 segundos)...')

  try {
    const response = await fetch('https://hf.space/embed/stabilityai/stable-diffusion/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [text]
      })
    })

    const result = await response.json()

    if (!result || !result.data || !result.data[0]) {
      throw new Error('No se pudo generar la imagen. El servidor puede estar ocupado.')
    }

    const imageUrl = result.data[0]

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