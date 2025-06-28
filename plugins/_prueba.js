let handler = async (m, { text, args, usedPrefix, command }) => {
  if (!text || !/^\d{4,8}$/.test(text)) {
    return m.reply(`📲 Usa el comando así:\n\n*${usedPrefix + command} 842916*\n\nDebe ser un número de 4 a 8 dígitos.`)
  }

  let mensaje = `
📲 *Este es tu código de recuperación:*

\`\`\`
${text}
\`\`\`

📋 Pulsa *"Copiar"* si tu WhatsApp lo permite.
`.trim()

  await conn.sendMessage(m.chat, {
    text: mensaje,
    contextInfo: {
      externalAdReply: {
        title: '🔐 Facebook Recovery',
        body: 'Código generado automáticamente',
        sourceUrl: 'https://facebook.com',
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: false,
        thumbnailUrl: 'https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico'
      }
    }
  }, { quoted: m })
}
handler.command = /^codigo$/i
handler.help = ['codigo <número>']
handler.tags = ['herramientas']

export default handler