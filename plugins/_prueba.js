let handler = async (m, { conn }) => {
  const buttonMessage = {
    text: "🚀 *Estuve usando Copilot y es bastante divertido hablar con la IA.*\n\n¡Inicia la conversación ahora!",
    footer: "🤖 Copilot en WhatsApp",
    buttons: [
      {
        buttonId: 'share_copilot',
        buttonText: { displayText: '✨ Probar Copilot' },
        type: 1
      }
    ],
    headerType: 1
  }

  await conn.sendMessage(m.chat, { buttonsMessage: buttonMessage }, { quoted: m })
}

handler.customPrefix = ['copilot']
handler.command = new RegExp

export default handler