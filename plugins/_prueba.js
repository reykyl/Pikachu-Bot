let handler = async (m, { text, usedPrefix, command }) => {
  if (!text || !/^\d{4,8}$/.test(text)) {
    return m.reply(`📲 Usa el comando así:\n\n*${usedPrefix + command} 842916*`)
  }

  const mensaje = `Este es tu código de verificación:\n\n\`\`\`\n${text}\n\`\`\``

  await conn.sendMessage(m.chat, {
    text: mensaje
  }, { quoted: m })
}

handler.command = /^codigo$/i
handler.help = ['codigo <número>']
handler.tags = ['util']

export default handler