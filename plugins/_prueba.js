/** * Created By LUA SER OFC
 * CopyRight 2024 MIT License
 * My Github : https://github.com/xxirfanx
 * My Instagram : https://instagram.com/luaserofc
 * My Youtube : https://youtube.com/@luaserofc
*/

import yts from 'yt-search';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  // --- Paso 1: Manejo de errores inicial con try...catch ---
  try {
    // --- Paso 2: Verificar si se proporcionó texto ---
    if (!text) {
      console.log(`[DEBUG] No se proporcionó texto para el comando ${command}.`);
      throw `🦄 Usa un ejemplo: *${usedPrefix + command}* Somewhere Only We Know`;
    }

    console.log(`[DEBUG] Buscando en YouTube: "${text}"`);
    let res = await yts(text);
    console.log(`[DEBUG] Resultados de la búsqueda: ${res.videos.length} videos encontrados.`);

    let vid = res.videos[0];

    // --- Paso 3: Verificar si se encontró un video ---
    if (!vid) {
      console.log(`[DEBUG] No se encontró ningún video para la búsqueda: "${text}"`);
      throw `🍊 No se encontró audio para el título de la canción.`;
    }

    // Desestructuración de propiedades del video para mayor claridad
    let { title, description, thumbnail, videoId, timestamp, views, ago, url } = vid;

    // --- Paso 4: Reaccionar al mensaje (esto ocurre primero) ---
    m.react(`🐢`); 
    console.log(`[DEBUG] Reacción enviada: 🐢`);

    // --- Paso 5: Construir el mensaje a enviar ---
    let playMessage = `
📺 *Título:* ${title}
⌛ *Duración:* ${timestamp}
👀 *Vistas:* ${views.toLocaleString()}
📅 *Subido hace:* ${ago}
`;
    
    // --- Paso 6: Intentar enviar el mensaje con botón ---
    console.log(`[DEBUG] Intentando enviar mensaje con botón.`);
    console.log(`[DEBUG] Thumbnail URL: ${thumbnail}`);
    console.log(`[DEBUG] URL para el botón MP3: ${usedPrefix}vfmp3 ${url}`);

    await conn.sendButton2(
      m.chat, 
      playMessage, 
      '> Zoro md', // Footer del botón
      thumbnail,  // URL de la miniatura
      [['🎶 MP3', `${usedPrefix}vfmp3 ${url}`]], // Array de botones
      null, 
      null, 
      m // Mensaje original para responder
    );
    console.log(`[DEBUG] Función sendButton2 ejecutada, mensaje enviado (o intento de envío).`);

  } catch (e) {
    // --- Paso 7: Capturar y registrar cualquier error ---
    console.error(`[ERROR] Ocurrió un error en el handler 'play':`, e);
    // Puedes elegir cómo responder al usuario en caso de un error interno
    if (typeof e === 'string') {
        // Si el error es uno de los nuestros (los que 'throw' como string)
        await conn.sendMessage(m.chat, { text: e }, { quoted: m });
    } else {
        // Para otros errores inesperados
        await conn.sendMessage(m.chat, { text: `❌ Ocurrió un error inesperado al procesar tu solicitud.` }, { quoted: m });
    }
  }
}

// --- Configuración del handler ---
handler.help = ['play'].map((v) => v + ' <query>')
handler.tags = ['downloader']
handler.command = ['play', 'song']

export default handler;
