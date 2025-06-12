import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import P from 'pino';

const { state, saveCreds } = await useMultiFileAuthState('auth');
const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: P({ level: 'silent' }),
    syncFullHistory: false,
});

const partidas = {};
const EMOJI_TITULAR = '❤️';
const EMOJI_SUPLENTE = '👍';
const MAX_TITULARES = 4;
const MAX_SUPLENTES = 2;

function generarMensaje(titulares, suplentes) {
    const t = titulares.map((u, i) => `${i === 0 ? '⚡' : '🥷🏻'} ┇ @${u.split('@')[0]}`);
    const s = suplentes.map(u => `🥷🏻 ┇ @${u.split('@')[0]}`);
    while (t.length < MAX_TITULARES) t.push('⚡ ┇');
    while (s.length < MAX_SUPLENTES) s.push('🥷🏻 ┇');
    return `
╭──────⚔──────╮
           4 𝐕𝐒 4 
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

// Escucha comandos simples en grupos
sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message?.conversation) return;
    const text = m.message.conversation;
    const chat = m.key.remoteJid;

    if (text === '.4vs4') {
        partidas[chat] = {
            titulares: [],
            suplentes: [],
            finalizado: false,
            msgId: null,
            msgKey: null
        };
        const enviado = await sock.sendMessage(chat, {
            text: generarMensaje([], []),
            mentions: [],
        });
        partidas[chat].msgId = enviado.key.id;
        partidas[chat].msgKey = enviado.key;
    }
});

// Escucha reacciones
sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m?.message?.reactionMessage) return;

    console.log('[🎯 Reacción detectada]', m.message.reactionMessage.text);

    const chat = m.key.remoteJid;
    const id = m.message.reactionMessage.key.id;
    const emoji = m.message.reactionMessage.text;
    const user = m.message.reactionMessage.key.participant;

    const partida = partidas[chat];
    if (!partida || partida.msgId !== id || partida.finalizado) return;
    if (partida.titulares.includes(user) || partida.suplentes.includes(user)) return;

    if (emoji === EMOJI_TITULAR && partida.titulares.length < MAX_TITULARES) {
        partida.titulares.push(user);
    } else if (emoji === EMOJI_SUPLENTE && partida.suplentes.length < MAX_SUPLENTES) {
        partida.suplentes.push(user);
    } else {
        return;
    }

    const completo = partida.titulares.length === MAX_TITULARES && partida.suplentes.length === MAX_SUPLENTES;
    if (completo) partida.finalizado = true;

    try {
        await sock.sendMessage(chat, { delete: partida.msgKey });
    } catch (e) {
        console.log('❌ Error borrando mensaje:', e);
    }

    const nuevo = await sock.sendMessage(chat, {
        text: generarMensaje(partida.titulares, partida.suplentes),
        mentions: [...partida.titulares, ...partida.suplentes],
    });

    partida.msgId = nuevo.key.id;
    partida.msgKey = nuevo.key;
});

// Guardar credenciales
sock.ev.on('creds.update', saveCreds);