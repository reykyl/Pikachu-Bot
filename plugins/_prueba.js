import fetch from 'node-fetch'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`✳️ Escribe una palabra para buscar stickers.\n\nEjemplo:\n*${command} gato*`)

  try {
    const res = await fetch(`https://opendrip-api.onrender.com/api/sticker?q=${encodeURIComponent(text)}`)
    if (!res.ok) throw `❌ No se pudo conectar con la API. Código HTTP: ${res.status}`

    const data = await res.json()
    if (!data.estado || !Array.isArray(data.resultados)) throw `⚠️ Respuesta inválida de la API.`

    const stickers = []
    for (let s of data.resultados) {
      const url = s.thumbnail
      if (!url || !url.startsWith('http')) continue

      stickers.push({
        sticker: { url },
      })

      if (stickers.length >= 10) break
    }

    if (!stickers.length) throw '⚠️ No se encontraron stickers válidos.'

    if (typeof conn.sendAlbumMessage !== 'function') {
      throw '❌ La función conn.sendAlbumMessage no está definida.'
    }

    await conn.sendAlbumMessage(m.chat, stickers, m)

  } catch (err) {
    let msg = typeof err === 'string' ? err : (err.message || JSON.stringify(err))
    m.reply(`❌ Ocurrió un error:\n\n${msg}`)
  }
}

handler.command = ['flasticker', 'stickerpack', 'buscarsticker']
handler.help = ['flasticker <palabra>']
handler.tags = ['sticker']

export default handler