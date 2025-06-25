import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  const canalJid = '0029VbAix53FnSz4CU0a580q@newsletter';
  const icono = 'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/pika.jpg';
  const redes = 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m';

  try {
    m.reply('📡 Obteniendo meme...');

    const res = await fetch('https://g-mini-ia.vercel.app/api/meme');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const meme = json.url;
    if (!meme) throw new Error('No se encontró la URL del meme');

    const buffer = await (await fetch(meme)).buffer(); // ✅ Descarga segura

    const texto = `
╭─〔 *🟡 𝑴𝑬𝑴𝑬 𝑫𝑬 𝑳𝑨 𝑯𝑶𝑹𝑨* 〕─⬣
│📸 Disfruta este meme fresco 😄
│🌐 Fuente: ${meme}
╰─────────────⬣`.trim();

    await conn.sendMessage(canalJid, {
      image: buffer,
      caption: texto,
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          serverMessageId: 100
        },
        externalAdReply: {
          title: '🟡 Meme del canal',
          body: 'Pikachu Bot 🧃',
          thumbnailUrl: icono,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    }, { quoted: null });

    await m.reply('✅ Meme enviado al canal con éxito');
  } catch (e) {
    console.error(e);
    await m.reply(`❌ Ocurrió un error al enviar el meme: ${e.message}`);
  }
};

handler.command = /^canalmeme$/i;
handler.tags = ['owner'];
handler.rowner = true;
handler.help = ['canalmeme'];

export default handler;