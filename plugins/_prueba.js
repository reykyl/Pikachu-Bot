
import fetch from 'node-fetch'

let handler = async (m, { text, conn}) => {
  if (!text) throw 'Escribe el prompt de la imagen, por ejemplo:\n.genera ShadowUltra en el espacio'

  m.reply('🪄 Generando imagen, espera un momento...')

  // Puedes usar una instancia pública de Hugging Face o la que tú hospedes
  const endpoint = `https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4`
  const body = {
    inputs: text
}

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Si usas un Space que no requiere clave, omite "Authorization"
},
    body: JSON.stringify(body)
})

  const buffer = await response.buffer()

  await conn.sendFile(m.chat, buffer, 'imagen.png', `🖼️ Imagen generada: "${text}"`, m)
}

handler.help = ['genera']
handler.tags = ['ai', 'imagen']
handler.command = ['genera', 'imagina']

export default handler