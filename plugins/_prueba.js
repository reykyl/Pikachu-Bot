import fetch from 'node-fetch'
import { Buffer } from 'buffer'

let handler = async (m, { text, conn }) => {
  if (!text) {
    return await conn.reply(m.chat, '✏️ Escribe el prompt. Ejemplo:\n.genera un dragón azul en el espacio', m)
  }

  await conn.reply(m.chat, `🪄 Generando imagen de: "${text}", espera un momento...`, m)

  try {
    // Preparar el prompt
    const payload = {
      fn_index: 0,
      data: [text],
      session_hash: 'flux_' + Math.random().toString(36).slice(2)
    }

    // Hacer petición al Space
    const response = await fetch('https://huggingface.co/spaces/black-forest-labs/FLUX.1-dev/run/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const json = await response.json()

    if (!json.data || !json.data[0]) throw new Error('No se pudo obtener la imagen.')

    const imageBase64 = json.data[0].split(',')[1] // quitar "data:image/png;base64,"
    const buffer = Buffer.from(imageBase64, 'base64')

    await conn.sendFile(m.chat, buffer, 'imagen.png', `🧃 Imagen generada:\n"${text}"`, m)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al generar la imagen. Intenta con otro prompt o más corto.')
  }
}

handler.help = ['genera <texto>']
handler.tags = ['ai', 'imagen']
handler.command = ['hy', 'imagina']

export default handler