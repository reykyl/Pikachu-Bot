import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import { tmpdir } from 'os'
import { addExif } from '../lib/sticker.js'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`✳️ Escribe una palabra para buscar stickers\n\nEjemplo:\n${command} gato`)

  try {
    // 1. Llamar a la API externa que devuelve resultados de sticker.ly
    const apiUrl = `https://tuapi.com/stickerly?q=${encodeURIComponent(text)}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw `Error en API externa: ${res.status} ${res.statusText}`
    const data = await res.json()

    if (!data || !Array.isArray(data.results) || data.results.length === 0)
      return m.reply('⚠️ No se encontraron stickers para esa búsqueda.')

    // 2. Tomar solo los primeros 3 resultados
    const items = data.results.slice(0, 3)

    // 3. Descargar y convertir cada resultado a sticker webp
    const stickers = []

    for (const item of items) {
      // item debe tener { type: 'image'|'video', url: '...' }
      const tmpFile = path.join(tmpdir(), `${Date.now()}-${Math.random()}`)
      const webpFile = `${tmpFile}.webp`

      try {
        if (item.type === 'video') {
          await new Promise((resolve, reject) => {
            ffmpeg(item.url)
              .inputOptions('-t', '5')
              .outputOptions([
                '-vf', 'scale=512:512:force_original_aspect_ratio=decrease',
                '-ss', '0',
                '-vcodec', 'libwebp',
                '-loop', '0',
                '-preset', 'default',
                '-an',
                '-vsync', '0',
                '-s', '512:512'
              ])
              .save(webpFile)
              .on('end', resolve)
              .on('error', reject)
          })
        } else {
          const imgRes = await fetch(item.url)
          const buffer = await imgRes.buffer()
          await sharp(buffer)
            .resize(512, 512, { fit: 'inside' })
            .webp()
            .toFile(webpFile)
        }

        const stickerBuffer = await addExif(fs.readFileSync(webpFile), 'Sticker Pack', 'Kirito-Bot')
        stickers.push({ sticker: stickerBuffer })
        fs.unlinkSync(webpFile)

      } catch (e) {
        await m.reply(`⚠️ Error al procesar un sticker:\n${e.message || e}`)
      }
    }

    // 4. Enviar los stickers (uno por uno)
    for (const s of stickers) {
      await conn.sendMessage(m.chat, { sticker: s.sticker }, { quoted: m })
      await sleep(400)
    }

  } catch (e) {
    console.error(e)
    await m.reply(`❌ Error al buscar o enviar stickers:\n${e.message || e}`)
  }
}

handler.command = /^stickerly$/i
handler.tags = ['sticker']
handler.help = ['stickerly <texto>']

export default handler