const font2 = {
  a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
  h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
  o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
  v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩'
}

const handler = async (m, { conn, text }) => {
  if (!text || !text.includes('|')) {
    return m.reply(`${emojis} *Formato incorrecto.*\nUsa:\n.reactch enlace | Texto personalizado`)
  }

  let [link, ...messageParts] = text.split('|')
  link = link.trim()
  const msg = messageParts.join('|').trim().toLowerCase()

  if (!/^https:\/\/whatsapp\.com\/channel\/[a-zA-Z0-9]+\/[0-9]+$/.test(link)) {
    return m.reply(`${emojis} *Enlace inválido.*\nDebe tener el formato: https://whatsapp.com/channel/<id>/<mensajeId>`)
  }

  const emoji = msg.split('').map(c => c === ' ' ? '―' : (font2[c] || c)).join('')

  try {
    const parts = link.split('/')
    const channelId = parts[4]
    const messageId = parts[5]

    const res = await conn.newsletterMetadata('invite', channelId)
    await conn.newsletterReactMessage(res.id, messageId, emoji)

    m.reply(`${emojis} *Reacción enviada exitosamente.*\nTexto: *${emoji}*\nCanal: *${res.name}*`)
  } catch (e) {
    console.error(e)
    m.reply(`${emojis} *Error:* No se pudo reaccionar al mensaje.\nVerifica el enlace, el ID del mensaje y tu conexión.`)
  }
}

handler.command = ['reactch', 'rch']
handler.tags = ['tools']
handler.help = ['reactch <link>|<texto>']
handler.owner = true

export default handler