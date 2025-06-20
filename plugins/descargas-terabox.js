import axios from 'axios';
import { Readable } from 'stream';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `✳️ Ejemplo de uso:\n${usedPrefix + command} <enlace de Terabox>`;

  const url = args[0];
  m.reply('⏳ Obteniendo información del archivo desde Terabox...');

  try {
    // Obtener info desde la API de Zenz
    const { data } = await axios.get(`https://zenzapis.xyz/downloader/terabox?apikey=zenzkey&url=${encodeURIComponent(url)}`);

    if (!data.status || !data.result?.direct_url) throw '⚠️ Enlace inválido o archivo no disponible.';

    const { filename, size, direct_url } = data.result;

    m.reply(`📥 Descargando: *${filename}*\n📦 Tamaño: ${(Number(size) / 1048576).toFixed(2)} MB`);

    // Descargar archivo como stream
    const res = await fetch(direct_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!res.ok) throw '❌ No se pudo descargar el archivo.';

    const buffer = await res.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer));

    // Enviar como documento (no como video normal)
    await conn.sendMessage(m.chat, {
      document: stream,
      mimetype: 'application/octet-stream',
      fileName: filename,
      caption: `📁 Archivo descargado desde Terabox:\n\n📄 *${filename}*`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al descargar o enviar el archivo.\nAsegúrate de que el enlace es válido y el archivo no fue eliminado.');
  }
};

handler.help = ['terabox <url>'];
handler.tags = ['downloader'];
handler.command = ['terabox'];
handler.group = false;

export default handler;