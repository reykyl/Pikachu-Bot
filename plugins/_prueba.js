let handler = async (m, { conn, command }) => {
  const code = `
const fetch = require('node-fetch');

let handler = async (m, { conn, args }) => {
  let url = args[0];
  if (!url) throw '🚫 Ingresa una URL de Instagram.';

  let res = await fetch(\`https://api-instagram.fake/api?url=\${url}\`);
  let json = await res.json();

  if (!json.result) throw '❌ No se pudo obtener el contenido.';

  await conn.sendFile(m.chat, json.result.url, 'insta.mp4', '✅ Descargado con éxito.', m);
};

handler.command = /^instagram|ig(dl)?$/i;
module.exports = handler;
`.trim()

  await conn.sendMessage(m.chat, {
    text: `🍄 *Instagram Downloader*\n\n` +
          '```js\n' + code + '\n```',
    contextInfo: {
      externalAdReply: {
        title: '🍄 Instagram Downloader',
        body: "𝘴ყℓρԋιҽttҽ's | αlphα v1",
        renderLargerThumbnail: true,
        mediaType: 1,
        thumbnailUrl: 'https://telegra.ph/file/4132fa15b4b7d238a6f40.jpg',
        sourceUrl: 'https://github.com/Deylin-Eliac'
      }
    }
  }, { quoted: m })
}
handler.command = /^igcode$/i;
export default handler