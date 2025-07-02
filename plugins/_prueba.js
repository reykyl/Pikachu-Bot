let handler = async (m, { conn, text, command }) => {
  if (!text) throw `✳️ Escribe una palabra para buscar stickers.\n\nEjemplo:\n${command} gato`

  let res = await fetch(`https://opendrip-api.onrender.com/api/sticker?q=${encodeURIComponent(text)}`)
  if (!res.ok) throw '❌ No se pudo conectar con la API.'
  let data = await res.json()

  if (!data.estado || !data.resultados.length) throw '⚠️ No se encontraron stickers.'

  let paquete = []

  for (let i = 0; i < Math.min(10, data.resultados.length); i++) {
    let sticker = data.resultados[i]
    paquete.push({
      image: { url: sticker.thumbnail },
      caption: `🎨 ${sticker.nombre}\n👤 ${sticker.autor || 'Desconocido'}\n🔗 ${sticker.url}`
    })
  }

  await conn.sendAlbumMessage(m.chat, paquete, m)
}

handler.command = ['flasticker', 'stickerpack', 'buscarsticker']
handler.help = ['flasticker <palabra>']
handler.tags = ['sticker']

export default handler