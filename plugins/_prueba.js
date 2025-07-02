import fetch from 'node-fetch'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import { tmpdir } from 'os'
import { addExif } from '../lib/sticker.js'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`✳️ Escribe una palabra para buscar stickers\n\nEjemplo:\n*${command} gato*`)

  try {
  const res = await fetch(`https://www.sticker.ly/search?q=${encodeURIComponent(text)}`)
  const html = await res.text()
  const $ = cheerio.load(html)

  const jsonDataScript = $('script#__NEXT_DATA__').html()
  if (!jsonDataScript) throw '❌ No se pudo cargar el script JSON de la página.'

  const json = JSON.parse(jsonDataScript)
  const packs = json?.props?.pageProps?.searchResult?.packs

  if (!packs || packs.length === 0) throw '⚠️ No se encontraron packs.'

  const packId = packs[0]?.id
  const userId = packs[0]?.userId
  if (!packId || !userId) throw '❌ No se pudo acceder a packId o userId.'

  const packURL = `https://www.sticker.ly/api/v1/packs/${packId}?userId=${userId}&country=HN`
  const packRes = await fetch(packURL)
  const packData = await packRes.json()

  const items = packData?.stickers || []
  if (!items.length) throw '⚠️ No se encontraron stickers en ese pack.'

  const results = items.slice(0, 3)
  const stickers = []

  for (const item of results) {
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
        const img = await fetch(item.url)
        const buffer = await img.buffer()
        await sharp(buffer)
          .resize(512, 512, { fit: 'inside' })
          .webp()
          .toFile(webpFile)
      }

      const stickerBuf = await addExif(fs.readFileSync(webpFile), packData.name, packData.authorName || 'Sticker.ly')
      stickers.push({ sticker: stickerBuf })
      fs.unlinkSync(webpFile)

    } catch (e) {
      await m.reply(`⚠️ Error con un sticker:\n\n${e}`)
    }
  }

  for (const s of stickers) {
    await conn.sendMessage(m.chat, { sticker: s.sticker }, { quoted: m })
    await sleep(300)
  }

} catch (e) {
  console.error(e)
  await m.reply(`❌ Error:\n\n${e}`)
}
}

handler.command = /^stickerly$/i
handler.tags = ['sticker']
handler.help = ['stickerly <texto>']
export default handler