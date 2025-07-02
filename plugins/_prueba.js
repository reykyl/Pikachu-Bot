import fetch from 'node-fetch'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`✳️ Escribe una palabra para buscar stickers.\n\nEjemplo:\n*${command} gato*`)

  try {
    const res = await fetch(`https://opendrip-api.onrender.com/api/sticker?q=${encodeURIComponent(text)}`)
    if (!res.ok) return m.reply('❌ No se pudo conectar con la API.')

    const data = await res.json()
    if (!data.estado || !data.resultados.length) return m.reply('⚠️ No se encontraron stickers.')

    const paquete = []

    for (let i = 0; i < data.resultados.length; i++) {
      let s = data.resultados[i]
      if (!s.thumbnail || s.url.includes('undefined')) continue

      paquete.push({
        image: { url: s.thumbnail } // 👈 sin caption
      })

      if (paquete.length >= 10) break // 👈 solo 10 stickers por paquete (WhatsApp límite recomendado)
    }

    if (!paquete.length) return m.reply('⚠️ No se encontraron stickers válidos.')

    await conn.sendAlbumMessage(m.chat, paquete, m)

  } catch (err) {
    console.error(err)
    m.reply('❌ Ocurrió un error inesperado.')
  }
}

handler.command = ['flasticker', 'stickerpack', 'buscarsticker']
handler.help = ['flasticker <palabra>']
handler.tags = ['sticker']

export default handler