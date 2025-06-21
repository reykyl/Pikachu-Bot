const axios = require('axios');

const handler = async (m, { conn }) => {
  try {
    
    await conn.reply(m.chat, '⏳ Consultando la API de Freenom...', m);

    
    const res = await axios.get('https://api.freenom.com/v2/service/ping');
    const { timestamp, result, status } = res.data;

    
    const mensaje = `🛰️ *Freenom API Response:*
📅 *Timestamp:* ${timestamp}
📍 *Resultado:* ${result}
✅ *Estado:* ${status}`;

    
    return conn.reply(m.chat, mensaje, m);
  } catch (err) {
    console.error('[pingfreenom] Error:', err);
    return conn.reply(m.chat, '❌ No se pudo conectar con la API de Freenom.', m);
  }
};

handler.command = ['pingfreenom'];
handler.help = ['pingfreenom'];
handler.tags = ['internet'];
handler.register = true;

module.exports = handler;