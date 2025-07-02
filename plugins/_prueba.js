import fetch from 'node-fetch'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`✳️ Escribe una palabra para buscar stickers.\n\nEjemplo:\n*${command} gato*`)

  try {
    const res = await fetch(`https://opendrip-api.onrender.com/api/sticker?q=${encodeURIComponent(text)}`)
    if (!res.ok) throw `❌ No se pudo conectar con la API. Código HTTP: ${res.status}`

    const data = await res.json()
    if (!data.estado || !Array.isArray(data.resultados)) throw `⚠️ Respuesta inválida de la API.`

    let enviados = 0
    for (let s of data.resultados) {
      const url = s.thumbnail
      if (!url || !url.startsWith('http')) continue

      await conn.sendMessage(m.chat, { sticker: { url } }, { quoted: m })
      enviados++
      if (enviados >= 10) break
    }

    if (!enviados) throw '⚠️ No se encontraron stickers válidos.'

  } catch (err) {
    let msg = typeof err === 'string' ? err : (err.message || JSON.stringify(err))
    m.reply(`❌ Ocurrió un error:\n\n${msg}`)
  }
}

handler.command = ['flasticker', 'stickerpack', 'buscarsticker']
handler.help = ['flasticker <palabra>']
handler.tags = ['sticker']

export default handler