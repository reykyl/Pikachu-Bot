/*Hecho por Angel brou*/


import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `⚡ Por favor, ingresa el nombre de una canción de Spotify.`, m, rcanal);
await m.react('🕒');
return conn.reply(m.chat, `*Espera un momento estoy buscando...*`, m, rcanal);
let ouh = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${text}`)
let gyh = await ouh.json()

     await conn.sendMessage(m.chat, {text: info, contextInfo: {forwardingScore: 9999999, isForwarded: true, "externalAdReply": {"showAdAttribution": true, "containsAutoReply": true, "renderLargerThumbnail": true, "title": global.wm, "containsAutoReply": true, "mediaType": 1, "thumbnail": img, "thumbnailUrl": img, "mediaUrl": shortURL, "sourceUrl": shortURL}}}, {quoted: fkontak});
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



