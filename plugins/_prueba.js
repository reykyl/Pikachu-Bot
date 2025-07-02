import fetch from 'node-fetch'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`✳️ Escribe una palabra para buscar stickers.\n\nEjemplo:\n*${command} gato*`)

  try {
    const res = await fetch(`https://opendrip-api.onrender.com/api/sticker?q=${encodeURIComponent(text)}`)
    if (!res.ok) throw `❌ No se pudo conectar con la API. Código HTTP: ${res.status}`

    const data = await res.json()

    if (!data.estado || !Array.isArray(data.resultados)) {
      throw `⚠️ Respuesta inválida de la API.\n\n${JSON.stringify(data, null, 2)}`
    }

    const paquete = []

    for (let i = 0; i < data.resultados.length && paquete.length < 10; i++) {
      const s = data.resultados[i]
      const url = s.thumbnail

      if (!url || !url.startsWith('http')) continue

      // Agrega solo la imagen, sin texto ni enlaces
      paquete.push({ image: { url } })
    }

    if (!paquete.length) throw '⚠️ No se encontraron stickers válidos.'

    // Prueba con 1 imagen
    await conn.sendMessage(m.chat, paquete[0], { quoted: m })

    // Si quieres enviar como paquete, descomenta esto cuando estés listo:
     await conn.sendAlbumMessage(m.chat, paquete, m)

  } catch (err) {
    let msg = typeof err === 'string' ? err : (err.message || JSON.stringify(err))
    m.reply(`❌ Ocurrió un error:\n\n${msg}`)
  }
}

handler.command = ['flasticker', 'stickerpack', 'buscarsticker']
handler.help = ['flasticker <palabra>']
handler.tags = ['sticker']

export default handler