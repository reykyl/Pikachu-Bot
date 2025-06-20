import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `✳️ Ejemplo de uso:\n${usedPrefix + command} <enlace de Terabox>\n\n📌 Asegúrate de que sea un enlace válido.`;

  const url = args[0];
  m.reply('⏳ Procesando el enlace, por favor espera...');

  try {
    const { data } = await axios.get(`https://zenzapis.xyz/downloader/terabox?apikey=zenzkey&url=${encodeURIComponent(url)}`);
    
    if (!data.status || !data.result || !data.result.direct_url) {
      throw '⚠️ No se pudo obtener el archivo desde el enlace proporcionado.';
    }

    const { filename, size, direct_url } = data.result;

    const fileSizeMB = (Number(size) / (1024 * 1024)).toFixed(2);
    const mime = filename.toLowerCase().endsWith('.mp4') ? 'video/mp4'
              : filename.toLowerCase().endsWith('.mp3') ? 'audio/mpeg'
              : filename.toLowerCase().endsWith('.pdf') ? 'application/pdf'
              : 'application/octet-stream';

    await conn.sendMessage(m.chat, {
      document: { url: direct_url },
      mimetype: mime,
      fileName: filename,
      caption: `📥 *Archivo descargado desde Terabox*\n\n📄 *Nombre:* ${filename}\n📦 *Tamaño:* ${fileSizeMB} MB`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply('❌ Ocurrió un error al descargar el archivo. Asegúrate de que el enlace sea válido y el archivo esté disponible.');
  }
};

handler.help = ['terabox <url>'];
handler.tags = ['downloader'];
handler.command = ['terabox'];
handler.group = false;
handler.register = true;

export default handler;