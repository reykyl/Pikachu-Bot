// © Código creado por Deylin
// https://github.com/Deylin-Eliac
// ➤ No quites créditos

let handler = async (m, { conn }) => {
  const canal = 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'

  await conn.sendMessage(m.chat, {
    text: '🌟 *Canal oficial de Pikachu-Bot*',
    footer: 'Haz clic en el botón para unirte',
    buttons: [
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: '🔗 Ir al canal',
          url: canal,
          merchant_url: canal
        })
      }
    ],
    headerType: 1,
    contextInfo: {
      // Este campo es importante para que el botón aparezca correctamente
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363403119941672@newsletter',
        newsletterName: 'Pikachu-Bot Canal 🧪',
        serverMessageId: '',
      }
    }
  }, { quoted: m })
}

handler.command = ['a']
export default handler