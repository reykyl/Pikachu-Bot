import { sticker } from '../lib/sticker.js' // si usas tu sistema de sticker con exif
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

      const buffer = await fetch(url).then(res => res.buffer())

      const stick = await sticker(buffer, false, {
        packname: text,
        author: 'Kirito-Bot',
      })

      stickers.push({ sticker: stick })
      if (stickers.length >= 10) break
    }

    if (!stickers.length) throw '⚠️ No se encontraron stickers válidos.'

    await m.reply(`🧩 Paquete de stickers encontrados para: *${text}*`)
    await conn.sendAlbumMessage(m.chat, stickers, m)

  } catch (err) {
    let msg = typeof err === 'string' ? err : (err.message || JSON.stringify(err))
    m.reply(`❌ Ocurrió un error:\n\n${msg}`)
  }
}

handler.command = ['stickerpack', 'flasticker']
handler.help = ['stickerpack <palabra>']
handler.tags = ['sticker']

export default handler