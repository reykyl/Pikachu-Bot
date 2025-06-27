import fetch from 'node-fetch';
let handler = async (m, { conn }) => {
try {
const nombre = await conn.getName(m.sender)
const texto `Hola ${nombre}, Como Estas`
const ownerName = '𝐃𝐞𝐲𝐥𝐢𝐧'
const pefix = ['.', '⚡', '/', '#'].getRandom()
const comando = ['menu', 'help'].getRandom()
let profile;
      try {
        profile = await conn.profilePictureUrl(m.sender, 'image');
      } catch {
        profile = 'https://files.catbox.moe/651gmb.jpg';
      }
const xdd = {
      "key": {
        "fromMe": false,
        "participant": "0@s.whatsapp.net",
        "remoteJid": "0@s.whatsapp.net"
      },
      "message": {
        "groupInviteMessage": {
          "groupJid": " 120363297867770433@g.us",
          "inviteCode": "G9zQlCHDBrn99wcC2FyWgm",
          "groupName": "𝙷𝙾𝙻𝙰 𝚄𝚂𝚄𝙰𝚁𝙸𝙾",
          "caption": "𝙷𝙾𝙻𝙰, ¿𝙲𝙾𝙼𝙾 𝚃𝙴 𝙿𝚄𝙴𝙳𝙾 𝙰𝚈𝚄𝙳𝙰𝚁?",
          "jpegThumbnail": await (await fetch(profile)).buffer()
        }
      }
    }
const xddd = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: "120363415670808219@newsletter", serverMessageId: 100, newsletterName: "Cuervo Betas", }, externalAdReply: { showAdAttribution: true, title: "Betas", body: "Lo Goad", mediaUrl: null, description: null, previewType: "PHOTO", thumbnailUrl: profile, sourceUrl: redes, mediaType: 1, renderLargerThumbnail: true }, }, }}
const img = await fetch(`https://api.dorratz.com/v3/text-image?text=${texto}&fontSize=50`);
const xd = `╭┈ ↷\n│✰ 𝙷𝙾𝙻𝙰 𝚄𝚂𝚄𝙰𝚁𝙸𝙾: ${nombre}│ᰔᩚ Soy ${botName}\n│❀ 𝙲𝚁𝙴𝙰𝙳𝙾𝚁: ${ownerName}\n│✦ 𝙼𝙴𝙽𝚄 ${pefix + comando}\n│⌬ 𝚄𝚁𝙻: ${redes}\n╰─────────────────`
await conn.sendFile(m.chat, img, 'error-xddd.jpg', xd, xdd, null, xddd)
} catch (error) {
    conn.sendMessage(m.chat, '𝙷𝙾𝙻𝙰 𝚄𝚂𝚄𝙰𝚁𝙸𝙾, ¿𝙲𝙾𝙼𝙾 𝚃𝙴 𝙿𝚄𝙴𝙳𝙾 𝙰𝚈𝚄𝙳𝙰𝚁?', 'conversation', { quoted: xdd })
  }
}
handler.customPrefix = /^(Hola|hola|Holis|holis|Ola|ola)$/i
handler.command = new RegExp
handler.register = true
handler.group = true
export default handler