import axios from 'axios';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `✳️ Usa el comando así:\n${usedPrefix + command} <enlace de Terabox>`;

  const url = args[0];
  m.reply('🔄 Obteniendo información desde Terabox...');

  try {
    const { data } = await axios.get(`https://zenz.biz.id/downloader/terabox?url=${encodeURIComponent(url)}`);
    
    if (!data.status || !data.result) {
      return m.reply('❌ No se pudo obtener la información del archivo.');
    }

    const { filename, size, thumb, direct_url } = data.result;

    await conn.sendMessage(m.chat, {
      document: { url: direct_url },
      mimetype: 'video/mp4',
      fileName: filename,
      caption: `📥 *Archivo descargado de Terabox*\n\n📄 *Nombre:* ${filename}\n📦 *Tamaño:* ${(Number(size) / (1024 * 1024)).toFixed(2)} MB`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al intentar descargar el archivo.');
  }
};

handler.help = ['terabox <url>'];
handler.tags = ['downloader'];
handler.command = ['terabox'];
handler.group = false;

export default handler;