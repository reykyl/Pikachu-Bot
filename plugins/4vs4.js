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

// Comando .compe
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
    const enviado = await conn.sendMessage(chat, { text: texto });

    partidas[chat].msgId = enviado.key.id;
    partidas[chat].msgKey = enviado.key;
};

handler.help = ['4vs4'];
handler.tags = ['V/S'];
handler.command = ['4vs4'];
handler.group = true;

export default handler;

// Middleware de reacciones (funciona como before.js o listener global)
export async function before(m, { conn }) {
    if (!m.isGroup || !m.messageStubType) return;

    const chat = m.key.remoteJid;
    const id = m.key.id;
    const emoji = m.messageStubParameters?.[0];
    const user = m.participant;

    const partida = partidas[chat];
    if (!partida || partida.msgId !== id || partida.finalizado) return;
    if (!emoji || (emoji !== EMOJI_TITULAR && emoji !== EMOJI_SUPLENTE)) return;

    const yaEnLista = partida.titulares.includes(user) || partida.suplentes.includes(user);
    if (yaEnLista) return;

    if (emoji === EMOJI_TITULAR && partida.titulares.length < MAX_TITULARES) {
        partida.titulares.push(user);
    } else if (emoji === EMOJI_SUPLENTE && partida.suplentes.length < MAX_SUPLENTES) {
        partida.suplentes.push(user);
    } else {
        return; // No se puede agregar más
    }

    const completo = partida.titulares.length === MAX_TITULARES && partida.suplentes.length === MAX_SUPLENTES;
    if (completo) {
        partida.finalizado = true;
        return; // No se borra ni se manda nuevo mensaje
    }

    // Borrar mensaje anterior
    await conn.sendMessage(chat, { delete: partida.msgKey });

    const texto = generarMensaje(partida.titulares, partida.suplentes);
    const enviado = await conn.sendMessage(chat, {
        text: texto,
        mentions: [...partida.titulares, ...partida.suplentes]
    });

    partida.msgId = enviado.key.id;
    partida.msgKey = enviado.key;
}