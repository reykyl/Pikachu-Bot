/*Hecho por Angel brou*/


import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `⚡ Por favor, ingresa el nombre de una canción de Spotify.`, m, rcanal);
await m.react('🕒');
return conn.reply(m.chat, `*Espera un momento estoy buscando...*`, m, rcanal);
let ouh = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${text}`)
let gyh = await ouh.json()

     /* const doc = {
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



//await conn.sendMessage(m.chat, doc, { quoted: m });

let resImg = await fetch(res.imagen)
let thumbb = await resImg.buffer()
let { videos } = await search(res.name)
let q = '128kbps'
let v = videos[0].url
let yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v))
let dl_url = await yt.audio[q].download()
let ttl = await yt.title
let size = await yt.audio[q].fileSizeH
let img = await getBuffer(res.imagen)
conn.sendMessage(m.chat, { audio: { url: dl_url }, fileName: `${ttl}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
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



