let handler = async (m, { conn, text }) => {
  if (!text.includes('|')) {
    return m.reply(`Uso correcto:\n.enlace <url> | <título> | <descripción> | <url imagen>\n\nEjemplo:\n.enlace https://example.com | Mi Título | Esta es una descripción | https://miweb.com/imagen.jpg`)
  }

  let [url, title, body, thumbnailUrl] = text.split('|').map(v => v.trim())
  if (!url || !title || !body || !thumbnailUrl) {
    return m.reply('Faltan datos. Asegúrate de incluir los 4 parámetros separados por |')
  }

  const doc = {
    text: '',
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 1,
        title: title,
        body: body,
        thumbnailUrl: thumbnailUrl,
        mediaUrl: url,
        sourceUrl: url,
        renderLargerThumbnail: true,
      }
    }
  }

  await conn.sendMessage(m.chat, doc, { quoted: m })
}

handler.help = ['editenlace']
handler.tags = ['tools']
handler.command = ['editenlace']

export default handler


/*import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import fetch from 'node-fetch'

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return conn.reply(m.chat, '🍃 Responde a una *Imagen* o *Vídeo.*', m)
  try {
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  let link = await (isTele ? uploadImage : uploadFile)(media)
  let img = await (await fetch(`${link}`)).buffer()
  let txt = `乂  *L I N K - C A T B O X*  乂\n\n`
      txt += `*» Enlace* : ${link}\n`
      txt += `*» Tamaño* : ${formatBytes(media.length)}\n`
      txt += `*» Expiración* : ${isTele ? 'No expira' : 'Desconocido'}\n\n`
      txt += `> *${dev}*`

await conn.reply(m.chat, txt, m, rcanal)
} catch (e) {
await conn.reply(m.chat, '⚠︎ *Error:* ' + e, m)
}}
handler.help = ['tourl2']
handler.tags = ['tools']
handler.command = ['tourl2', 'catbox']
export default handler

function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 B';
  }
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function shortUrl(url) {
        let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
        return await res.text()
}*/