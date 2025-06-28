import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const filePath = './temp/instagram-downloader.js'
  const codeContent = `const handler = async (m, { conn, args }) => {
  let url = args[0]
  if (!url) throw '❌ Ingresa una URL válida.'

  let res = await fetch(\`https://api.instagram.fake/?url=\${url}\`)
  let json = await res.json()

  if (!json.ok) throw '⚠️ Error al descargar.'

  await conn.sendFile(m.chat, json.result.url, 'video.mp4', '✅ Descargado', m)
}

handler.command = /^ig(dl)?$/i
export default handler`

  // Crea carpeta si no existe
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  // Escribe el archivo
  fs.writeFileSync(filePath, codeContent)

  // Lee el archivo como buffer
  const buffer = fs.readFileSync(filePath)

  await conn.sendMessage(m.chat, {
    document: buffer,
    mimetype: 'text/javascript',
    fileName: 'Instagram Downloader.js',
    caption: '🍄 *Instagram Downloader*\n\nsყℓρհιҽttҽ\'s | αlphα v1',
    contextInfo: {
      externalAdReply: {
        title: '🍄 Instagram Downloader',
        body: 'sყℓρհιҽttҽ\'s | αlphα v1',
        thumbnailUrl: 'https://telegra.ph/file/3f51c7b17f07100ae9ed6.jpg',
        sourceUrl: 'https://github.com/Deylin-Eliac',
        mediaType: 1,
        renderLargerThumbnail: true,
      }
    }
  }, { quoted: m })
}
handler.command = /^copycode$/i
export default handler