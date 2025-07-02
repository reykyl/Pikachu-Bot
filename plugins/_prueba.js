import fetch from 'node-fetch'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import { addExif } from '../lib/sticker.js'
import { tmpdir } from 'os'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`✳️ Escribe una palabra para buscar stickers\n\nEjemplo:\n*${command} gato*`)

  try {
    const res = await fetch(`https://sticker.ly/s/${encodeURIComponent(text)}`)
    const html = await res.text()
    const $ = cheerio.load(html)

    let stickerLinks = []

    $('a[href^="/packs/"]').each((i, el) => {
      const href = $(el).attr('href')
      if (href && !stickerLinks.includes(href)) {
        stickerLinks.push(`https://sticker.ly${href}`)
      }
    })

    if (stickerLinks.length === 0) return m.reply('⚠️ No se encontraron resultados.')

    const packURL = stickerLinks[0] // Solo primer pack
    const packPage = await fetch(packURL)
    const packHtml = await packPage.text()
    const $$ = cheerio.load(packHtml)

    const scriptJson = $$('script#__NEXT_DATA__').html()
    const jsonData = JSON.parse(scriptJson)
    const items = jsonData.props.pageProps.pack.stickers || []

    if (!items.length) return m.reply('⚠️ No se encontraron stickers en ese pack.')

    const results = items.slice(0, 3) // solo 3 stickers
    const stickers = []

    for (const item of results) {
      const tmpFile = path.join(tmpdir(), `${Date.now()}-${Math.random()}`)
      const webpFile = `${tmpFile}.webp`

      if (item.video) {
        await new Promise((resolve, reject) => {
          ffmpeg(item.video)
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
        const img = await fetch(item.image)
        const buffer = await img.buffer()
        await sharp(buffer)
          .resize(512, 512, { fit: 'inside' })
          .webp()
          .toFile(webpFile)
      }

      const stickerBuf = await addExif(fs.readFileSync(webpFile), 'Sticker.ly', 'Kirito-Bot')
      stickers.push({ sticker: stickerBuf })
      fs.unlinkSync(webpFile)
    }

    await conn.sendMessage(m.chat, {
      sticker: stickers[0].sticker
    }, { quoted: m })

    for (let i = 1; i < stickers.length; i++) {
      await sleep(500)
      await conn.sendMessage(m.chat, {
        sticker: stickers[i].sticker
      }, { quoted: m })
    }

  } catch (e) {
    console.error(e)
    m.reply('❌ Error al buscar o convertir stickers.')
  }
}

handler.command = /^stickerly$/i
handler.tags = ['sticker']
handler.help = ['stickerly <texto>']
export default handler