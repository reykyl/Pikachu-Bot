import { xpRange } from '../lib/levelling.js'
import ws from 'ws'

const tags = {
  anime: 'ANIME',
  juegos: 'JUEGOS',
  main: 'INFO',
  ia: 'IA',
  search: 'SEARCH',
  game: 'GAME',
  serbot: 'SUB BOTS',
  rpg: 'RPG',
  sticker: 'STICKER',
  group: 'GROUPS',
  nable: 'ON / OFF',
  premium: 'PREMIUM',
  downloader: 'DOWNLOAD',
  tools: 'TOOLS',
  fun: 'FUN',
  nsfw: 'NSFW',
  cmd: 'DATABASE',
  owner: 'OWNER',
  audio: 'AUDIOS',
  advanced: 'ADVANCED',
  weather: 'WEATHER',
  news: 'NEWS',
  finance: 'FINANCE',
  education: 'EDUCATION',
  health: 'HEALTH',
  entertainment: 'ENTERTAINMENT',
  sports: 'SPORTS',
  travel: 'TRAVEL',
  food: 'FOOD',
  shopping: 'SHOPPING',
  productivity: 'PRODUCTIVITY',
  social: 'SOCIAL',
  security: 'SECURITY',
  custom: 'CUSTOM'
}

let handler = async (m, { conn }) => {
  try {
    const userId = m.mentionedJid?.[0] || m.sender
    const user = global.db.data.users[userId] || {}
    const name = await conn.getName(userId)
    const mode = global.opts["self"] ? "Privado" : "Público"
    const totalCommands = Object.keys(global.plugins).length
    const totalreg = Object.keys(global.db.data.users).length
    const uptime = clockString(process.uptime() * 1000)

    const { exp = 0, level = 0 } = user
    const { min, xp, max } = xpRange(level, global.multiplier || 1)

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : (p.help ? [p.help] : []),
        tags: Array.isArray(p.tags) ? p.tags : (p.tags ? [p.tags] : []),
        limit: p.limit,
        premium: p.premium
      }))

    let menuText = `
╭════〔 ⚡ 𝙋𝙄𝙆𝘼𝘾𝙃𝙐 - 𝘽𝙊𝙏 ⚡ 〕════╮
│ 🧃 *Usuario:* @${userId.split('@')[0]}
│ ⚡ *Tipo:* ${(conn.user.jid === global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
│ 🌐 *Modo actual:* ${mode}
│ 👥 *Usuarios registrados:* ${totalreg}
│ ⏱️ *Tiempo activo:* ${uptime}
│ 💾 *Comandos:* ${totalCommands}
╰════════════════════════════╯
🎮 *📋 COMANDOS DISPONIBLES 📋* ⚡
${readMore}
`

    for (let tag in tags) {
      const comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `\n╭─🧃 *${tags[tag]}* ${getRandomEmoji()}\n`
      menuText += comandos.map(menu =>
        menu.help.map(cmd =>
          `│ ✦ ${cmd}${menu.limit ? ' ◜⭐◞' : ''}${menu.premium ? ' ◜🪪◞' : ''}`
        ).join('\n')
      ).join('\n')
      menuText += `\n╰────────────────────────────╯`
    }

    menuText += `\n\n*👑 © Powered by Deylin - Pikachu Bot*`

    const imageUrl = [
      'https://kirito-bot-md.vercel.app/IMG-20250606-WA0167.jpg',
      'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/pika.jpg',
      'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/pikay.jpg',
      'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/pikachu.jpg',
      'https://kirito-bot-md.vercel.app/catalogo.jpg'
    ]
    const selectedImage = imageUrl[Math.floor(Math.random() * imageUrl.length)]

    await m.react('👑')

    await conn.sendMessage(m.chat, {
      text: menuText,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 999,
        externalAdReply: {
          //title: dev,
          thumbnailUrl: selectedImage,
        //  mediaType: 1,
         // showAdAttribution: true,
        //  renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m)
  }
}

handler.help = ['menu', 'menú']
handler.tags = ['main']
handler.command = ['menú', 'menu']
handler.register = true

export default handler

// Extras
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function getRandomEmoji() {
  const emojis = ['👑', '🔥', '🌟', '⚡']
  return emojis[Math.floor(Math.random() * emojis.length)]
}