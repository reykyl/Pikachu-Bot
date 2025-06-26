import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const res = await fetch('https://www.reddit.com/r/nsfw.json?limit=50');
    const json = await res.json();
    const posts = json.data.children.filter(post => post.data.post_hint === 'image');

    if (!posts.length) {
      return conn.reply(m.chat, '⚠️ No se encontró contenido NSFW por ahora.', m);
    }

    
    const post = posts[Math.floor(Math.random() * posts.length)].data;
    const image = post.url_overridden_by_dest || post.url;
    const title = post.title;
    const author = post.author;

    await conn.sendFile(m.chat, image, 'nsfw.jpg', `🔞 *${title}*\n👤 u/${author}\n📍 r/nsfw`, m);
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ Hubo un error al obtener el contenido NSFW.', m);
  }
};

handler.command = ['nsfw'];
handler.tags = ['nsfw'];
handler.help = ['nsfw'];


export default handler;



//🎰
/*var handler = async (m, { conn }) => 
{
  await conn.reply(m.chat, `hola soy bajo perfil🐉`, m, rcanal)
}

handler.command = ['soy'] 

export default handler*/


//@⁨~NEOTOKIO⁩
/*let handler = async (m, { conn }) => {
  await conn.reply(m.chat, 'Hola ⚡ Cómo estás', m)
}

handler.command = ['hola'] 

export default handler*/


// Deylin 
/*const handler = async (m, { conn, text, usedPrefix, command }) => {

const deve = 'Deylin'
const mi = 'Pikachu-bot'
    return conn.reply(m.chat, `Hola soy: ${mi} fuí desarrollado por: ${deve} 
visita: ${redes}`, m, rcanal)
};
 handler.command = ['xd'];

export default handler;*/