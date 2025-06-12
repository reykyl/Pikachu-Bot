const partidas = {};

const EMOJI_TITULAR = '❤️';
const EMOJI_SUPLENTE = '👍';
const MAX_TITULARES = 4;
const MAX_SUPLENTES = 2;

function generarMensaje(titulares, suplentes) {
    const t = titulares.map((u, i) => `${i === 0 ? '👑' : '🥷🏻'} ┇ @${u.split('@')[0]}`);
    const s = suplentes.map(u => `🥷🏻 ┇ @${u.split('@')[0]}`);

    while (t.length < MAX_TITULARES) t.push('🥷🏻 ┇');
    while (s.length < MAX_SUPLENTES) s.push('🥷🏻 ┇');

    return `
╭──────⚔──────╮
           4 𝐕𝐄𝐑𝐒𝐔𝐒 4 
              *COMPE*
╰──────⚔──────╯

𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1

${t.join('\n')}

ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
${s.join('\n')}

*Reacciona con:*
❤️ para titular
👍 para suplente`.trim();
}

// Comando .4vs4
const handler = async (m, { conn }) => {
    if (!m.isGroup) throw 'Este comando solo funciona en grupos.';

    const chat = m.chat;
    partidas[chat] = {
        titulares: [],
        suplentes: [],
        finalizado: false,
        msgId: null,
        msgKey: null
    };

    const texto = generarMensaje([], []);
    const enviado = await conn.sendMessage(chat, {
        text: texto,
        mentions: [],
    });

    partidas[chat].msgId = enviado.key.id;
    partidas[chat].msgKey = enviado.key;
};

handler.help = ['4vs4'];
handler.tags = ['V/S'];
handler.command = ['4vs4'];
handler.group = true;

export default handler;

// Exportamos partidas para el listener
export { partidas, EMOJI_TITULAR, EMOJI_SUPLENTE, MAX_TITULARES, MAX_SUPLENTES, generarMensaje };