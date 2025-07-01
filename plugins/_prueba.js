import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted || !m.quoted.fileSha256) {
    return m.reply(`📸 Responde a una imagen con *${usedPrefix + command}* para convertirla en estilo animado.`);
  }

  let mime = m.quoted.mimetype || '';
  if (!/image\/(jpe?g|png)/.test(mime)) {
    return m.reply('🚫 Solo imágenes JPG o PNG son soportadas.');
  }

  try {
  const imgBuffer = await m.quoted.download();
  m.reply('🎨 Procesando tu imagen con estilo cartoon...');

  const form = new FormData();
  form.append('image', imgBuffer, 'foto.jpg');

  const response = await fetch('https://api.deepai.org/api/toonify', {
    method: 'POST',
    headers: {
      'Api-Key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K',
      ...form.getHeaders()
    },
    body: form
  });

  const json = await response.json();

  if (!json || !json.output_url) {
    console.log(json); // <-- Añade esto para ver el error real en consola
    throw json.err || 'No se pudo obtener la imagen.';
  }

  await conn.sendFile(m.chat, json.output_url, 'toonify.jpg', '✨ Aquí está tu imagen animada estilo cartoon.', m);

} catch (e) {
  console.error('Error Toonify:', e);
  m.reply('❌ Ocurrió un error al convertir la imagen:\n\n' + e.toString());
}
};

handler.help = ['toon', 'cartoon'];
handler.tags = ['ai', 'fun'];
handler.command = /^(toon|cartoon)$/i;

export default handler;