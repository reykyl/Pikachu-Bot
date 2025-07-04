import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

let handler = async (m, { conn, text }) => {
  if (!text || !text.includes('youtube.com/watch')) {
    return m.reply('❌ Enlace inválido. Usa:\n.cookie https://www.youtube.com/watch?v=VIDEO_ID');
  }

  m.reply('🔄 Obteniendo cookies...');

  try {
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar }));

    await client.get(text, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const cookies = await jar.getCookies(text);
    const cookieStr = cookies.map(c => `${c.key}=${c.value}`).join('; ');

    await conn.sendMessage(m.chat, {
      text: `✅ Cookies obtenidas:\n\`\`\`\n${cookieStr}\n\`\`\``
    }, { quoted: m });

  } catch (e) {
    m.reply(`⚠️ Error al obtener cookies:\n${e.message}`);
  }
};

handler.help = ['cookie <url>'];
handler.tags = ['tools'];
handler.command = /^cookie$/i;

export default handler;