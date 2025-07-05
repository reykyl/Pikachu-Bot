import speed from 'performance-now'
import { exec } from 'child_process'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  let latensi = speed() - timestamp

  exec('neofetch --stdout', async (error, stdout, stderr) => {
    const texto = `
╭━━━⊰ ⚡ *Pikachu-Bot* ⚡ ⊱━━━╮
┃ ⚡ *Estado:* ¡Activo y cargado!
┃ 🕒 *Velocidad:* ${latensi.toFixed(4)} ms
╰━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim()

    const messageContent = global.botonCanal(texto)
    const msg = generateWAMessageFromContent(m.chat, messageContent, {})
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']
handler.register = true

export default handler