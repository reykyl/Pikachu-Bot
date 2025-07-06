let handler = async (m, { args, usedPrefix, command }) => {
  let texto = args.join(" ");
  if (!texto) throw `🎨 Usa el comando así:\n\n${usedPrefix + command} gato`;

  let promptUrl = `https://playgroundai.com/create?q=${encodeURIComponent(texto)}`;
  let caption = `🎨 *PlaygroundAI*\n\nTu imagen está lista para generarse. Solo abre este enlace y pulsa "Generate":\n🔗 ${promptUrl}`;

  await m.reply(caption);
};

handler.help = ['imagen <texto>'];
handler.tags = ['ia'];
handler.command = /^imagen$/i;

export default handler;