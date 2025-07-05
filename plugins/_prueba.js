import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return await m.reply(`Uso: ${usedPrefix + command} URL_de_qu.ax\nEjemplo:\n${usedPrefix + command} https://qu.ax/abc123`);

  const url = args[0];
  const tmpFileName = `video_${Date.now()}.mp4`;
  const tmpFilePath = path.join('/tmp', tmpFileName); // en Linux /tmp, cambia si usas otro SO

  await m.reply('⏳ Descargando video...');

  // Comando yt-dlp para descargar video mp4
  const cmd = `yt-dlp -f best -o ${tmpFilePath} ${url}`;

  exec(cmd, async (error, stdout, stderr) => {
    if (error) {
      console.error('Error en yt-dlp:', error);
      await m.reply('❌ Error al descargar el video. Asegúrate que la URL es válida.');
      return;
    }

    if (!fs.existsSync(tmpFilePath)) {
      await m.reply('❌ No se pudo descargar el video.');
      return;
    }

    // Enviar video al chat
    await conn.sendMessage(m.chat, { video: fs.readFileSync(tmpFilePath), mimetype: 'video/mp4', caption: '🎥 Aquí tienes tu video de qu.ax' }, { quoted: m });

    // Borrar archivo temporal
    fs.unlinkSync(tmpFilePath);
  });
}

handler.help = ['quax <url>'];
handler.tags = ['downloader'];
handler.command = /^quax$/i;

export default handler;