import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, text }) => {
  if (!text || !/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/.test(text)) {
    return m.reply('❌ Enlace inválido. Usa:\n.cookie https://www.youtube.com/watch?v=VIDEO_ID');
  }

  m.reply('🔄 Generando archivo de cookies...');

  try {
    const res = await fetch(text, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const rawCookies = res.headers.raw()['set-cookie'] || [];

    if (rawCookies.length === 0) {
      return m.reply('⚠️ No se encontraron cookies.');
    }

    const cookieFile = formatCookiesAsNetscape(rawCookies);
    const fileName = `cookie-${Date.now()}.txt`;
    const filePath = path.join('./tmp', fileName);
    fs.mkdirSync('./tmp', { recursive: true });
    fs.writeFileSync(filePath, cookieFile);

    await conn.sendMessage(m.chat, {
      document: fs.readFileSync(filePath),
      fileName: fileName,
      mimetype: 'text/plain'
    }, { quoted: m });

    fs.unlinkSync(filePath); // eliminar archivo temporal
  } catch (e) {
    m.reply(`⚠️ Error al generar cookies:\n${e.message}`);
  }
};

function formatCookiesAsNetscape(setCookies) {
  let header = `# Netscape HTTP Cookie File
# http://curl.haxx.se/rfc/cookie_spec.html
# This is a generated file!  Do not edit.

`;
  return (
    header +
    setCookies
      .map(cookie => {
        const [nameValue, ...attrs] = cookie.split(';');
        const [name, value] = nameValue.trim().split('=');
        let domain = '.youtube.com';
        let path = '/';
        let secure = false;
        let expires = Math.floor(Date.now() / 1000) + 3600;

        for (let attr of attrs) {
          const [k, v] = attr.trim().split('=');
          if (/domain/i.test(k)) domain = v?.startsWith('.') ? v : '.' + v;
          if (/path/i.test(k)) path = v || '/';
          if (/secure/i.test(k)) secure = true;
          if (/expires/i.test(k)) {
            const expDate = new Date(v || '');
            if (!isNaN(expDate)) expires = Math.floor(expDate.getTime() / 1000);
          }
        }

        return `${domain}\tTRUE\t${path}\t${secure ? 'TRUE' : 'FALSE'}\t${expires}\t${name}\t${value}`;
      })
      .join('\n')
  );
}

handler.help = ['cookie <url>'];
handler.tags = ['tools'];
handler.command = /^cookie$/i;

export default handler;