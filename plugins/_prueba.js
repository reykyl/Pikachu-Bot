import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text || !/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/.test(text)) {
    return m.reply('❌ Debes proporcionar un enlace válido de YouTube.\n\nEjemplo:\n.cookie https://www.youtube.com/watch?v=VIDEO_ID');
  }

  m.reply('🔄 Obteniendo cookies desde las cabeceras HTTP...');

  try {
    const res = await fetch(text, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*'
      }
    });

    // Extraer cookies desde las cabeceras de respuesta
    const rawCookies = res.headers.raw()['set-cookie'] || [];
    if (rawCookies.length === 0) {
      return m.reply('⚠️ No se encontraron cookies.');
    }

    const cookies = rawCookies.map(cookie => cookie.split(';')[0]).join('; ');

    await conn.sendMessage(m.chat, {
      text: `✅ Cookies encontradas:\n\`\`\`\n${cookies}\n\`\`\``
    }, { quoted: m });
  } catch (e) {
    m.reply(`⚠️ Error al obtener cookies:\n${e.message}`);
  }
};

handler.help = ['cookie <url>'];
handler.tags = ['tools'];
handler.command = /^cookie$/i;

export default handler;