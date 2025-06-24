import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Verificar si el usuario es owner
  if (!global.owner.includes(m.sender)) {
    return m.reply('❌ Solo el creador o desarrolladores pueden usar este comando.')
  }

  // Validar texto
  if (!text) {
    return m.reply(`⚠️ Escribe el texto que quieres enviar al canal.\n\nEjemplo:\n${usedPrefix + command} ¡Atención! Mantenimiento programado esta noche. 🌙`)
  }

  // Datos base
  const canalJid = global.idchannel || '0029VawF8fBBvvsktcInIz3m@newsletter' // Asegúrate de establecer esto en tu global
  const thumbnail = 'https://i.imgur.com/4M34hi2.jpeg' // Puedes cambiarla por otra imagen estilo Pikachu
  const redes = global.redes || 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
  const pie = global.textoBot || '🤖 Gracias por usar Pikachu-Bot'

  // Formato del mensaje
  const mensaje = `*⚡ 𝙿𝙸𝙺𝙰𝙲𝙷𝚄 - 𝙱𝙾𝚃 ⚡*\n\n${text}\n\n${pie}`

  try {
    await conn.sendMessage(canalJid, {
      text: mensaje,
      contextInfo: {
        externalAdReply: {
          title: '🔔 Aviso Oficial - Pikachu Bot',
          body: '🧠 Información importante para todos los usuarios',
          thumbnailUrl: thumbnail,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: false
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