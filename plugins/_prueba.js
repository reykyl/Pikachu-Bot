import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  if (!text) {
    return m.reply(`⚠️ Escribe el texto que quieres enviar al canal.\n\nEjemplo:\n${usedPrefix + command} ¡Atención! Mantenimiento programado esta noche. 🌙`)
  }

  
  const canalJid = global.idchannel || '0029VawF8fBBvvsktcInIz3m@newsletter' 
  const thumbnail = 'https://i.imgur.com/4M34hi2.jpeg' 
  const redes = global.redes || 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
  
  
  const mensaje = `> *AVISO ENVIADO POR EL BOT 🔔*\n\n${text}`

 /* try {
    await conn.sendMessage(canalJid, {
      text: mensaje,
      contextInfo: {
        externalAdReply: {
          title: '🔔 Aviso Oficial - Pikachu Bot',
          body: '🧠 Información importante para todos los usuarios',
          thumbnailUrl: icono,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: false
        }
      }
    })*/

try {
    await conn.sendMessage(canalJid, {
      text: mensaje,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name
        },
        externalAdReply: {
          title: textbot,
          body: dev,
          mediaUrl: null,
          description: null,
          previewType: "PHOTO",
          thumbnailUrl: icono,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: true
        }
      }
    })

    await m.reply('✅ Aviso enviado correctamente al canal.')
  } catch (e) {
    console.error(e)
    await m.reply('❌ Error al enviar el mensaje. Asegúrate que el bot esté en el canal como administrador.')
  }
}

handler.help = ['aviso <texto>']
handler.tags = ['owner']
handler.command = ['aviso']
handler.rowner = true

export default handler