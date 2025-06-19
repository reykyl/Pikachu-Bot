let handler = async (m, { conn, args, usedPrefix, command }) => {
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => icono) 
let isClose = { // Switch Case Like :v
'open': 'not_announcement',
'close': 'announcement',
'abierto': 'not_announcement',
'cerrado': 'announcement',
'on': 'not_announcement',
'off': 'announcement',
}[(args[0] || '')]
if (isClose === undefined)
return conn.reply(m.chat, `⚡️🐭 *¡Pika Pika! Elige una opción para configurar el grupo*\n\nEjemplos:\n*⚡ ${usedPrefix + command} on*\n*⚡ ${usedPrefix + command} off*\n*⚡ ${usedPrefix + command} close*\n*⚡ ${usedPrefix + command} open*`, m, rcanal)
await conn.groupSettingUpdate(m.chat, isClose)

if (isClose === 'not_announcement'){
   const conn.reply(m.chat, `🗨️✨ *¡Pikachu dice que todos pueden hablar ahora!*\n\n⚡ ¡Pikapi! El grupo ha sido abierto.` m, rcanal)
}

if (isClose === 'announcement'){
const conn.reply(m.chat, `🔒🚫 *¡Pikachu activó el modo silencioso!*\n\n⚡ Solo los *líderes de gimnasio* (admins) pueden hablar ahora.` m, rcanal)
}}
handler.help = ['group open / close', 'grupo on / off']
handler.tags = ['grupo']
handler.command = ['group', 'grupo']
handler.admin = true
handler.botAdmin = true;


export default handler