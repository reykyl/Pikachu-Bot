let handler = async function (m, { conn, participants, groupMetadata }) {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.')

  const participantList = groupMetadata?.participants || []

  const lista = participantList.map((p, index) => {
    const id = p.id || 'N/A'
    const estado = p.admin ? 'admin' : 'miembro'
    return `╭━━ 👤 Participante ${index + 1}
┃ 🆔 ID: ${id}
┃ 👤 Usuario: @${id.split('@')[0]}
┃ 🛡️ Estado: ${estado}
╰━━━━━━━━━━━━━━`
  })

  const text = `*📋 Lista de Participantes*\n\n${lista.join('\n\n')}`

  const mencionados = participantList.map(p => p.id).filter(Boolean)
  return conn.reply(m.chat, text, m, { mentions: mencionados })
}

handler.command = ['lid']
handler.help = ['lid']
handler.tags = ['group']

export default handler