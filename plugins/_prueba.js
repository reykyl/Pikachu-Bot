import fetch from 'node-fetch';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`⚠️ Uso incorrecto\n\nEjemplo:\n${usedPrefix + command} https://api.example.com/datos`);
  }

  try {
    const res = await fetch(text);
    const contentType = res.headers.get('content-type') || '';

    
    if (contentType.includes('application/json')) {
      const json = await res.json();
      return m.reply(`✅ *Respuesta JSON:*\n\n` + JSON.stringify(json, null, 2));
    }

    
    const textRes = await res.text();
    return m.reply(`✅ *Respuesta de la API:*\n\n${textRes}`);
  } catch (err) {
    console.error(err);
    return m.reply(`❌ Ocurrió un error al acceder a la API:\n\n${err.message}`);
  }
};

handler.help = ['probarapi <url>'];
handler.tags = ['tools'];
handler.command = /^probarapi$/i;

export default handler;