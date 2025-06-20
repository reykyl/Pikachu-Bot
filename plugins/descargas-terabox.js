import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `✳️ Ejemplo de uso:\n${usedPrefix + command} <enlace de Terabox>\n\n📌 Asegúrate de que sea un enlace válido de Terabox.`;

  const url = args[0];
  m.reply('⏳ Procesando el enlace, espera un momento...');

  try {
    const { data } = await axios.get(`https://zenzapis.xyz/downloader/terabox?apikey=zenzkey&url=${encodeURIComponent(url)}`);
    
    if (!data.status || !data.result?.direct_url) {
      throw '⚠️ No se pudo obtener el archivo desde el enlace proporcionado.';
    }

    const { filename, size, direct_url } = data.result;

    const sizeMB = (Number(size) / (1024 * 1024)).toFixed(2);
    const mime =
      filename.toLowerCase().endsWith('.mp4') ? 'video/mp4' :
      filename.toLowerCase().endsWith('.mp3') ? 'audio/mpeg' :
      filename.toLowerCase().endsWith('.pdf') ? 'application/pdf' :
      filename.toLowerCase().endsWith('.zip') ? 'application/zip' :
      'application/octet-stream';

    await conn.sendMessage(m.chat, {
      document: { url: direct_url },
      mimetype: mime,
      fileName: filename,
      caption: `📥 *Archivo desde Terabox*\n\n📄 *Nombre:* ${filename}\n📦 *Tamaño:* ${sizeMB} MB\n📁 Enviado como documento descargable.`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply('❌ Error al descargar o enviar el archivo.\nAsegúrate de que el enlace es válido y que el archivo no haya sido eliminado.');
  }
};

handler.help = ['terabox <url>'];
handler.tags = ['downloader'];
handler.command = ['terabox'];
handler.group = false;
handler.register = true;

export default handler;