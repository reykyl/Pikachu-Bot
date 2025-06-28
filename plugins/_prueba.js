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
    }
  }, { quoted: m })
}
handler.help = ['copy <texto>']
handler.tags = ['herramientas']
handler.command = /^copy$/i

export default handler