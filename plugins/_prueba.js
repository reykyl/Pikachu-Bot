import fetch from 'node-fetch';

const canalJid = '0029VbAix53FnSz4CU0a580q@newsletter'; 
const icono = 'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/pika.jpg';
const redes = 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m';

export function iniciarMemeAutomatico(conn) {
  const enviarMeme = async () => {
    try {
      console.log('[⋯] Obteniendo meme...');
      const res = await fetch('https://g-mini-ia.vercel.app/api/meme');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const meme = json.url;
      if (!meme) throw new Error('No se encontró la URL del meme');

      const texto = `
╭─〔 *🟡 𝑴𝑬𝑴𝑬 𝑫𝑬 𝑳𝑨 𝑯𝑶𝑹𝑨* 〕─⬣
│📸 Disfruta este meme fresco 😄
│🌐 Fuente: ${meme}
╰─────────────⬣`.trim();

      await conn.sendMessage(canalJid, {
        image: { url: meme },
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
      }, { upload: conn.waUploadToServer });

      console.log('[✓] Meme enviado correctamente al canal.');
    } catch (e) {
      console.warn('[✗] Error al obtener o enviar meme:', e.message);
    }
  };

  enviarMeme(); // Envío inicial
  setInterval(enviarMeme, 5 * 60 * 1000); // Cada 5 minutos
}