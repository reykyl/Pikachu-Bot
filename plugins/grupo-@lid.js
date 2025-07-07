let handler = async function (m, { conn, participants, groupMetadata }) {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.')

  const normalizeJid = jid => jid?.replace(/[^0-9]/g, '')
    const userId = m.mentionedJid?.[0] || m.sender

  const participantList = groupMetadata.participants || []

  const lista = participantList.map((p, index) => {
    const id = p.id
    const lid = p.lid || 'N/A'
    const estado = p.admin || 'miembro'
    return `╭━━ 👤 Participante ${index + 1}
┃ 🆔 ID: ${id}
┃ 👤 usar:  @${userId.split('@')[0]}
┃ 🛡️ Estado: ${estado}
╰━━━━━━━━━━━━━━`
  })

  const text = `*📋 Lista de Participantes*\n\n${lista.join('\n\n')}`
  return m.reply(text, mentionedJid: [m.sender])
}

handler.command = ['lid']
handler.help = ['lid']
handler.tags = ['group']

export default handler