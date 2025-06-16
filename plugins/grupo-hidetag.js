// ⚡✨ Pikachu Hidetag Style ✨⚡

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

var handler = async (m, { conn, text, participants }) => {
  try { 
    let users = participants.map(u => conn.decodeJid(u.id)) 
    let tagText = text ? text : (m.quoted?.text || "*¡Pika Pika saludos!* ⚡")
    let newText = `${tagText}\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡`

    let q = m.quoted || m
    let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender
    let msg = conn.cMod(
      m.chat, 
      generateWAMessageFromContent(
        m.chat, 
        { [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : { text: '' || c } }, 
        { quoted: null, userJid: conn.user.id }
      ), 
      newText, 
      conn.user.jid, 
      { mentions: users }
    )
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch {  
    let users = participants.map(u => conn.decodeJid(u.id))
    let quoted = m.quoted || m
    let mime = (quoted.msg || quoted).mimetype || ''
    let isMedia = /image|video|sticker|audio/.test(mime)
    let more = String.fromCharCode(8206).repeat(850)
    let tagText = text ? text : (m.quoted?.text || "*¡Pika Pika saludos!* ⚡")
    let htextos = `${tagText}\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡`

    if (isMedia && quoted.mtype === 'imageMessage') {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, { image: mediax, mentions: users, caption: htextos }, { quoted: null })
    } else if (isMedia && quoted.mtype === 'videoMessage') {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, { quoted: null })
    } else if (isMedia && quoted.mtype === 'audioMessage') {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: `HidetagPika.mp3` }, { quoted: null })
    } else if (isMedia && quoted.mtype === 'stickerMessage') {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, { sticker: mediax, mentions: users }, { quoted: null })
    } else {
      await conn.relayMessage(
        m.chat, 
        { extendedTextMessage: { text: `${more}\n${htextos}`, contextInfo: { mentionedJid: users } } }, 
        {}
      )
    }
  }
}

// ✅ Aquí está la magia para aceptar con o sin prefijo:
handler.customPrefix = /^(\/|!|\.)?(hidetag|notificar|notify|tag|n)$/i
handler.command = new RegExp // desactiva el manejo estándar para usar customPrefix
handler.group = true
handler.admin = true

export default handler