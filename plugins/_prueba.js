let gruposAdmin = {}

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (command === 'groupplease') {
    const groups = Object.entries(conn.chats)
      .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isGroup && chat.participants?.some(p => p.id === conn.user.jid && p.admin === 'admin'))

    if (groups.length === 0) {
      return m.reply('⚠️ No soy administrador en ningún grupo.')
    }

    let text = '*📋 Lista de grupos donde soy admin:*\n\n'
    gruposAdmin = {} // Limpiar anterior

    groups.forEach(([jid, chat], index) => {
      gruposAdmin[index + 1] = jid
      text += `${index + 1}. ${chat.subject || 'Grupo sin nombre'}\n`
    })

    text += `\n📌 Usa: *${usedPrefix}seraviso <número> <mensaje>* para enviar un aviso.`

    return m.reply(text)
  }

  if (command === 'seraviso') {
    if (!args[0] || !args[1]) {
      return m.reply(`❌ Uso incorrecto.\nEjemplo: *${usedPrefix}seraviso 2 Este es un aviso importante*`)
    }

    const numero = parseInt(args[0])
    const mensaje = args.slice(1).join(' ')

    if (!gruposAdmin[numero]) {
      return m.reply('❌ Número inválido. Usa el comando *groupplease* para ver la lista.')
    }

    const jid = gruposAdmin[numero]
    await conn.sendMessage(jid, {
      text: `📢 *Aviso del bot:*\n\n${mensaje}`
    })

    return m.reply('✅ Aviso enviado correctamente.')
  }
}

handler.help = ['groupplease', 'seraviso <número> <mensaje>']
handler.tags = ['grupos']
handler.command = ['groupplease', 'seraviso']

export default handler