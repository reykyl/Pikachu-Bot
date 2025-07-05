// © Código creado por Deylin
// https://github.com/Deylin-Eliac
// ➤ No quites créditos

let handler = async (m, { conn }) => {
  const url = 'https://github.com/Deylin-Eliac' // 🔗 Cambia esta URL si deseas

  await conn.sendMessage(m.chat, {
    text: '🔗 *Haz clic en el botón para abrir la URL:*',
    footer: 'Pikachu-Bot • by Deylin',
    templateButtons: [
      {
        index: 1,
        urlButton: {
          displayText: '🌐 Abrir GitHub',
          url: url
        }
      }
    ]
  }, { quoted: m })
}

handler.command = ['a'] // comando .a
export default handler