import axios from 'axios';
import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import path from 'path';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `✳️ Ejemplo de uso:\n${usedPrefix + command} <enlace de Terabox>`;

  const url = args[0];
  m.reply('⏳ Obteniendo información del archivo...');

  try {
    const { data } = await axios.get(`https://zenzapis.xyz/downloader/terabox?apikey=zenzkey&url=${encodeURIComponent(url)}`);
    if (!data.status || !data.result?.direct_url) throw '⚠️ No se pudo obtener el enlace directo.';

    const { filename, size, direct_url } = data.result;
    const extension = path.extname(filename);
    const tempPath = path.join('./temp', `${Date.now()}${extension}`);

    m.reply(`📥 Descargando *${filename}*...\n📦 Tamaño: ${(Number(size) / 1048576).toFixed(2)} MB`);

    const res = await fetch(direct_url);
    if (!res.ok) throw '❌ Error al descargar el archivo desde el enlace.';

    const buffer = await res.buffer();
    await fs.writeFile(tempPath, buffer);

    await conn.sendMessage(m.chat, {
      document: { url: `./${tempPath}` },
      fileName: filename,
      mimetype: 'application/octet-stream',
      caption: `📁 Archivo desde Terabox:\n\n📄 *Nombre:* ${filename}\n📦 *Tamaño:* ${(Number(size) / 1048576).toFixed(2)} MB`
    }, { quoted: m });

    await fs.unlink(tempPath); // elimina archivo temporal

  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al descargar o enviar el archivo.');
  }
};

handler.help = ['terabox <url>'];
handler.tags = ['downloader'];
handler.command = ['terabox'];
handler.group = false;
handler.register = true;

export default handler;