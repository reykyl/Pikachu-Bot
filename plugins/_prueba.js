//© Código creado por Deylin
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
      // Aquí está el truco: debes simular que es reenviado desde un canal
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363217179176783@newsletter', // ID de canal real o simulado
        newsletterName: 'Pikachu-Bot Oficial 🧪',
        serverMessageId: '',
      }
    }
  }, { quoted: m })
}

handler.command = ['a']
export default handler