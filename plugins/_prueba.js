//© Código creado por Deylin 
//https://github.com/Deylin-Eliac
//➤ No quites créditos

let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: '📢 Únete al canal oficial de *Nino Nakano* en WhatsApp.',
    footer: 'Contenido exclusivo y más 🌸',
    templateButtons: [
      {
        index: 1,
        urlButton: {
          displayText: '✐ ꒷ꕤ🩰 ᴄᴀɴᴀʟ ɴɪɴᴏ ɴᴀᴋᴀɴᴏ',
          url: 'https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M'
        }
      }
    ],
    headerType: 1
  }, { quoted: m });
};

handler.command = /^c$/i;
export default handler;