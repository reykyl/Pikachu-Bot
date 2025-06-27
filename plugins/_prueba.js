import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    const nombre = await conn.getName(m.sender);
    const texto = `Hola ${nombre}, ¿Cómo estás?`;
    const ownerName = '𝐃𝐞𝐲𝐥𝐢𝐧';
    const botName = 'Pikachu-Bot'; 
    const redes = 'https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o'; 
    const prefix = ['.', '⚡', '/', '#'].sort(() => 0.5 - Math.random())[0];
    const comando = ['menu', 'help'].sort(() => 0.5 - Math.random())[0];

    let profile;
    try {
      profile = await conn.profilePictureUrl(m.sender, 'image');
    } catch {
      profile = 'https://files.catbox.moe/651gmb.jpg';
    }

    const xdd = {
      "key": {
        "fromMe": false,
        "participant": "0@s.whatsapp.net",
        "remoteJid": "0@s.whatsapp.net"
      },
      "message": {
        "groupInviteMessage": {
          "groupJid": "120363297867770433@g.us",
          "inviteCode": "G9zQlCHDBrn99wcC2FyWgm",
          "groupName": "𝙷𝙾𝙻𝙰 𝚄𝚂𝚄𝙰𝚁𝙸𝙾",
          "caption": "𝙷𝙾𝙻𝙰, ¿𝙲𝙾𝙼𝙾 𝚃𝙴 𝙿𝚄𝙴𝙳𝙾 𝙰𝚈𝚄𝙳𝙰𝚁?",
          "jpegThumbnail": await (await fetch(profile)).buffer()
        }
      }
    };

    const xddd = {
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363415670808219@newsletter",
          serverMessageId: 100,
          newsletterName: "Cuervo Betas"
        },
        externalAdReply: {
          showAdAttribution: true,
          title: "Betas",
          body: "Lo Goad",
          mediaUrl: null,
          description: null,
          previewType: "PHOTO",
          thumbnailUrl: profile,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    };

    const imgUrl = `https://api.dorratz.com/v3/text-image?text=${encodeURIComponent(texto)}&fontSize=50`;
    const img = await fetch(imgUrl).then(res => res.buffer());

    const mensaje = `
╭┈ ↷
│✰ 𝙷𝙾𝙻𝙰 𝚄𝚂𝚄𝙰𝚁𝙸𝙾: ${nombre}
│ᰔᩚ Soy ${botName}
│❀ 𝙲𝚁𝙴𝙰𝙳𝙾𝚁: ${ownerName}
│✦ 𝙼𝙴𝙽𝚄: ${prefix + comando}
│⌬ 𝚄𝚁𝙻: ${redes}
╰─────────────────`;

    await conn.sendFile(m.chat, img, 'pikachu-bienvenida.jpg', mensaje.trim(), xdd, null, xddd);

  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, '𝙷𝙾𝙻𝙰 𝚄𝚂𝚄𝙰𝚁𝙸𝙾, ¿𝙲𝙾𝙼𝙾 𝚃𝙴 𝙿𝚄𝙴𝙳𝙾 𝙰𝚈𝚄𝙳𝙰𝚁?', 'conversation', { quoted: xdd });
  }
};

handler.command = ['hola'];
handler.group = true;

export default handler;