/*Hecho por Angel brou*/


import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `⚡ Por favor, ingresa el nombre de una canción de Spotify.`, m, rcanal);
await m.react('🕒');
return conn.reply(m.chat, `*Espera un momento estoy buscando...*`, m, rcanal);
let ouh = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${text}`)
let gyh = await ouh.json()

      /*const doc = {
        audio: { url: gyh.result.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: url,
            title: title,
            body: `Duración: ${timestamp} | Vistas: ${vistas}`,
            sourceUrl: url,
            thumbnailUrl: "https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/refs/heads/main/src/IMG-20250613-WA0194.jpg",
            renderLargerThumbnail: true
          }
        }
      };*/


     await conn.sendMessage(m.chat, { audio: { url: gyh.result.downloadUrl }, externalAdReply: {
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: url,
            title: title,
            body: `Duración: ${timestamp} | Vistas: ${vistas}`,
            sourceUrl: url,
            thumbnailUrl: "https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/refs/heads/main/src/IMG-20250613-WA0194.jpg",
            renderLargerThumbnail: true, mimetype: 'audio/mpeg' }, { quoted: m });
await m.react('✅');
}
handler.help = ['spotify *<texto>*']
handler.tags = ['descargas']
handler.command = ['spotify']

export default handler




/*import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw m.reply(`⚡ Por favor, ingresa el nombre de una canción de Spotify.`);
await m.react('🕒');
let ouh = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${text}`)
let gyh = await ouh.json()

await conn.sendMessage(m.chat, { audio: { url: gyh.result.downloadUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
await m.react('✅');
}
handler.help = ['spotify *<texto>*']
handler.tags = ['descargas']
handler.command = ['spotify']

export default handler*)



