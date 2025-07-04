import puppeteer from 'puppeteer';

let handler = async (m, { conn, text, command }) => {
  if (!text || !text.includes('youtube.com/watch')) {
    return m.reply('❌ Enlace inválido. Usa:\n.cookie https://www.youtube.com/watch?v=VIDEO_ID');
  }

  m.reply('🔄 Obteniendo cookies del video...');

  try {
    const cookies = await getYouTubeCookies(text);
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    await conn.sendMessage(m.chat, {
      text: `✅ Cookies obtenidas:\n\`\`\`\n${cookieStr}\n\`\`\``
    }, { quoted: m });
  } catch (e) {
    await m.reply(`⚠️ Error al obtener cookies:\n${e.message}`);
  }
};

async function getYouTubeCookies(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const cookies = await page.cookies();
  await browser.close();
  return cookies;
}

handler.help = ['cookie <url>'];
handler.tags = ['tools'];
handler.command = /^cookie$/i;

export default handler;