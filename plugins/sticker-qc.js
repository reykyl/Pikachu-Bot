import fetch from 'node-fetch';

const handler = async (m, { conn, text, quoted, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `✏️ Usa el comando así:\n\n*${usedPrefix + command} tu texto aquí*\n\nO responde a un mensaje con *${usedPrefix + command}* para citarlo.`,
      m
    );
  }

  let user = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  let name = await conn.getName(user);
  let profile = await conn.profilePictureUrl(user, 'image').catch(_ => 'https://telegra.ph/file/265c672094dfa87caea19.jpg');

  const quotedText = text || m.quoted?.text || '';
  const quoteData = {
    type: "quote",
    format: "png",
    backgroundColor: "#1e1e1e",
    width: 512,
    height: 512,
    scale: 2,
    messages: [
      {
        avatar: true,
        from: {
          id: 1,
          name,
          photo: { url: profile }
        },
        text: quotedText,
        replyMessage: {}
      }
    ]
  };

  try {
    const res = await fetch('https://bot.lyo.su/quote/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData)
    });

    const buffer = await res.buffer();
    await conn.sendFile(m.chat, buffer, 'quote.png', '', m);
  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '❌ Error al generar el quote. Intenta de nuevo.', m);
  }
};

handler.help = ['qc <texto>'];
handler.tags = ['fun'];
handler.command = /^qc$/i;

export default handler;