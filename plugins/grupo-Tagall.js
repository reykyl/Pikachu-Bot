const wm = '𝑷𝒊𝒌𝒂𝒄𝒉𝒖 𝑩𝒐𝒕'; // Define aquí el nombre de tu bot o el texto que quieras mostrar como firma

const handler = async (m, {isOwner, isAdmin, conn, text, participants, args, command, usedPrefix}) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }
  const pesan = args.join` `;
  const oi = `${pesan}`;
  let teks = `𝑷𝑰𝑲𝑨𝑪𝑯𝑼 𝑻𝑬 𝑵𝑬𝑪𝑬𝑺𝑰𝑻𝑨 🟡 .\n\nMensaje: ${oi}\n\n`;
  for (const mem of participants) {
    teks += `⚡ @${mem.id.split('@')[0]}\n`;
  }
  teks += `${wm}\n\n`; // Se agrega la firma wm aquí
  conn.sendMessage(m.chat, {text: teks, mentions: participants.map((a) => a.id)} );
};

handler.help = ['tagall <mensaje>', 'invocar <mensaje>'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|invocacion|todos|Pikachus|invocación)$/i;
handler.admin = true;
handler.group = true;
export default handler;