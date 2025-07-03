import fetch from 'node-fetch';

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`${emojis} Escribe una palabra para buscar en YouTube.\n\nEjemplo:\n*${command} bad bunny*`);

  try {
    const response = await fetch(`https://ytumode-api.vercel.app/api/search?q=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.status || !data.results || data.results.length === 0) {
      return m.reply('${msm} No se encontraron resultados.');
    }

    let texto = `🔎 *Resultados de búsqueda para:* ${text}\n\n`;
    for (let i = 0; i < data.results.length; i++) {
      let vid = data.results[i];
      texto += `
> 🎬 *${vid.title}*
> 👤 ${vid.author}
> 🕒 ${vid.timestamp} 
> 👁 ${vid.views.toLocaleString()}
> 🔗 ${vid.url}\n\n-------------------------`;
    }

    conn.sendMessage(m.chat, { text: texto.trim() }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(`❌ Ocurrió un error al buscar.\n\n${e.message}`);
  }
};

handler.command = ['ytsearch'];
handler.help = ['ytsearch <texto>'];
handler.tags = ['search'];

export default handler;