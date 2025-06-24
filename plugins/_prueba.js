let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*⚠️ Escribe el texto que quieres enviar a tu canal.*\n\nEjemplo:\n${usedPrefix + command} ¡Atención! Nueva actualización este fin de semana 🚀`);
  }

  const canalJid = '0029VawF8fBBvvsktcInIz3m@newsletter'; // JID real del canal
  const canalUrl = 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'; // URL pública
  const thumbnail = icono; 

  try {
    
    await m.react('📣');

    
    await conn.sendMessage(canalJid, {
      text: `📢 *AVISO DEL BOT*\n\n${text}\n\n⏳ _Enviado automáticamente por tu bot_`,
      contextInfo: {
        externalAdReply: {
          title: '🚀 Canal Oficial del Bot',
          body: 'Haz clic para unirte al canal',
          thumbnailUrl: thumbnail,
          sourceUrl: canalUrl,
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: null }); 

    
    await m.reply('✅ *Mensaje enviado correctamente al canal.*');

  } catch (e) {
    console.error('❌ ERROR AL ENVIAR AL CANAL:', e);
    await m.reply('❌ Error al enviar al canal:\n' + (e?.message || e));
  }
};

handler.help = ['aviso <texto>'];
handler.tags = ['owner'];
handler.command = ['aviso'];
handler.rowner = true;

export default handler;