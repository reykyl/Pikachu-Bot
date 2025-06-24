let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*⚠️ Escribe el texto que quieres enviar al canal desde los subbots.*\n\nEjemplo:\n${usedPrefix + command} ¡Atención! Nueva actualización 🚀`);
  }

  const canalJid = global.channelJid || '0029VbAix53FnSz4CU0a580q@newsletter';
  const canalUrl = global.channelUrl || 'https://whatsapp.com/channel/0029VbAix53FnSz4CU0a580q';
  const thumbnail = global.channelThumbnail || 'https://files.catbox.moe/xr2m6u.jpg';

  const mensaje = {
    text: `📢 *AVISO DEL BOT*\n\n${text}\n\n⏳ _Publicado automáticamente por el bot auxiliar_`,
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
  };

  // Enviar desde subbots conectados
  let enviados = 0;

  for (let bot of global.conns || []) {
    try {
      await bot.sendMessage(canalJid, mensaje, { quoted: null });
      enviados++;
    } catch (e) {
      console.error(`[❌] Falló envío desde un subbot:`, e?.message || e);
    }
  }

  if (enviados > 0) {
    await m.reply(`✅ *Mensaje enviado correctamente al canal desde ${enviados} subbot(s).*`);
  } else {
    await m.reply(`⚠️ No se encontró ningún subbot que haya podido publicar el mensaje.\n\nAsegúrate de que:\n- Estén conectados (global.conns)\n- Sean editores del canal\n- El canal JID esté correcto`);
  }
};

handler.help = ['avisar <texto>'];
handler.tags = ['owner'];
handler.command = ['avisar'];
handler.rowner = true;

export default handler;