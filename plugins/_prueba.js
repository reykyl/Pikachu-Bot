/** 
 *  Created By LUA SER OFC
 *  CopyRight 2024 MIT License
 *  My Github : https://github.com/xxirfanx
 *  My Instagram : https://instagram.com/luaserofc
 *  My Youtube : https://youtube.com/@luaserofc
*/

/*import yts from 'yt-search';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw ` 🦄Use example *${usedPrefix + command}* Somewhere Only We Know`;
        let res = await yts(text)
        let vid = res.videos[0]
        if (!vid) throw `🍊 Audio not find title song `;
        let { title, description, thumbnail, videoId, timestamp, views, ago, url } = vid
        //const url = 'https://www.youtube.com/watch?v=' + videoId
        m.react(`🐢`) 
  let play = `
📺 *Title:* ${vid.title}
⌛ *Duration:* ${vid.timestamp}
👀 *Views:* ${vid.views.toLocaleString()}
📅 *Upload:* ${vid.ago}
`
 await conn.sendButton2(m.chat, play, thumbnail, [
    ['🎶 MP3', `${usedPrefix}vfmp3 ${url}`]], null, null, m)
}

handler.help = ['play'].map((v) => v + ' <query>')
handler.tags = ['downloader']
handler.command = ['play', 'song']

export default handler*/


let handler = async (m, { conn }) => {
  const play = `🎧 *Reproduciendo música...*\n\nSelecciona una opción:`
  const thumbnail = 'https://telegra.ph/file/2c3b0ffac0e7267818023.jpg' // Puedes usar una imagen válida

  await conn.sendButton2(
    m.chat, // ID del chat
    play,   // Texto del mensaje
    thumbnail, // Imagen (URL o buffer)
    [
      ['🎶 Reproducir', 'hola'] // Botón que ejecuta el comando "hola"
    ],
    null, // ID de mensaje citado
    null, // Opciones adicionales
    m     // Objeto del mensaje original
  )
}

handler.command = /^boton$/i
export default handler