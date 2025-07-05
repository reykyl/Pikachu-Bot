//© Código creado por Deylin 
//https://github.com/Deylin-Eliac
//➤ No quites créditos

let handler = async (m, { conn }) => {
  const jid = m.chat;

  try {
    await conn.sendMessage(jid, {
      text: "📢 Únete al canal oficial de *Nino Nakano* en WhatsApp.",
      contextInfo: {
        externalAdReply: {
          title: "✐ ꒷ꕤ🩰 ᴄᴀɴᴀʟ ɴɪɴᴏ ɴᴀᴋᴀɴᴏ",
          body: "Contenido exclusivo y noticias 🩷",
          thumbnailUrl: "https://telegra.ph/file/880ef314e4e47b65ac5c3.jpg", // Puedes poner cualquier imagen válida
          sourceUrl: "https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M",
          mediaType: 1,
          renderLargerThumbnail: true
        },
        // Botón CTA
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "✐ ꒷ꕤ🩰 ᴄᴀɴᴀʟ ɴɪɴᴏ ɴᴀᴋᴀɴᴏ",
          url: "https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M",
          merchant_url: "https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M"
        })
      }
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    await m.reply("❌ Ocurrió un error al enviar el botón de canal.");
  }
};

handler.command = /^c$/i;
export default handler;