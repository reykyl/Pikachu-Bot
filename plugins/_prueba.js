const axios = require('axios');

async function handler(m, { conn, text }) {
  try {
    const res = await axios.get('https://api.freenom.com/v2/service/ping');
    const data = res.data;

    const respuesta = `🛰️ *Ping a Freenom API:*
📅 Timestamp: ${data.timestamp}
📍 Resultado: ${data.result}
✅ Estado: ${data.status}`;

    await conn.reply(m.chat, respuesta, m);
  } catch (e) {
    await conn.reply(m.chat, '❌ Error al hacer ping a la API de Freenom.', m);
    console.error(e);
  }
}

handler.command = /^pingfreenom$/i;
handler.tags = ['internet'];
handler.help = ['pingfreenom'];
handler.register = true;

module.exports = handler;