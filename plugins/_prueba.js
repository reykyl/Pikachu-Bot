import fs from 'fs'

let handler = async (m, { conn }) => {
  const code = `// Instagram Downloader
import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  let url = args[0]
  if (!url) throw 'Falta URL'
  let res = await fetch(\`https://api.fake-instagram.com?url=\${url}\`)
  let json = await res.json()
  await conn.sendFile(m.chat, json.url, 'video.mp4', '', m)
}
handler.command = /^ig$/i
export default handler
`
  const fileName = 'Instagram-Downloader.js'
  const filePath = './' + fileName
  fs.writeFileSync(filePath, code)

  const buffer = fs.readFileSync(filePath)

  await conn.sendMessage(m.chat, {
    document: buffer,
    mimetype: 'text/javascript',
    fileName,
    caption: '🍄 *Instagram Downloader*\n\nBotón de copiar activo si tu WhatsApp lo permite',
    contextInfo: {
      externalAdReply: {
        title: 'Instagram Downloader',
        body: 'Archivo generado por el bot',
        mediaType: 1,
        sourceUrl: 'https://github.com/Deylin-Eliac',
        thumbnailUrl: 'https://telegra.ph/file/3f51c7b17f07100ae9ed6.jpg',
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}
handler.command = /^copycode$/i
export default handler