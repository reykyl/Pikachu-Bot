import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || ''
  if (!mime) return conn.reply(m.chat, '🍃 Responde a una *Imagen* o *Vídeo.*', m)

  try {
    const media = await q.download()
    const isImageOrSmallVideo = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
    
    const link = await uploadMedia(media, isImageOrSmallVideo)
    
    const txt = `乂  *L I N K - S H A R E*  乂\n\n` +
                `*» Enlace* : ${link}\n` +
                `*» Tamaño* : ${formatBytes(media.length)}\n` +
                `*» Expiración* : ${isImageOrSmallVideo ? 'No expira' : '24 horas'}\n\n` +
                `> *Kirito-Bot*`
    
    await conn.reply(m.chat, txt, m)
  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '⚠︎ *Error:* ' + e.message, m)
  }
}

handler.help = ['tourl2']
handler.tags = ['tools']
handler.command = ['tourl2', 'catbox']
export default handler

// 🧩 Subida combinada (usa uguu.se o file.io según el tipo)
async function uploadMedia(buffer, preferUguu = true) {
  const form = new FormData()
  form.append('file', buffer, 'media')

  let uploadUrl = preferUguu
    ? 'https://uguu.se/upload.php'
    : 'https://file.io/?expires=1d'

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  })

  const json = await res.json()

  if (!res.ok || (!json.url && !json.files)) {
    throw new Error('Falló la subida: ' + JSON.stringify(json))
  }

  return json.url || json.files[0].url
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}