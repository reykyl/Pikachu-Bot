import { createHash } from 'crypto'  
import fetch from 'node-fetch'
let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  if (!global.owner.includes(m.sender)) {
    return m.reply('❌ Solo el creador o desarrolladores pueden usar este comando.')
  }

  if (!text) {
    return m.reply(`⚠️ Escribe el texto que quieres enviar al canal.\n\nEjemplo:\n${usedPrefix + command} ¡Atención! Mantenimiento programado esta noche. 🌙`)
  }

  let thumbnail = 'https://i.imgur.com/4M34hi2.jpeg' // Imagen estilo Pikachu (puedes cambiarla)
  let mensaje = `*⚡ 𝙿𝙸𝙺𝙰𝙲𝙷𝚄 - 𝙱𝙾𝚃 ⚡*\n\n${text}\n\n${global.textoBot}`

  await conn.sendMessage(global.idchannel, {
    text: mensaje,
    contextInfo: {
      externalAdReply: {
        title: '🔔 Aviso Oficial - Pikachu Bot',
        body: '🧠 Información importante para todos los usuarios',
        thumbnailUrl: thumbnail,
        sourceUrl: global.redes,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false
      }
    }
  })

  await m.reply('✅ Aviso enviado correctamente al canal.')
}
handler.help = ['aviso <texto>']
handler.tags = ['owner']
handler.command = ['aviso']
handler.rowner = true

export default handlerimport fs from 'fs'
