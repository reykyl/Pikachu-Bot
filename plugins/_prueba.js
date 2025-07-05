//© código creado por Deylin 
//https://github.com/Deylin-Eliac 
//➤ no quites créditos

let handler = async (m, { conn, args }) => {
  const canal = '120363403119941672@newsletter' // ID de tu canal oficial
  const name = args[0] || 'Sticker URL'
  const url = args[1] || 'https://sticker.ly/s/ABCDEFG'

  const mensaje = `📋 *Pulsa el botón o copia el siguiente enlace:*\n\n🔗 ${url}`

  await conn.sendMessage(canal, {
    text: mensaje,
    footer: 'Pikachu Bot by Deylin',
    contextInfo: {
      externalAdReply: {
        title: `📎 Copiar ${name}`,
        body: 'Haz clic para copiar el enlace',
        mediaType: 1,
        renderLargerThumbnail: true,
        thumbnailUrl: 'https://i.imgur.com/qG1zZ2T.png', // Puedes cambiar por tu logo si deseas
        sourceUrl: url
      }
    }
  })

  await m.reply('✅ Enlace enviado al canal correctamente.')
}

handler.command = ['cop']
handler.tags = ['tools']
handler.help = ['cop [nombre] [url]']
// Ejemplo: .cop Grupo https://chat.whatsapp.com/...

export default handler