// Comando simple usando sendButton2 exactamente como lo pediste

let handler = async (m, { conn, command }) => {
  const TEXTO_GG = `🔐 Tu código de vinculación es:\nGAOK-IG36`;
  const FOTOTETA = 'Kirito-Bot'; // Pie de mensaje
  const URLIMG = 'https://i.imgur.com/AaJzNHz.jpeg'; // Imagen de portada
  const COSACOPY = 'GAOK-IG36'; // Esto será el texto que aparece como 'copiable'

  await bot.sendButton2(m.chat, TEXTO_GG, FOTOTETA, URLIMG, [], COSACOPY, null, m);
};

handler.command = /^vincular$/i;

export default handler;