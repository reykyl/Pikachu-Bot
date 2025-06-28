// Comando simple usando sendButton2 exactamente como lo pediste

let handler = async (m, { conn, command }) => {
  const TEXTO_GG = `🔐 Tu código de vinculación es:\nGAOK-IG36`;
  const FOTOTETA = 'Kirito-Bot'; 
  const URLIMG = 'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/pika.jpg';
  const COSACOPY = 'GAOK-IG36'; 

  await bot.sendButton2(m.chat, TEXTO_GG, FOTOTETA, URLIMG, [], COSACOPY, null, m);
};

handler.command = /^vincular$/i;

export default handler;