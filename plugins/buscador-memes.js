import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    let res = await fetch('https://tu-app.vercel.app/api/meme')
let json = await res.json()
let meme = json.url
conn.sendFile(m.chat, meme, 'meme.jpg', 'Aquí tienes un meme 😄', m)

  } catch (e) {
    console.error('[ERROR MEME]', e);
    m.reply('😿 Ocurrió un error al obtener el meme.');
  }
};

handler.help = ['meme'];
handler.tags = ['fun'];
handler.command = ['meme', 'memes'];

export default handler;