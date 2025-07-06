import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js'; // opcional si quieres responder como sticker

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let texto = args.join(" ");
  if (!texto) throw `📸 Usa el comando así:\n\n${usedPrefix + command} gato`;

  let loading = '🎨 Generando imágenes con IA... espera un momento.\n\n🧠 *Pollinations*\n🎨 *Craiyon*\n🤖 *DeepAI*';
  await m.reply(loading);

  // 1. Pollinations (instantáneo)
  try {
    let pollinationsURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(texto)}`;
    await conn.sendFile(m.chat, pollinationsURL, 'pollinations.jpg', `🧠 *Pollinations AI*\n🔗 ${pollinationsURL}`, m);
  } catch (e) {
    console.log('Pollinations Error:', e);
  }

  // 2. Craiyon (ex DALL·E mini)
  try {
    let res = await fetch('https://backend.craiyon.com/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: texto })
    });
    let json = await res.json();
    let image = json.images?.[0];
    if (image) {
      let buffer = Buffer.from(image, 'base64');
      await conn.sendFile(m.chat, buffer, 'craiyon.jpg', '🎨 *Craiyon (DALL·E mini)*', m);
    }
  } catch (e) {
    console.log('Craiyon Error:', e);
  }

  // 3. DeepAI (gratis con limitaciones)
  try {
    let r = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        'Api-Key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K', // Llave de prueba pública
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ text: texto }),
    });
    let j = await r.json();
    if (j.output_url) {
      await conn.sendFile(m.chat, j.output_url, 'deepai.jpg', '🤖 *DeepAI Generator*', m);
    }
  } catch (e) {
    console.log('DeepAI Error:', e);
  }

  // 4. Mage.Space - opcional, sin API directa
  // Para usar Mage.Space deberías hacer scraping o integrar su WebUI (no recomendado sin permisos)

};
handler.help = ['imagen <texto>'];
handler.tags = ['ia'];
handler.command = /^imagen$/i;

export default handler;