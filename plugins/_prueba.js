
const handler = async (m, { conn }) => {
  const buttons = [
    { buttonId: '.owner', buttonText: { displayText: '👑 creador' }, type: 1 },
    buttons: [
  { buttonId: '.menu', buttonText: { displayText: '📋 Menú' }, type: 1 },
]
  ];

  const buttonMessage = {
    text: '✨ *Prueba del botsito* ✨',
    footer: '⚡ ¡Pikachu-Bot en acción!',
    buttons: buttons,
    headerType: 1
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['m'];
handler.tags = ['tools'];
handler.command = ['m'];

export default handler;