import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const canalJid = global.idchannel || '0029VawF8fBBvvsktcInIz3m@newsletter'
  const icono = global.icono || 'https://i.imgur.com/4M34hi2.jpeg'
  const redes = global.redes || 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
  

  const isMedia = m.quoted?.mimetype || m.quoted?.mediaType

  try {
    if (m.quoted && isMedia) {
      const media = await m.quoted.download()
      const type = m.quoted?.mimetype?.split('/')[0]
      const fileType = m.quoted?.mimetype

      await conn.sendMessage(canalJid, {
        [type]: media,
        mimetype: fileType,
        caption: text || '📢 𝐀𝐕𝐈𝐒𝐎 𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓𝐄 ⚡',
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: canalJid,
            serverMessageId: 100,
            newsletterName: namechannel
          },
          externalAdReply: {
            title: '📢 𝐀𝐕𝐈𝐒𝐎 𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓𝐄 ⚡',
            body: dev,
            thumbnailUrl: icono,
            sourceUrl: redes,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true
          }
        }
      }, { quoted: m })

      await m.reply('✅ Aviso multimedia enviado al canal.')
    } else {
      if (!text) {
        return m.reply(`⚠️ Escribe el texto que quieres enviar al canal, o etiqueta un archivo.\n\nEjemplo:\n${usedPrefix + command} ¡Atención! Mantenimiento programado esta noche. 🌙`)
      }

      const mensaje = `> *AVISO ENVIADO POR EL BOT 🔔*\n\n${text}`

      await conn.sendMessage(canalJid, {
        text: mensaje,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: canalJid,
            serverMessageId: 100,
            newsletterName: namechannel
          },
          externalAdReply: {
            title: '📢 𝐀𝐕𝐈𝐒𝐎 𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓𝐄 ⚡',
            body: dev,
            thumbnailUrl: icono,
            sourceUrl: redes,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true
          }
        }
      })

      await m.reply('✅ Aviso de texto enviado correctamente al canal.')
    }
  } catch (e) {
    console.error(e)
    await m.reply('❌ Error al enviar el aviso. Asegúrate de que el bot esté en el canal como administrador.')
  }
}

handler.help = ['aviso <texto>']
handler.tags = ['owner']
handler.command = ['aviso']
handler.rowner = true

export default handler