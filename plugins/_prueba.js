import fetch from 'node-fetch'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`✳️ Escribe una palabra para buscar stickers.\n\nEjemplo:\n*${command} gato*`)

  try {
    let res = await fetch(`https://opendrip-api.onrender.com/api/sticker?q=${encodeURIComponent(text)}`)
    if (!res.ok) return m.reply('❌ No se pudo conectar con la API.')

    let data = await res.json()

    if (!data.estado || !data.resultados.length) return m.reply('⚠️ No se encontraron stickers para tu búsqueda.')

    let paquete = []

    for (let i = 0; i < Math.min(10, data.resultados.length); i++) {
      let sticker = data.resultados[i]
      paquete.push({
        image: { url: sticker.thumbnail },
        caption: `🎨 ${sticker.nombre}\n👤 ${sticker.autor || 'Desconocido'}\n🔗 ${sticker.url}`
      })
    }

    await conn.sendAlbumMessage(m.chat, paquete, m)

  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error inesperado.')
  }
}

handler.command = ['flasticker', 'stickerpack', 'buscarsticker']
handler.help = ['flasticker <palabra>']
handler.tags = ['sticker']

export default handler