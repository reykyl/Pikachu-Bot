let handler = async function (m, { conn, participants, groupMetadata }) {
if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

const normalizeJid = jid => jid?.replace(/[^0-9]/g, '')
const participantList = groupMetadata.participants || []

const result = participantList.map(participant => ({
id: participant.id,
lid: participant.lid || null,
admin: participant.admin || null
}))

const id = participant.id
const lid = participant.lid
const estado = participant.admin

const text = ` *Lid del grupo*

╭━━━━━━━━━━━━━━
┃ID: ${id}
┃LID: ${lid}
┃ESTADO: ${estado}
╰━━━━━━━━━━━━━━/n/n
`

return m.reply(JSON.stringify(text, m))
}

handler.command = ['lid']
handler.help = ['lid']
handler.tags = ['group']

export default handler