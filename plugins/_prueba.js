import fetch from 'node-fetch'

let handler = async (m, { conn, args, text }) => {
  if (!text) return m.reply('📽️ Escribe el texto para generar el video.\nEjemplo: *.videoai Un gato ninja corriendo en Tokio futurista*')

  m.reply('🎞️ Generando video con IA, espera 20-30 segundos...')

  try {
    let res = await fetch('https://genmo-api-dummy.vercel.app/api/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text })
    })

    let json = await res.json()
    if (!json.url) return m.reply('❌ No se pudo generar el video.')

    await conn.sendFile(m.chat, json.url, 'video.mp4', `📹 Video generado con IA para:\n"${text}"`, m)
  } catch (e) {
    console.log(e)
    m.reply('❌ Error al generar el video.')
  }
}
handler.command = /^videoai$/i
export default handler