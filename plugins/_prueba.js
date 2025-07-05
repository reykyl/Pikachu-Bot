// © Código creado por Deylin
// https://github.com/Deylin-Eliac
// ➤ No quites créditos

let handler = async (m, { conn }) => {
  const canal = 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'

  await conn.sendMessage(m.chat, {
    text: '🪄 *Canal oficial de Pikachu-Bot*',
    footer: 'Síguelo para más actualizaciones',
    buttons: [
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: '✐ Canal oficial',
          url: canal,
          merchant_url: canal
        })
      }
    ],
    headerType: 1,
    contextInfo: {
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363217179176783@newsletter',
        newsletterName: 'Pikachu-Bot Oficial 🧪',
        serverMessageId: '',
      },
      externalAdReply: {
        title: 'Pikachu-Bot Oficial',
        body: 'Únete al canal y entérate de todo',
        mediaUrl: canal,
        sourceUrl: canal,
        thumbnailUrl: 'https://files.catbox.moe/b0woxx.jpg',
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true
      }
    }
  }, { quoted: m })
}

handler.command = ['a']
export default handler