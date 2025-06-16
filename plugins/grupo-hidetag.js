import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants, usedPrefix, command }) => {
  const mensajeTexto = m.text?.toLowerCase().trim() || '';
  const comandos = ['hidetag', 'tag', 'notificar', 'notify', 'n'];

  // Verifica si el texto empieza con un comando válido (con o sin prefijo)
  const match = comandos.find(cmd => mensajeTexto.startsWith(cmd) || mensajeTexto.startsWith(usedPrefix + cmd));
  if (!match) return; // Si no es uno de los comandos válidos, no continúa

  let users = participants.map(u => conn.decodeJid(u.id));
  let tagText = text ? text : (m.quoted?.text || "*¡Pika Pika saludos!* ⚡");
  let newText = `${tagText}\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡`;

  try {
    let q = m.quoted || m;
    let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender;

    let msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        {
          [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted
            ? c.message[q.mtype]
            : { text: '' || c },
        },
        { quoted: null, userJid: conn.user.id }
      ),
      newText,
      conn.user.jid,
      { mentions: users }
    );
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch {
    // En caso de error, reintenta con método alternativo
    let quoted = m.quoted || m;
    let mime = (quoted.msg || quoted).mimetype || '';
    let isMedia = /image|video|sticker|audio/.test(mime);
    let masss = String.fromCharCode(8206).repeat(850);
    let htextos = `${tagText}\n\n> ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 𝙈𝘿 ⚡`;

    if (isMedia && quoted.mtype === 'imageMessage') {
      var mediax = await quoted.download?.();
      conn.sendMessage(m.chat, { image: mediax, mentions: users, caption: htextos }, { quoted: null });
    } else if (isMedia && quoted.mtype === 'videoMessage') {
      var mediax = await quoted.download?.();
      conn.sendMessage(m.chat, { video: mediax, mentions: users, caption: htextos }, { quoted: null });
    } else if (isMedia && quoted.mtype === 'audioMessage') {
      var mediax = await quoted.download?.();
      conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4' }, { quoted: null });
    } else if (isMedia && quoted.mtype === 'stickerMessage') {
      var mediax = await quoted.download?.();
      conn.sendMessage(m.chat, { sticker: mediax, mentions: users }, { quoted: null });
    } else {
      await conn.sendMessage(m.chat, {
        text: `${masss}\n${htextos}`,
        mentions: users
      }, { quoted: null });
    }
  }
};

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = /^$/ // evitamos el sistema estándar
handler.group = true
handler.admin = true

export default handler;