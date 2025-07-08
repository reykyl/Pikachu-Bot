let handler = async function (m, { conn, groupMetadata }) {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.')

  const participantes = groupMetadata?.participants || []

  const tarjetas = participantes.map((p, index) => {
    const jid = p.id || 'N/A'
    const estado = p.admin === 'superadmin' ? '👑 Superadmin' :
                   p.admin === 'admin' ? '🛡️ Admin' : '👤 Miembro'

    return [
      '┆ ┏━━━━━━━━━━━━━━━⌬',
      `┆ ┃ 🧾 *Participante ${index + 1}*`,
      `┆ ┃ 👤 *Usuario:* @${jid.split('@')[0]}`,
      `┆ ┃ 🔑 *JID:* ${jid}`,
      `┆ ┃ 📌 *Estado:* ${estado}`,
      '┆ ┗━━━━━━━━━━━━━━━━━━⌬'
    ].join('\n')
  })

  const contenido = tarjetas.join('\n┆\n')
  const salida = [
    '╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⑆',
    '┆',
    contenido,
    '┆',
    '╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⑆'
  ].join('\n')

  const mencionados = participantes.map(p => p.id).filter(Boolean)
  return conn.reply(m.chat, salida, m, { mentions: mencionados })
}

handler.command = ['lid']
handler.help = ['lid']
handler.tags = ['group']

export default handler