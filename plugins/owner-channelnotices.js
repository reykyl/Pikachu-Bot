import axios from 'axios';

const handler = async (m, { conn }) => {
  try {
    const res = await axios.get('https://g-mini-ia.vercel.app/api/meme');
    const memeUrl = res.data.url;

    if (!memeUrl) {
      return m.reply('❌ No se pudo obtener el meme.');
    }

    await conn.sendMessage('0029VbAix53FnSz4CU0a580q@newsletter', {
      image: { url: memeUrl },
      caption: '> ❀ *Meme destacado* ❀,
    });

    m.reply('> Meme enviado al canal :D');
  } catch (e) {
    console.error(e);
    m.reply('Hubo un error al intentar enviar el meme :C');
  }
};

handler.command = ['enviarmeme'];

export default handler;