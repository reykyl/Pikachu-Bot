import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

var handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {

  const pikaEmoji = '⚡'
  const pikaTag = `${pikaEmoji} *¡Pika Pika Notificación!* ${pikaEmoji}`
  const footer = `\n\n> 𝙀𝙣𝙫𝙞𝙖𝙙𝙤 𝙥𝙤𝙧 ⚡ 𝑷𝒊𝒌𝒂𝒄𝒉𝒖 ⚡`

  if (!m.quoted && !text) return conn.reply(m.chat, `${pikaEmoji} ¡Debes enviar un texto para notificar!`, m)

  try { 
    let users = participants.map(u => conn.decodeJid(u.id))
    let tagText = text ? text : (m.quoted?.text || "*¡Pika saludos!* ⚡")

    let newText = `${pikaTag}\n\n${tagText}${footer}`

    let q = m.quoted ? m.quoted : m || m.text || m.sender
    let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender
    let msg = conn.cMod(
      m.chat, 
      generateWAMessageFromContent(
        m.chat, 
        { [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : { text: '' || c }}, 
        { quoted: null, userJid: conn.user.id }
      ), 
      newText, 
      conn.user.jid, 
      { mentions: users }
    )
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch {  
    let users = participants.map(u => conn.decodeJid(u.id))
    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted).mimetype || ''
    let isMedia = /image|video|sticker|audio/.test(mime)
    let more = String.fromCharCode(8206)
    let masss = more.repeat(850)
    let tagText = text ? text : (m.quoted?.text || "*¡Pika saludos!* ⚡")

    let htextos = `${pikaTag}\n\n${tagText}${footer}`

    if ((isMedia && quoted.mtype === 'imageMessage') && htextos) {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, { image: mediax, mentions: users, caption: htextos }, { quoted: null })
    } else if ((isMedia && quoted.mtype === 'videoMessage') && htextos) {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, { quoted: null })
    } else if ((isMedia && quoted.mtype === 'audioMessage') && htextos) {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: `HidetagPika.mp3` }, { quoted: null })
    } else if ((isMedia && quoted.mtype === 'stickerMessage') && htextos) {
      var mediax = await quoted.download?.()
      conn.sendMessage(m.chat, { sticker: mediax, mentions: users }, { quoted: null })
    } else {
      await conn.relayMessage(
        m.chat, 
        { extendedTextMessage: { 
            text: `${masss}\n${htextos}\n`, 
            contextInfo: { 
              mentionedJid: users,
              externalAdReply: {
                title: '¡Pika Notificación!',
                body: 'Powered by Pikachu ⚡',
                thumbnailUrl: 'https://kirito-bot-md.vercel.app/IMG-20250606-WA0167.jpg, 
                sourceUrl: 'https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o'
              } 
            } 
          } 
        }, 
        {}
      )
    }
  }
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'notificar', 'notify', 'tag']
handler.group = true
handler.admin = true

export default handler