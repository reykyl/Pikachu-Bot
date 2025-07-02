/*import fetch from 'node-fetch'
import sharp from 'sharp'
import { addExif } from '../lib/sticker.js'

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

      const imgBuffer = await fetch(url).then(res => res.buffer())

      const webpBuffer = await sharp(imgBuffer)
        .webp({ lossless: true })
        .toBuffer()

      const stickerBuffer = await addExif(webpBuffer, text, dev)

      stickers.push({ sticker: stickerBuffer })
      if (stickers.length >= 5) break // ← ENVÍA SOLO 5 STICKERS
    }

    if (!stickers.length) throw '⚠️ No se encontraron stickers válidos.'

    await m.reply(`🧩 *Paquete de stickers encontrados para:* ${text}`)
    await conn.sendAlbumMessage(m.chat, stickers, m)

  } catch (err) {
    let msg = typeof err === 'string' ? err : (err.message || JSON.stringify(err))
    m.reply(`❌ Ocurrió un error:\n\n${msg}`)
  }
}

handler.command = ['stickerpack', 'flasticker']
handler.help = ['stickerpack <palabra>']
handler.tags = ['sticker']

export default handler*/


import fetch from 'node-fetch'
import cheerio from 'cheerio'

let handler = async (m, { conn, command }) => {
  try {
    const res = await fetch('https://www.wistickers.com/stickers/michis')
    const html = await res.text()
    const $ = cheerio.load(html)

    const results = []
    $('.stickers-pack').each((_, el) => {
      const name = $(el).find('.title').text().trim()
      const url = 'https://www.wistickers.com' + $(el).find('a').attr('href')
      const thumbnail = $(el).find('img').attr('src')
      if (name && url && thumbnail) {
        results.push({ name, url, thumbnail })
      }
    })

    if (results.length === 0) {
      return m.reply('⚠️ No se encontraron stickers de michis.')
    }

    let texto = '🐱 *Stickers de Michis encontrados:*\n\n'
    for (let i = 0; i < results.length && i < 10; i++) {
      texto += `🔸 *${results[i].name}*\n🌐 ${results[i].url}\n🖼️ ${results[i].thumbnail}\n\n`
    }

    await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  } catch (e) {
    console.error(e)
    await m.reply('❌ Ocurrió un error al buscar los stickers.')
  }
}

handler.help = ['michis']
handler.tags = ['sticker']
handler.command = /^michis$/i

export default handler