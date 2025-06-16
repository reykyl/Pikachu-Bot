const handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
  const mensajeTexto = m.text?.toLowerCase()
  if (!/^(tagall|todos)$/i.test(mensajeTexto)) return

  const customEmoji = global.db?.data?.chats?.[m.chat]?.customEmoji || '⚡'
  m.react?.(customEmoji)

  if (!(isAdmin || isOwner)) {
    global.dfail?.('admin', m, conn)
    return
  }

  const countryFlags = {
    "52": "🇲🇽", "54": "🇦🇷", "55": "🇧🇷", "57": "🇨🇴", "58": "🇻🇪", "51": "🇵🇪",
    "591": "🇧🇴", "593": "🇪🇨", "595": "🇵🇾", "598": "🇺🇾", "507": "🇵🇦",
    "502": "🇬🇹", "503": "🇸🇻", "504": "🇭🇳", "505": "🇳🇮", "506": "🇨🇷"
  }

  const getPrefix = number => {
    for (let i = 4; i >= 1; i--) {
      const sub = number.slice(0, i)
      if (countryFlags[sub]) return sub
    }
    return null
  }

  const mensaje = args.join(' ')
  const info = mensaje
    ? `╰🧭 *Mensaje:* ${mensaje}`
    : "╰⚠️ *Invocación general de Pika-bot: los administradores te necesitan.*"

  let texto = `
╭─〔⚡ 𝐏𝐈𝐊𝐀𝐋𝐋 ⚡〕──⬣
│ 🧑‍🤝‍🧑 *Miembros:* ${participants.length}
│ 🏷️ *Grupo:* ${await conn.getName(m.chat)}
${info}
╰────⬣\n`

  for (const miembro of participants) {
    const number = miembro.id.split('@')[0]
    const prefix = getPrefix(number)
    const flag = countryFlags[prefix] || "🌐"
    texto += `⚡ ${flag} @${number}\n`
  }

  texto += `\n🔋 𝐄𝐧𝐞𝐫𝐠í𝐚 𝐋𝐢𝐛𝐞𝐫𝐚𝐝𝐚 ⚡\n✨ *by Pikachu™* 🧃`

  await conn.sendMessage(m.chat, {
    text: texto.trim(),
    mentions: participants.map(p => p.id)
  }, { quoted: m })
}

// Habilita que funcione SIN prefijo
handler.customPrefix = /^(tagall|todos)$/i
handler.command = new RegExp // evita ejecución doble
handler.group = true // solo en grupos

export default handler