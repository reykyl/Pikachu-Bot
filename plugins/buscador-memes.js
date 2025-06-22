import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    const res = await fetch('https://g-mini-ia.vercel.app/api/meme');
    if (!res.ok) throw await res.text();
    
    const json = await res.json();
    if (!json.url) return m.reply('No se encontró un meme 😿');

    await conn.sendMessage(m.chat, {
      image: { url: json.url },
      caption: `🧠 *${json.title}*\n\n📤 *Subreddit:* ${json.subreddit}\n🧑 *Autor:* ${json.autor}\n👍 *Upvotes:* ${json.subidas}\n🔗 *Link:* ${json.postLink}`
    }, { quoted: m });

  } catch (e) {
    console.error('[ERROR MEME]', e);
    m.reply('😿 Ocurrió un error al obtener el meme.');
  }
};

handler.help = ['meme'];
handler.tags = ['fun'];
handler.command = ['meme', 'memes'];

export default handler;