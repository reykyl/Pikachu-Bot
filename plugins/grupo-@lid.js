let handler = async function (m, { conn, groupMetadata }) {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.')

  const participantes = groupMetadata?.participants || []

  const lista = participantes.map((p, index) => {
    const jid = p.id || 'N/A'
    const lid = p.lid || 'N/A'
    const estado = p.admin === 'superadmin' ? '👑 Super Admin' :
                   p.admin === 'admin' ? '🛡️ Admin' : '👤 Miembro'

    return `╭━━━ 🧾 Participante ${index + 1}
┃ 👤 Usuario: @${jid.split('@')[0]}
┃ 🔑 JID: ${jid}
┃ 🧬 LID: ${lid}
┃ 📌 Estado: ${estado}
╰━━━━━━━━━━━━━━━━━━━`
  })

  const textoFinal = `*📋 Lista de Participantes del Grupo*\n\n${lista.join('\n|\n')}`

  const mencionados = participantes.map(p => p.id).filter(Boolean)
  return conn.reply(m.chat, textoFinal, m, { mentions: mencionados })
}

handler.command = ['lid']
handler.help = ['lid']
handler.tags = ['group']

export default handler