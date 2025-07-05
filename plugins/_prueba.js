//© Código creado por Deylin 
//https://github.com/Deylin-Eliac
//➤ No quites créditos

let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: 'Únete al canal oficial de Nino Nakano ✨',
    footer: 'Canal exclusivo de WhatsApp',
    buttons: [
      {
        buttonId: 'canal_nino',
        buttonText: { displayText: '✐ ꒷ꕤ🩰 ᴄᴀɴᴀʟ ɴɪɴᴏ ɴᴀᴋᴀɴᴏ' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m });
};

handler.command = /^c$/i;
export default handler;