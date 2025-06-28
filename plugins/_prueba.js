Con botón de copiar automático si WhatsApp lo permite.

---

### ✅ Código del comando `.copy`:

```js
let handler = async (m, { text, args, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Usa el comando así:\n\n${usedPrefix + command} texto que quieras copiar`);

  let estilo = `
⚡ *𝙋𝙞𝙠𝙖𝙘𝙝𝙪 𝙥𝙧𝙪𝙚𝙗𝙖* ⚡

\`\`\`js
${text}
\`\`\`

📋 *𝘾𝙤𝙥𝙞𝙖 𝙧á𝙥𝙞𝙙𝙖 𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙖*`.trim();

  await conn.sendMessage(m.chat, {
    text: estilo,
    contextInfo: {
      externalAdReply: {
        title: '✨ Pikachu Test v1',
        body: 'ᴋɪʀɪᴛᴏ-ʙᴏᴛ | ᴘʀᴜᴇʙᴀ ᴅᴇ ᴄᴏᴘɪᴀ',
        thumbnailUrl: 'https://telegra.ph/file/3f51c7b17f07100ae9ed6.jpg', // Puedes cambiarla
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: 'https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o'
      }
    }
  }, { quoted: m })
}
handler.help = ['copy <texto>']
handler.tags = ['herramientas']
handler.command = /^copy$/i

export default handler