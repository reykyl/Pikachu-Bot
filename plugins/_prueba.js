/*import axios from 'axios';

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

handler.help = ['pingfreenom'];
handler.tags = ['main'];
handler.command = ['pingfreenom'];

export default handler;*/

import axios from 'axios';

const API_BASE = 'https://api.freenom.com/v2';

// =======================
// FUNCIONES FREENOM API
// =======================

// Hacer ping al servicio
async function ping() {
  try {
    const response = await axios.get(`${API_BASE}/service/ping`, {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Buscar dominio disponible
async function searchDomain(domainname, domaintype, email, password) {
  try {
    const url = `${API_BASE}/domain/search`;
    const params = {
      domainname,
      domaintype, // "PAID" o "FREE"
      email,
      password,
    };
    const response = await axios.get(url, { params, headers: { Accept: 'application/json' } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Registrar dominio
async function registerDomain({
  domainname,
  period = '1Y',
  forward_url,
  forward_mode = 'cloak',
  nameservers = [],
  owner_id,
  billing_id,
  tech_id,
  admin_id,
  email,
  password,
  domaintype,
  idshield = 'disabled',
  autorenew = 'enabled',
}) {
  try {
    const url = `${API_BASE}/domain/register`;
    const data = {
      domainname,
      period,
      email,
      password,
      domaintype,
      idshield,
      autorenew,
    };

    if (!nameservers.length && !forward_url) {
      throw new Error('Debe proporcionar al menos nameservers o forward_url');
    }

    if (nameservers.length >= 2) {
      nameservers.forEach((ns, i) => (data[`nameserver[${i}]`] = ns));
    } else if (forward_url) {
      data.forward_url = forward_url;
      data.forward_mode = forward_mode;
    }

    if (owner_id) data.owner_id = owner_id;
    if (billing_id) data.billing_id = billing_id;
    if (tech_id) data.tech_id = tech_id;
    if (admin_id) data.admin_id = admin_id;

    const response = await axios.post(url, new URLSearchParams(data).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Renovar dominio
async function renewDomain({ domainname, period = '1Y', email, password }) {
  try {
    const url = `${API_BASE}/domain/renew`;
    const data = { domainname, period, email, password };

    const response = await axios.post(url, new URLSearchParams(data).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// =======================
// COMANDO .pingfreenom
// =======================

let handler = async (m, { reply }) => {
  try {
await conn.reply(m.chat, '⏳ Consultando la API de Freenom...', m);

    const data = await ping();
    let text = `🟢 *Freenom API Ping OK*\n\n` +
               `📍 *Resultado:* ${data.result}\n` +
               `📶 *Estado:* ${data.status}\n` +
               `🕒 *Timestamp:* ${data.timestamp}`;
    await reply(text);
  } catch (error) {
    let errMsg = error?.message || JSON.stringify(error?.response?.data || error, null, 2);
    await reply(`🔴 *Error al hacer ping a Freenom:*\n\`\`\`\n${errMsg}\n\`\`\``);
  }
};

handler.help = ['pingfreenom'];
handler.tags = ['main'];
handler.command = ['pingfreenom'];

export default handler;

// =======================
// EXPORT OPCIONAL DE API
// =======================
export {
  ping,
  searchDomain,
  registerDomain,
  renewDomain
};