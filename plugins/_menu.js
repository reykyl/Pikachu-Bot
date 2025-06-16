import { xpRange } from '../lib/levelling.js'
import ws from 'ws'

let tags = {
  'anime': 'ANIME',
  'juegos': 'JUEGOS',
  'main': 'INFO',
  'ia': 'IA',
  'search': 'SEARCH',
  'game': 'GAME',
  'serbot': 'SUB BOTS',
  'rpg': 'RPG',
  'sticker': 'STICKER',
  'group': 'GROUPS',
  'nable': 'ON / OFF',
  'premium': 'PREMIUM',
  'downloader': 'DOWNLOAD',
  'tools': 'TOOLS',
  'fun': 'FUN',
  'nsfw': 'NSFW',
  'cmd': 'DATABASE',
  'owner': 'OWNER',
  'audio': 'AUDIOS',
  'advanced': 'ADVANCED',
  'weather': 'WEATHER',
  'news': 'NEWS',
  'finance': 'FINANCE',
  'education': 'EDUCATION',
  'health': 'HEALTH',
  'entertainment': 'ENTERTAINMENT',
  'sports': 'SPORTS',
  'travel': 'TRAVEL',
  'food': 'FOOD',
  'shopping': 'SHOPPING',
  'productivity': 'PRODUCTIVITY',
  'social': 'SOCIAL',
  'security': 'SECURITY',
  'custom': 'CUSTOM'
};

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let mode = global.opts["self"] ? "Privado" : "Público"
    let totalCommands = Object.keys(global.plugins).length
    let totalreg = Object.keys(global.db.data.users).length
    let uptime = clockString(process.uptime() * 1000)
    
    const users = [...new Set(
      (global.conns || []).filter(conn => 
        conn.user && conn.ws?.socket?.readyState !== ws.CLOSED
      )
    )]

    if (!global.db.data.users[userId]) {
      global.db.data.users[userId] = { exp: 0, level: 1 }
    }

    let { exp, level } = global.db.data.users[userId]
    let { min, xp, max } = xpRange(level, global.multiplier)

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
        tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
        limit: plugin.limit,
        premium: plugin.premium
      }))

    let menuText = `
╭════〔 ⚡ 𝙋𝙄𝙆𝘼𝘾𝙃𝙐 - 𝘽𝙊𝙏 ⚡ 〕════╮
│ 🧃 *Usuario:* @${userId.split('@')[0]}
│ ⚡ *Tipo:* ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
│ 🌐 *Modo actual:* ${mode}
│ 👥 *Usuarios registrados:* ${totalreg}
│ ⏱️ *Tiempo activo:* ${uptime}
│ 💾 *Comandos:* ${totalCommands}
│ 🤖 *Sub-Bots activos:* ${users.length}
╰════════════════════════════╯
🎮 *📋 COMANDOS DISPONIBLES 📋* ⚡
${readMore}
`.trim()

    // Menús por tags conocidos
    for (let tag in tags) {
      const comandos = help.filter(menu => menu.tags.includes(tag))
      if (comandos.length === 0) continue

      menuText += `

╭─🧃 *${tags[tag]}* ${getRandomEmoji()}
${comandos.map(menu => menu.help.map(cmd =>
  `│ ✦ ${_p}${cmd}${menu.limit ? ' ◜⭐◞' : ''}${menu.premium ? ' ◜🪪◞' : ''}`
).join('\n')).join('\n')}
╰────────────────────────────╯`
    }

    // Comandos con tags no definidos en `tags`
    const unknownTags = help.filter(menu =>
      menu.tags.some(tag => !(tag in tags))
    )

    if (unknownTags.length > 0) {
      menuText += `

╭─🔧 *OTROS* ⚙️
${unknownTags.map(menu => menu.help.map(cmd =>
  `│ ✦ ${_p}${cmd}${menu.limit ? ' ◜⭐◞' : ''}${menu.premium ? ' ◜🪪◞' : ''}`
).join('\n')).join('\n')}
╰────────────────────────────╯`
    }

    // Comandos sin ningún tag
    const noTag = help.filter(menu => menu.tags.length === 0)

    if (noTag.length > 0) {
      menuText += `

╭─📂 *SIN CATEGORÍA* ❓
${noTag.map(menu => menu.help.map(cmd =>
  `│ ✦ ${_p}${cmd}${menu.limit ? ' ◜⭐◞' : ''}${menu.premium ? ' ◜🪪◞' : ''}`
).join('\n')).join('\n')}
╰────────────────────────────╯`
    }

    menuText += `

*👑 © Powered by Deylin - ${botname}*`

    const imageUrls = 'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/IMG-20250613-WA0194.jpg'
    await m.react('👑')

    await conn.sendMessage(m.chat, { 
      text: menuText,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          newsletterName: channelRD.name,
          serverMessageId: -1,
        },
        forwardingScore: 999,
        externalAdReply: {
          title: textbot,
          body: dev,
          thumbnailUrl: imageUrls,
          sourceUrl: redes,
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m)
    throw e
  }
}

handler.help = ['menu', 'allmenu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']
handler.register = true
export default handler

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






/* // no tocar 

import { xpRange } from '../lib/levelling.js'
import ws from 'ws';

let tags = {
  'anime': 'ANIME',
  'juegos': 'JUEGOS',
  'main': 'INFO',
  'ia': 'IA',
  'search': 'SEARCH',
  'game': 'GAME',
  'serbot': 'SUB BOTS',
  'rpg': 'RPG',
  'sticker': 'STICKER',
  'group': 'GROUPS',
  'nable': 'ON / OFF',
  'premium': 'PREMIUM',
  'downloader': 'DOWNLOAD',
  'tools': 'TOOLS',
  'fun': 'FUN',
  'nsfw': 'NSFW',
  'cmd': 'DATABASE',
  'owner': 'OWNER',
  'audio': 'AUDIOS',
  'advanced': 'ADVANCED',
  'weather': 'WEATHER',
  'news': 'NEWS',
  'finance': 'FINANCE',
  'education': 'EDUCATION',
  'health': 'HEALTH',
  'entertainment': 'ENTERTAINMENT',
  'sports': 'SPORTS',
  'travel': 'TRAVEL',
  'food': 'FOOD',
  'shopping': 'SHOPPING',
  'productivity': 'PRODUCTIVITY',
  'social': 'SOCIAL',
  'security': 'SECURITY',
  'custom': 'CUSTOM'
};
// no tocar 
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
        let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let mode = global.opts["self"] ? "Privado" : "Público";
    let totalCommands = Object.keys(global.plugins).length;
    let totalreg = Object.keys(global.db.data.users).length;
    let uptime = clockString(process.uptime() * 1000);
const users = [...new Set([
  ...(global.conns || []).filter(conn => 
    conn.user && conn.ws?.socket?.readyState !== ws.CLOSED
  )
])];

    if (!global.db.data.users[userId]) {
      global.db.data.users[userId] = { exp: 0, level: 1 };
    }

    //let name = await conn.getName(userId);
    let { exp, level } = global.db.data.users[userId];
    let { min, xp, max } = xpRange(level, global.multiplier);
// no tocar 
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }));

    let menuText = `
╭════〔 ⚡ 𝙋𝙄𝙆𝘼𝘾𝙃𝙐 - 𝘽𝙊𝙏 ⚡ 〕════╮
│ 🧃 *Usuario:* @${userId.split('@')[0]}
│ ⚡ *Tipo:* ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
│ 🌐 *Modo actual:* ${mode}
│ 👥 *Usuarios registrados:* ${totalreg}
│ ⏱️ *Tiempo activo:* ${uptime}
│ 💾 *Comandos:* ${totalCommands}
│ 🤖 *Sub-Bots activos:* ${users.length}
╰════════════════════════════╯
🎮 *📋 COMANDOS DISPONIBLES 📋* ⚡
${readMore}

${Object.keys(tags).map(tag => {
  const commandsForTag = help.filter(menu => menu.tags.includes(tag));
  if (commandsForTag.length === 0) return ''; 

  return `
╭─🧃 *${tags[tag]}* ${getRandomEmoji()}
${commandsForTag.map(menu => menu.help.map(help =>
  `│ ✦ ${_p}${help}${menu.limit ? ' ◜⭐◞' : ''}${menu.premium ? ' ◜🪪◞' : ''}`
).join('\n')).join('\n')}
╰────────────────────────────╯`
}).filter(text => text !== '').join('\n')}

*👑 © Powered by Deylin - ${botname}*
`.trim();

    // no tocar 
    const imageUrls = 'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/IMG-20250613-WA0194.jpg';
    let selectedImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

    await m.react('👑');

    await conn.sendMessage(m.chat, { 
      text: menuText.trim(),
      contextInfo: {
          mentionedJid: [m.sender],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: channelRD.id,
              newsletterName: channelRD.name,
              serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
              title: textbot,
              body: dev,
              thumbnailUrl: imageUrls,
              sourceUrl: redes,
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: true,
          },
      },
  }, { quoted: m })
      } catch (e) {
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m);
    throw e;
  }
};

handler.help = ['menu', 'allmenu'];
handler.tags = ['main'];
handler.command = ['menu', 'allmenu', 'menú'];
handler.register = true;

export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

function getRandomEmoji() {
  const emojis = ['👑', '🔥', '🌟', '⚡'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function getLevelProgress(exp, min, max, length = 10) {
  if (exp < min) exp = min;
  if (exp > max) exp = max;
  let progress = Math.floor(((exp - min) / (max - min)) * length);
  progress = Math.max(0, Math.min(progress, length)); 
  let bar = '█'.repeat(progress) + '░'.repeat(length - progress);
  return `[${bar}]`;
}
*/
